# Connected operating workflows

Edition 1.0 · Proposed guarded workflows. Open [WORKFLOW-MAPS.html](WORKFLOW-MAPS.html) for rendered diagrams. Each map is one relationship/decision sequence; sources below remain editable Mermaid definitions. Data/payment/provider actions also follow specs 63–76. Diagrams do not replace detailed rule and permission contracts.

## Team invitation and access

```mermaid
flowchart TD
  a["Owner defines role and work scope"]
  b["Create expiring invitation"]
  c["Recipient verifies and accepts"]
  d["Activate scoped membership"]
  e["Open permitted workspace"]
  f["Invalid or expired invitation"]
  g["Revoke old token and reinvite"]
  a -->|review| b
  b -->|claim| c
  c -->|valid| d
  d -->|authorise| e
  c -->|invalid| f
  f -->|recover| g
  g -->|new invite| b
```

## Professional profile publication

```mermaid
flowchart TD
  a["Member edits permitted fields"]
  b["Save merchant-scoped draft"]
  c["Owner reviews content and rights"]
  d["Publish profile version"]
  e["Link opens eligible staff booking"]
  f["Changes needed"]
  g["Private feedback to member"]
  a -->|save| b
  b -->|approval required| c
  c -->|approve| d
  d -->|share| e
  c -->|return| f
  f -->|explain| g
  g -->|revise| a
```

## Booking and payment commitment

```mermaid
flowchart TD
  a["Customer reviews current agreement"]
  b["Reserve time or capacity"]
  c["Start tracked payment if required"]
  d["Verify payment and live reservation"]
  e["Commit booking and notify through outbox"]
  f["Conflict or uncertain outcome"]
  g["Reconcile or offer valid alternatives"]
  h["Compensate money if commitment impossible"]
  a -->|submit| b
  b -->|eligible| c
  c -->|provider result| d
  d -->|safe commit| e
  b -->|unavailable| f
  c -->|uncertain| f
  f -->|preserve input| g
  g -->|verified| d
  g -->|cannot fulfil| h
```

## Safe rescheduling

```mermaid
flowchart TD
  a["Read current confirmed booking version"]
  b["Hold eligible replacement resources"]
  c["Review time price and policy difference"]
  d["Commit swap under version guard"]
  e["Release old capacity and communicate"]
  f["Replacement unavailable or declined"]
  g["Keep original booking intact"]
  a -->|choose| b
  b -->|available| c
  c -->|accept valid change| d
  d -->|atomic local change| e
  b -->|conflict| f
  c -->|cancel change| f
  f -->|recover| g
```

## Cancellation and refund

```mermaid
flowchart TD
  a["Resolve actor agreement and rights"]
  b["Calculate reviewed operational and money impact"]
  c["Customer or authorised operator confirms"]
  d["Cancel work and release resources"]
  e["Track refund credit and reward adjustments"]
  f["Rule or authority not satisfied"]
  g["Offer clarification or scoped case"]
  a -->|evaluate| b
  b -->|show consequence| c
  c -->|authorised| d
  d -->|idempotent follow-ups| e
  b -->|blocked| f
  f -->|recover| g
```

## Waitlist offer and expiry

```mermaid
flowchart TD
  a["Seat capacity becomes available"]
  b["Choose eligible queue entry and quantity"]
  c["Hold seats and send time-limited offer"]
  d["Customer accepts current terms"]
  e["Commit eligible paid or free booking"]
  f["Offer expires or customer declines"]
  g["Release hold and consider next entry"]
  a -->|evaluate| b
  b -->|quantity fits| c
  c -->|within expiry| d
  d -->|valid commitment| e
  c -->|no acceptance| f
  f -->|once| g
  g -->|continue queue| b
```

## Return disposition and money

```mermaid
flowchart TD
  a["Customer identifies order lines and issue"]
  b["Evaluate applicable rights and return route"]
  c["Receive or otherwise resolve evidence"]
  d["Record line disposition"]
  e["Apply eligible refund and ledger effects"]
  f["Item damaged or not sellable"]
  g["Keep out of available stock"]
  a -->|request| b
  b -->|authorise process| c
  c -->|inspect| d
  d -->|financial workflow| e
  d -->|stock disposition| f
  f -->|separate from refund| g
```

## Team departure

```mermaid
flowchart TD
  a["Owner starts access removal"]
  b["Revoke private authority and sessions"]
  c["Review future work and public profile"]
  d["Agree reassignment or cancellation"]
  e["Update links and archive membership"]
  f["No authorised replacement"]
  g["Customer contact and appropriate remedy"]
  a -->|protect access| b
  b -->|preserve history| c
  c -->|review impact| d
  d -->|communicate| e
  c -->|unresolved work| f
  f -->|accountable owner| g
  g -->|resolved plan| e
```

## Private data request

```mermaid
flowchart TD
  a["Receive rights request"]
  b["Verify requester and record scope"]
  c["Determine roles deadlines and lawful retention"]
  d["Review export redaction or deletion plan"]
  e["Deliver securely and record outcome"]
  f["Authority or scope unclear"]
  g["Seek proportionate clarification"]
  a -->|intake| b
  b -->|verified| c
  c -->|assess| d
  d -->|execute| e
  b -->|unclear| f
  f -->|clarify| g
  g -->|reassess| b
```

## Merchant closure

```mermaid
flowchart TD
  a["Verified owner reviews closure impact"]
  b["Plan work money data domains and hardware"]
  c["Stop new commitments at effective time"]
  d["Resolve or assign outstanding obligations"]
  e["Export restrict and retain appropriately"]
  f["Provider or dispute still pending"]
  g["Retain accountable recovery case"]
  a -->|review| b
  b -->|confirm plan| c
  c -->|wind down| d
  d -->|complete scope| e
  d -->|unresolved| f
  f -->|track| g
  g -->|reconcile| d
```

## Policy change to enforced behaviour

```mermaid
flowchart TD
  a["Identify current source and affected scope"]
  b["Obtain qualified interpretation"]
  c["Version policies and product rules"]
  d["Update screens commands notices and support"]
  e["Release on verified effective schedule"]
  f["Existing agreements affected"]
  g["Review permitted treatment and communication"]
  a -->|assess| b
  b -->|define| c
  c -->|implement| d
  d -->|verify| e
  c -->|impact| f
  f -->|review| g
  g -->|apply| d
```

