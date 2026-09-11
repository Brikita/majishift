"""Explicit one-action SDK runner. No training or uploads run on import."""
import argparse
import hashlib
import time
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument('--list-models', action='store_true')
    action.add_argument('--upload', type=Path)
    action.add_argument('--train', metavar='DATASET_ID')
    action.add_argument('--status', metavar='RUN_ID')
    parser.add_argument('--model')
    parser.add_argument('--run-key')
    args = parser.parse_args()
    from adaption import Adaption
    client = Adaption()
    if args.list_models:
        for model in client.autoscientist.list_models().models:
            print(model.id)
    elif args.upload:
        import httpx
        data = args.upload.read_bytes()
        dataset = client.datasets.create(source={
            'name': args.upload.name, 'file_format': 'csv', 'processing_mode': 'raw',
            'column_mapping': {'prompt': 'instruction', 'completion': 'response'},
        })
        print('Dataset ID (retain for recovery):', dataset.dataset_id, flush=True)
        response = httpx.put(dataset.upload_instructions.url, content=data, timeout=60)
        response.raise_for_status()
        client.datasets.upload.complete_by_id(dataset.dataset_id, file_size_bytes=len(data), sha256=hashlib.sha256(data).hexdigest())
        deadline = time.monotonic() + 300
        while time.monotonic() < deadline:
            status = client.datasets.get_status(dataset.dataset_id)
            if status.status == 'failed':
                raise RuntimeError('Dataset ingestion failed; inspect dataset in account.')
            if status.row_count is not None:
                print('Ready rows:', status.row_count)
                return
            time.sleep(5)
        raise TimeoutError('Ingestion still pending. Retain dataset ID; do not re-upload blindly.')
    elif args.train:
        if not args.model or not args.run_key:
            parser.error('--train requires --model and --run-key; inspect credits before submission')
        models = {m.id for m in client.autoscientist.list_models().models}
        if args.model not in models:
            parser.error('Model not available in the current account')
        run = client.autoscientist.create(dataset_id=args.train, model=args.model,
            training_type='lora', max_iterations=1, augmentation_domain_rows=0,
            augmentation_general_rows=0, idempotency_key=args.run_key)
        print('Run:', run.id, 'Status:', run.status)
    elif args.status:
        run = client.autoscientist.get(args.status)
        print('Run:', run.id, 'Status:', run.status, 'Download available:', run.download_available)

if __name__ == '__main__':
    main()
