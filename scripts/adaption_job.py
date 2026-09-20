"""Explicit one-action SDK runner. No training or uploads run on import."""
import argparse
import hashlib
import time
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument('--list-models', action='store_true')
    action.add_argument('--dataset-status', metavar='DATASET_ID')
    action.add_argument('--list-runs', metavar='DATASET_ID')
    action.add_argument('--upload', type=Path)
    action.add_argument('--train', metavar='DATASET_ID')
    action.add_argument('--status', metavar='RUN_ID')
    action.add_argument('--download', metavar='RUN_ID')
    parser.add_argument('--model')
    parser.add_argument('--run-key')
    parser.add_argument('--prompt-column')
    parser.add_argument('--completion-column')
    parser.add_argument('--domain-rows', type=int, default=0)
    parser.add_argument('--general-rows', type=int, default=0)
    parser.add_argument('--iterations', type=int, default=3)
    parser.add_argument('--target-win-rate', type=float, default=0.8)
    parser.add_argument('--voucher')
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    from adaption import Adaption
    client = Adaption()
    if args.list_models:
        for model in client.autoscientist.list_models().models:
            print(model.id)
    elif args.dataset_status:
        status = client.datasets.get_status(args.dataset_status)
        print(status.model_dump_json(indent=2))
    elif args.list_runs:
        for run in client.autoscientist.list(dataset_id=args.list_runs, limit=100):
            print(run.model_dump_json())
    elif args.upload:
        import httpx
        data = args.upload.read_bytes()
        upload_prompt = args.prompt_column or 'instruction'
        upload_completion = args.completion_column or 'response'
        dataset = client.datasets.create(source={
            'name': args.upload.name, 'file_format': 'csv', 'processing_mode': 'raw',
            'column_mapping': {
                'prompt': upload_prompt,
                'completion': upload_completion,
            },
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
        if bool(args.prompt_column) != bool(args.completion_column):
            parser.error('--prompt-column and --completion-column must be supplied together')
        models = {m.id for m in client.autoscientist.list_models().models}
        if args.model not in models:
            parser.error('Model not available in the current account')
        request = {
            'dataset_id': args.train,
            'model': args.model,
            'training_method': 'instruction',
            'max_iterations': args.iterations,
            'target_win_rate': args.target_win_rate,
            'augmentation_domain_rows': args.domain_rows,
            'augmentation_general_rows': args.general_rows,
            'idempotency_key': args.run_key,
        }
        if args.prompt_column:
            request['column_mapping'] = {
                'prompt': args.prompt_column,
                'completion': args.completion_column,
            }
        if args.voucher:
            request['voucher'] = args.voucher
        run = client.autoscientist.create(**request)
        print('Run:', run.id, 'Status:', run.status)
    elif args.status:
        run = client.autoscientist.get(args.status)
        print(run.model_dump_json(indent=2))
    elif args.download:
        if not args.output:
            parser.error('--download requires --output')
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with client.autoscientist.with_streaming_response.download(args.download) as response:
            response.stream_to_file(args.output)
        print('Downloaded:', args.output, 'Bytes:', args.output.stat().st_size)

if __name__ == '__main__':
    main()
