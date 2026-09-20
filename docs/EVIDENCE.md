# Evidence register

Reviewed September 10, 2026. Earlier research is context, not current operational validation.

| Claim | Source | Status |
|---|---|---|
| Historical pumped Ndarugu supply, pond and treatment/irrigation connection | https://openjicareport.jica.go.jp/pdf/11652534_06.pdf | 2001 report; current configuration unverified |
| Historical maintenance and lining concerns | https://openjicareport.jica.go.jp/pdf/11652534_04.pdf | Historical only; no current defect claim |
| Recent treatment equipment procurement | https://www.jkuat.ac.ke/wp-content/uploads/2025/04/JKUAT.-QUARTER.-COLOR.pdf | 2025 tender; completion unverified |
| Public Conduit weather channels, live station display and station 61 feed | https://conduit.jhubafrica.com/ and https://conduit.jhubafrica.com/model.html | Latest observation connected; data dictionary, history, gauge reset semantics and data-owner approval still required |
| AutoScientist SDK workflow | https://docs.adaptionlabs.ai/autoscientist-quickstart/ | Reviewed; not account-tested |
| Training controls and idempotency | https://docs.adaptionlabs.ai/autoscientist/running-autoscientist/ | Reviewed; model availability requires account query |
| Checkpoint export | https://docs.adaptionlabs.ai/autoscientist/download-the-model/ | Separate serving needed |
| JKUAT Dam open-map point (OSM way 330895323) | https://mapcarta.com/W330895323 | Map context only; operator identity/topology confirmation still required |
| JKUAT campus open-map reference (OSM way 128618822) | https://www.openstreetmap.org/way/128618822 | Campus context; not a water-system asset map |

All reservoir and operating numbers are deliberately invented, including capacity (20,000 m³), surface area, initial storage, reserve, demand, pump delivery and outage. When the feed succeeds, the environmental observation card uses the latest public Conduit station reading. The cumulative rain-gauge totals are not converted into a daily increment, so all seven rainfall days remain scenarios. The prototype makes no savings, drinking-water quality, forecast or equipment-control claim.
