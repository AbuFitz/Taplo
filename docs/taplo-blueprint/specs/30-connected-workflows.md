# Connected workflow maps

Status: recommended behaviour. These diagrams describe product responsibilities, not mandatory services.

## Entry and return

```mermaid
flowchart TD
  Entry["Social, NFC, QR or Google"] --> Page["Branded business mini-site"]
  Explore["Explore or Saved"] --> Page
  Page --> Detail["Offer detail"]
  Detail --> Task["Buy, book or request"]
  Task --> Result["Confirmation or request status"]
  Result --> Activity["Private customer activity"]
  Activity --> Page
  Task --> Work["Studio work queue"]
```

Explore/Saved entry retains its return context. Direct entry remains brand-first. A secure private record can require verification without forcing an app installation.

## Product and appointment coordination

```mermaid
flowchart TD
  Review["Validate offer and total"] --> Reserve["Reserve stock and time"]
  Reserve --> Pay["Attempt payment"]
  Pay --> Check{"Authoritative result"}
  Check -->|"Success and valid reservation"| Confirm["Confirm linked commitments"]
  Check -->|"Failure"| Release["Release reservations"]
  Check -->|"Unknown or late"| Recover["Reconcile and recover"]
  Recover --> Confirm
  Recover --> Refund["Refund or request next step"]
```

The result must reflect actual reservation/payment state. Recovery can take time; the customer's UI explains pending status and prevents duplicate purchase attempts.

## Support escalation

```mermaid
flowchart TD
  Issue["Report from affected activity"] --> Classify{"Issue type"}
  Classify --> Merchant["Merchant complaint or return"]
  Classify --> Card["Payment dispute"]
  Classify --> Taplo["Taplo billing, hardware or platform"]
  Merchant --> Case["Case with owner and next step"]
  Card --> Case
  Taplo --> Case
  Case --> Action["Permitted resolution action"]
  Action --> Outcome["Customer update and recorded outcome"]
```

A case can link several tracks. Its status does not replace order, payment, return or dispute status. See 23–24 for permission and deadline rules.
