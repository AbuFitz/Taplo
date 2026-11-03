# Native commerce with a small-owner experience

Status: offering recommendation. Depends on: 10, 12, 16.

Taplo manages its own product catalogue, cart, checkout, orders and fulfilment. Processor infrastructure can supply regulated payment handling; the merchant does not need to connect an existing external shop. Simplicity comes from scoped defaults and clear choices, not from ignoring returns, stock or seller obligations.

Initial physical-product journey: select item/variant/quantity, choose a supported fulfilment method, supply required contact/address, review total and applicable terms, pay, receive confirmation, manage through Activity. Guest checkout is recommended where appropriate, with verified later account access.

Offer simple variants and clear inventory behaviour first. Distinguish finite stock, made-to-order lead times and intentionally permitted backorders. Do not use a generic “available” badge for all three. Show totals and delivery costs before commitment. Retain quote and price versions and revalidate at payment.

Recommend one merchant per checkout initially. A customer may keep separate carts for several businesses. Cross-merchant settlement, fulfilment and refunds are substantial extra scope. A mixed product/service checkout is supported only for compatible rules; separate checkouts can remain coherent and explain why.

Acceptance: two customers cannot both buy the final finite-stock unit. A changed shipping address revalidates fulfilment and cost. Payment failure does not create a confirmed paid order. A delayed processor result shows pending rather than another Pay button that creates a duplicate. A partial refund updates the relevant lines and rewards without erasing the original receipt.
