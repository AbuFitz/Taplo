# Canonical data dictionary

Normative shapes: records.schema.json. Semantic/authority/transaction checks are additional. API ID arrays mapped in relationships.json are projections from FK junctions.

## Money

| Field | Type/constraint | Required |
| --- | --- | --- |
| minor | integer | Yes |
| currency | string | Yes |

## Business

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| display_name | string | Yes |
| legal_name | string | No |
| handle | string | Yes |
| status | string: draft, active, paused, closing, closed | Yes |
| capabilities | array | Yes |
| timezone | string | Yes |
| logo_asset_id | #/$defs/ID | No |
| wordmark_asset_id | #/$defs/ID | No |
| published_page_version | integer | No |
| primary_website_url | string | No |

## User

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| display_name | string | Yes |
| verified_contact_refs | array | Yes |
| status | string: active, suspended, deletion_pending, deleted | Yes |

## Membership

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| user_id | #/$defs/ID | Yes |
| role | string: owner, manager, scheduler, practitioner, fulfilment, finance, support | Yes |
| status | string: invited, active, revoked | Yes |
| location_ids | array | Yes |
| resource_ids | array | Yes |
| grant_ids | array | Yes |

## CustomerRelationship

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| user_id | #/$defs/ID | No |
| guest_contact_ref | #/$defs/ID | No |
| status | string: active, blocked, anonymised | Yes |
| marketing_consent_ref | #/$defs/ID | No |

## Participant

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| display_name | string | Yes |
| kind | string: adult, learner, attendee | Yes |
| guardian_relationship_id | #/$defs/ID | No |
| support_details_ref | #/$defs/ID | No |

## Location

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| label | string | Yes |
| kind | string: public_premises, private, mobile_coverage, online, event | Yes |
| public_address_ref | #/$defs/ID | No |
| private_address_ref | #/$defs/ID | No |
| timezone | string | Yes |
| coverage_rule_id | #/$defs/ID | No |
| visibility | string: public, approximate, private | Yes |

## Offer

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| kind | string: goods, appointment, class, quote | Yes |
| title | string | Yes |
| description | string | No |
| visibility | string: draft, published, paused, archived | Yes |
| price_mode | string: fixed, from, quote, free | Yes |
| price | #/$defs/Money | No |
| policy_version_id | #/$defs/ID | Yes |
| delivery_modes | array | Yes |
| configuration_ref | #/$defs/ID | Yes |

## Variant

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| sku | string | Yes |
| option_values | object | Yes |
| price | #/$defs/Money | Yes |
| inventory_mode | string: tracked, made_to_order, untracked | Yes |
| active | boolean | Yes |

## InventoryBalance

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| variant_id | #/$defs/ID | Yes |
| location_id | #/$defs/ID | Yes |
| on_hand | integer | Yes |
| held | integer | Yes |
| committed | integer | Yes |
| unavailable | integer | Yes |

## InventoryAdjustment

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| balance_id | #/$defs/ID | Yes |
| delta_on_hand | integer | Yes |
| reason | string: received, count, damage, return, fulfilment, correction | Yes |
| origin_ref | #/$defs/ID | Yes |
| actor_id | #/$defs/ID | Yes |

## Resource

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| kind | string: staff, room, equipment, vehicle | Yes |
| label | string | Yes |
| capacity | integer | Yes |
| active | boolean | Yes |

## AvailabilityRule

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| resource_ids | array | Yes |
| timezone | string | Yes |
| local_rule | string | Yes |
| effective_from | #/$defs/Timestamp | Yes |
| effective_until | #/$defs/Timestamp | No |
| exception_refs | array | Yes |

## Session

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| starts_at | #/$defs/Timestamp | Yes |
| ends_at | #/$defs/Timestamp | Yes |
| timezone | string | Yes |
| resource_ids | array | Yes |
| capacity | integer | Yes |
| held_seats | integer | Yes |
| committed_seats | integer | Yes |
| series_id | #/$defs/ID | No |
| occurrence_key | string | No |
| status | string: scheduled, cancelled, completed | Yes |

## Cart

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| status | string: open, converted, expired | Yes |
| lines | array | Yes |
| expires_at | #/$defs/Timestamp | Yes |

## Reservation

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| kind | string: inventory, appointment, session | Yes |
| target_ids | array | Yes |
| quantity | integer | Yes |
| quote_version_id | #/$defs/ID | Yes |
| expires_at | #/$defs/Timestamp | Yes |
| status | string: held, committed, released, expired | Yes |

## AgreementSnapshot

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| seller_name | string | Yes |
| offer_title | string | Yes |
| unit_price | #/$defs/Money | Yes |
| quantity | integer | Yes |
| discount | #/$defs/Money | Yes |
| tax | #/$defs/Money | Yes |
| total | #/$defs/Money | Yes |
| tax_rule_version | string | Yes |
| policy_version_id | #/$defs/ID | Yes |
| fulfilment_mode | string: ship, collect, onsite, mobile, online | Yes |

## Booking

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| participant_ids | array | Yes |
| offer_id | #/$defs/ID | Yes |
| session_id | #/$defs/ID | No |
| location_id | #/$defs/ID | Yes |
| resource_ids | array | Yes |
| starts_at | #/$defs/Timestamp | Yes |
| ends_at | #/$defs/Timestamp | Yes |
| timezone | string | Yes |
| reservation_ids | array | Yes |
| agreement_id | #/$defs/ID | Yes |
| payment_ids | array | Yes |
| status | string: requested, confirmed, declined, expired, cancelled, completed, no_show | Yes |
| previous_version_id | #/$defs/ID | No |

## Order

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| agreement_ids | array | Yes |
| total | #/$defs/Money | Yes |
| payment_ids | array | Yes |
| status | string: pending, accepted, cancelled, closed | Yes |

## Payment

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| order_id | #/$defs/ID | No |
| booking_id | #/$defs/ID | No |
| amount | #/$defs/Money | Yes |
| status | string: created, requires_action, processing, failed, cancelled, succeeded | Yes |
| provider | string | Yes |
| provider_account_ref | string | Yes |
| provider_payment_ref | string | No |
| attempt_id | #/$defs/ID | Yes |
| idempotency_ref | #/$defs/ID | Yes |

## Refund

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| payment_id | #/$defs/ID | Yes |
| amount | #/$defs/Money | Yes |
| reason | string | Yes |
| status | string: requested, processing, failed, succeeded | Yes |
| provider_ref | string | No |
| requested_by | #/$defs/ID | Yes |

## Fulfilment

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| order_id | #/$defs/ID | Yes |
| mode | string: ship, collect | Yes |
| status | string: unfulfilled, preparing, ready, dispatched, completed, cancelled | Yes |
| lines | array | Yes |
| evidence_ref | #/$defs/ID | No |

## Quote

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| scope | string | Yes |
| amount | #/$defs/Money | Yes |
| expires_at | #/$defs/Timestamp | Yes |
| policy_version_id | #/$defs/ID | Yes |
| status | string: draft, sent, accepted, declined, expired, superseded | Yes |
| supersedes_id | #/$defs/ID | No |

## Subscription

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| purpose | string: merchant_customer_membership | Yes |
| amount | #/$defs/Money | Yes |
| cadence | string: month, year | Yes |
| provider_ref | string | No |
| status | string: pending, trial, active, cancelled, past_due | Yes |
| cancel_at_period_end | boolean | Yes |
| period_end | #/$defs/Timestamp | Yes |
| entitlement_version | integer | Yes |

## WaitlistEntry

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| session_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| quantity | integer | Yes |
| joined_at | #/$defs/Timestamp | Yes |
| offer_expires_at | #/$defs/Timestamp | No |
| reservation_id | #/$defs/ID | No |
| status | string: waiting, offered, converted, expired, removed | Yes |

## Conversation

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| linked_record_ids | array | Yes |
| kind | string: merchant, platform_support | Yes |
| status | string: open, closed, blocked | Yes |

## Message

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| conversation_id | #/$defs/ID | Yes |
| sender_id | #/$defs/ID | Yes |
| sender_role | string: customer, merchant, platform_support | Yes |
| text | string | Yes |
| attachment_refs | array | Yes |
| status | string: accepted, delivery_pending, delivered, failed | Yes |
| client_message_key | string | Yes |

## RewardEntry

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | Yes |
| rule_version_id | #/$defs/ID | Yes |
| origin_id | #/$defs/ID | Yes |
| units | integer | Yes |
| kind | string: earn, redeem, reverse, expire, adjust | Yes |
| reverses_id | #/$defs/ID | No |
| programme_id | #/$defs/ID | Yes |

## WalletPass

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| purpose | string: loyalty, business_card | Yes |
| provider | string: apple, google | Yes |
| holder_kind | string: relationship, team_profile, business | Yes |
| holder_id | string | Yes |
| programme_id | string | No |
| public_destination_ref | string | No |
| provider_class_ref | string | No |
| provider_object_ref | string | No |
| apple_pass_type_ref | string | No |
| serial_ref | string | No |
| credential_ref | string | Yes |
| status | string: eligible, issuing, issued, update_pending, failed, revoked | Yes |
| content_revision | integer | Yes |
| provider_checked_at | string | No |

## Domain

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| hostname | string | Yes |
| kind | string: connected, registered | Yes |
| provider_ref | string | No |
| status | string: pending, verifying, failed, active, expired, detached | Yes |
| registrant_ref | #/$defs/ID | No |
| renewal_at | #/$defs/Timestamp | No |
| auto_renew | boolean | Yes |
| is_primary | boolean | Yes |

## HardwareAsset

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| serial_ref | string | Yes |
| claim_proof_hash_ref | #/$defs/ID | Yes |
| redirect_id | #/$defs/ID | Yes |
| status | string: unclaimed, claimed, active, lost, revoked | Yes |
| destination_kind | string: business, offer, review, contact | No |
| destination_id | #/$defs/ID | No |

## SupportCase

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| relationship_id | #/$defs/ID | No |
| linked_record_ids | array | Yes |
| kind | string: technical, merchant_service, payment, privacy, moderation, hardware, domain | Yes |
| priority | string: urgent, high, normal, low | Yes |
| status | string: open, in_progress, waiting_customer, waiting_provider, resolved | Yes |
| assigned_operator_id | #/$defs/ID | No |
| next_action_at | #/$defs/Timestamp | No |
| outcome | string | No |

## AuditEvent

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| actor_id | #/$defs/ID | Yes |
| action | string | Yes |
| target_id | #/$defs/ID | Yes |
| reason | string | Yes |
| request_id | #/$defs/ID | Yes |
| changed_field_names | array | Yes |

## EventEnvelope

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| event_type | string | Yes |
| aggregate_id | #/$defs/ID | Yes |
| aggregate_version | integer | Yes |
| occurred_at | #/$defs/Timestamp | Yes |
| correlation_id | #/$defs/ID | Yes |
| payload_ref | #/$defs/ID | Yes |

## ProviderOperation

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| provider | string | Yes |
| operation_kind | string | Yes |
| subject_id | #/$defs/ID | Yes |
| status | string: queued, running, uncertain, succeeded, failed | Yes |
| attempt_count | integer | Yes |
| next_retry_at | #/$defs/Timestamp | No |
| provider_ref | string | No |
| idempotency_ref | #/$defs/ID | Yes |
| last_error_code | string | No |

## TeamProfile

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| resource_id | #/$defs/ID | Yes |
| membership_id | #/$defs/ID | No |
| display_name | string | Yes |
| slug | string | Yes |
| bio | string | No |
| photo_asset_id | #/$defs/ID | No |
| gallery_asset_ids | array | Yes |
| service_offer_ids | array | Yes |
| location_ids | array | Yes |
| status | string: draft, pending_review, published, hidden, archived | Yes |
| appearance_policy | string: inherit_business | Yes |
| published_version | integer | Yes |

## PermissionGrant

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| membership_id | #/$defs/ID | Yes |
| action | string | Yes |
| scope | string: own, assigned, assigned_locations, business | Yes |
| location_ids | array | Yes |
| resource_ids | array | Yes |
| field_policy | string | Yes |
| status | string: active, revoked | Yes |
| approved_by | #/$defs/ID | Yes |

## AvailabilityChange

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| membership_id | #/$defs/ID | Yes |
| resource_id | #/$defs/ID | Yes |
| kind | string: one_off, recurring, leave, busy_block | Yes |
| proposed_rule | string | Yes |
| timezone | string | Yes |
| effective_from | #/$defs/Timestamp | Yes |
| status | string: requested, approved, rejected, cancelled | Yes |
| impacted_booking_ids | array | Yes |
| decision_reason | string | No |

## CalendarConnection

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| membership_id | #/$defs/ID | Yes |
| provider | string | Yes |
| provider_account_ref | string | Yes |
| calendar_ref | string | Yes |
| mode | string: free_busy_import, one_way_export, two_way_reviewed | Yes |
| status | string: pending, active, stale, revoked, failed | Yes |
| last_success_at | #/$defs/Timestamp | No |
| cursor_ref | string | No |
| credential_secret_ref | #/$defs/ID | Yes |

## PolicyVersion

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| kind | string: saas, merchant_supply, hardware, domain, membership, privacy_notice, acceptable_use | Yes |
| responsible_entity_id | #/$defs/ID | Yes |
| jurisdiction_scope | string | Yes |
| content_ref | #/$defs/ID | Yes |
| content_hash | string | Yes |
| status | string: draft, reviewed, active, retired | Yes |
| effective_at | #/$defs/Timestamp | Yes |
| supersedes_id | #/$defs/ID | No |
| review_evidence_ref | #/$defs/ID | No |

## PolicyAcceptance

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| principal_id | #/$defs/ID | Yes |
| authority_ref | #/$defs/ID | No |
| subject_id | #/$defs/ID | Yes |
| policy_version_id | #/$defs/ID | Yes |
| content_hash | string | Yes |
| action_kind | string: contract_accept, service_start_request, digital_supply_acknowledgement, notice_record | Yes |
| copy_version | string | Yes |
| accepted_at | #/$defs/Timestamp | Yes |
| evidence_ref | #/$defs/ID | Yes |

## ConsentEvidence

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| sender_scope | string: merchant, taplo_platform | Yes |
| business_id | #/$defs/ID | No |
| recipient_ref | #/$defs/ID | Yes |
| channel | string: email, sms, push | Yes |
| purpose | string: marketing | Yes |
| basis | string: explicit_consent, reviewed_products_services_soft_opt_in | Yes |
| notice_version | string | Yes |
| notice_snapshot_ref | #/$defs/ID | Yes |
| collection_context_ref | #/$defs/ID | Yes |
| collected_at | #/$defs/Timestamp | Yes |
| status | string: active, withdrawn, superseded | Yes |
| withdrawn_at | #/$defs/Timestamp | No |
| soft_opt_in_evidence_ref | #/$defs/ID | No |

## TeamInvitation

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| contact_ref | #/$defs/ID | Yes |
| grant_plan_id | #/$defs/ID | Yes |
| token_secret_hash_ref | #/$defs/ID | Yes |
| expires_at | #/$defs/Timestamp | Yes |
| status | string: pending, accepted, expired, revoked | Yes |
| accepted_user_id | #/$defs/ID | No |
| invited_by | #/$defs/ID | Yes |

## BusinessSubscription

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| amount | #/$defs/Money | Yes |
| cadence | string: month, year | Yes |
| provider_ref | string | No |
| status | string: pending, trial, active, cancelled, past_due | Yes |
| cancel_at_period_end | boolean | Yes |
| period_end | #/$defs/Timestamp | Yes |
| entitlement_version | integer | Yes |
| billing_contact_ref | #/$defs/ID | Yes |
| plan_version_id | #/$defs/ID | Yes |

## ImportJob

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| requested_by | #/$defs/ID | Yes |
| source_type | string: merchant_website, merchant_upload, authorised_google | Yes |
| source_url | string | Yes |
| status | string: queued, fetching, review_ready, applying, applied, failed, cancelled, expired | Yes |
| source_use_status | string: unreviewed, permitted, blocked | Yes |
| source_policy_ref | #/$defs/ID | Yes |
| candidate_ids | array | Yes |
| warning_codes | array | Yes |
| expires_at | #/$defs/Timestamp | Yes |
| applied_draft_version | integer | No |

## ImportCandidate

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| job_id | #/$defs/ID | Yes |
| target_field | string: business.display_name, business.short_introduction, business.logo_asset, business.cover_asset, business.public_phone, business.public_email, business.social_links, business.website_url | Yes |
| source_reference | string | Yes |
| value_reference | #/$defs/ID | Yes |
| extraction_method | string: structured_data, visible_text, asset_candidate, merchant_entry, provider_data | Yes |
| decision | string: needs_review, selected, rejected | Yes |
| conflict | boolean | Yes |
| source_policy_ref | #/$defs/ID | Yes |
| expires_at | #/$defs/Timestamp | Yes |

## Campaign

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| sender_scope | string: merchant, taplo_platform | Yes |
| business_id | #/$defs/ID | No |
| channel | string: email, sms | Yes |
| audience_definition_ref | #/$defs/ID | Yes |
| template_ref | #/$defs/ID | Yes |
| template_version | string | Yes |
| state | string: draft, awaiting_approval, approved, scheduled, dispatching, paused, finished, cancelled | Yes |
| created_by | #/$defs/ID | Yes |
| approved_by | #/$defs/ID | No |
| approved_revision | integer | No |
| scheduled_at | #/$defs/Timestamp | No |
| timezone | string | Yes |
| budget_units | integer | Yes |
| budget_minor | integer | Yes |
| currency | conditioned = GBP | Yes |

## NotificationIntent

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| sender_scope | string: merchant, taplo_platform | Yes |
| business_id | #/$defs/ID | No |
| recipient_ref | #/$defs/ID | Yes |
| purpose | string: security, operational, marketing | Yes |
| classification_version | string | Yes |
| source_event_ref | #/$defs/ID | Yes |
| source_record_version | integer | Yes |
| template_ref | #/$defs/ID | Yes |
| template_version | string | Yes |
| idempotency_key | string | Yes |
| state | string: planned, queued, suppressed, dispatching, reconciling, provider_accepted, delivered, failed, expired, cancelled | Yes |
| due_at | #/$defs/Timestamp | Yes |
| expires_at | #/$defs/Timestamp | Yes |
| channel | string: email, sms, push, in_app | Yes |
| consent_evidence_ref | #/$defs/ID | No |
| suppression_reason | string | No |
| provider_attempt_refs | array | Yes |

## Review

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| author_ref | #/$defs/ID | Yes |
| interaction_ref | #/$defs/ID | No |
| verification | string: booked_through_taplo, ordered_through_taplo, experience_checked, not_yet_checked | Yes |
| verification_evidence_ref | #/$defs/ID | No |
| rating | integer | Yes |
| text | string | Yes |
| public_name | string | Yes |
| state | string: draft, submitted, screening, held_for_review, published, removed, withdrawn | Yes |
| policy_version | string | Yes |
| published_at | #/$defs/Timestamp | No |
| moderation_case_ref | #/$defs/ID | No |

## TrustReport

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| target_type | string: business, offer, review, reply, message, media | Yes |
| target_ref | #/$defs/ID | Yes |
| target_revision | integer | Yes |
| reason | string: scam_impersonation, unsafe_prohibited, misleading, abuse_hate_threat, child_safety, privacy, intellectual_property, review_manipulation, other | Yes |
| explanation | string | Yes |
| reporter_ref | #/$defs/ID | No |
| followup_contact_ref | #/$defs/ID | No |
| evidence_refs | array | Yes |
| state | string: received, triaged, investigating, awaiting_information, actioned, no_action, closed | Yes |
| case_ref | #/$defs/ID | Yes |
| public_receipt_ref | #/$defs/ID | No |

## ModerationDecision

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| case_ref | #/$defs/ID | Yes |
| target_ref | #/$defs/ID | Yes |
| target_revision | integer | Yes |
| policy_version | string | Yes |
| actor_ref | #/$defs/ID | Yes |
| action | string: no_action, hold_publication, remove_item, restrict_discovery, restrict_new_transactions, restrict_messages, suspend_account, restore | Yes |
| rationale | string | Yes |
| shareable_reason | string | Yes |
| restricted_evidence_refs | array | Yes |
| review_by | #/$defs/Timestamp | No |
| appeal_state | string: available, filed, reviewing, upheld, reversed, not_applicable | Yes |
| notice_refs | array | Yes |

## LegalDocument

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| document_key | string | Yes |
| audience | string: public, customer, merchant, processor_schedule, internal | Yes |
| locale | string | Yes |
| document_version | string | Yes |
| content_hash | string | Yes |
| state | string: draft, under_review, approved, published, superseded, withdrawn | Yes |
| effective_at | #/$defs/Timestamp | No |
| reviewer_ref | #/$defs/ID | No |
| review_scope_ref | #/$defs/ID | No |
| unresolved_fields | array | Yes |
| supersedes_ref | #/$defs/ID | No |

## Suppression

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| sender_scope | string: merchant, taplo_platform | Yes |
| recipient_ref | string | Yes |
| channel | string: email, sms, push | Yes |
| reason | string: withdrawn, hard_bounce, complaint, abuse, legal, manual | Yes |
| purpose_scope | string: marketing, all_provider_delivery | Yes |
| source_ref | string | Yes |
| active | boolean | Yes |

## PaymentAuthority

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| provider | conditioned = stripe | Yes |
| connected_account_ref | string | Yes |
| controller_fees | string: stripe, application | Yes |
| controller_losses | string: stripe, application | Yes |
| charges_enabled | boolean | Yes |
| payouts_enabled | boolean | Yes |
| requirements_state | string: unconnected, onboarding, verification_pending, action_required, ready, restricted, disconnected | Yes |
| configuration_version | string | Yes |
| provider_checked_at | string | Yes |
| agreement_ref | string | Yes |
| capability_evidence_ref | string | Yes |

## PaymentPolicy

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| status | string: draft, reviewed, active, retired | Yes |
| mode | string: none, full, deposit_fixed, deposit_percent | Yes |
| fixed_minor | integer | Yes |
| basis_points | integer | Yes |
| currency | conditioned = GBP | Yes |
| cancellation_policy_ref | string | Yes |
| policy_version_ref | string | Yes |
| card_on_file_enabled | conditioned = False | Yes |
| automatic_no_show_charge_enabled | conditioned = False | Yes |
| effective_at | string | Yes |

## DepositAllocation

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| payment_id | string | Yes |
| agreement_id | string | Yes |
| commitment_id | string | Yes |
| allocated_minor | integer | Yes |
| refunded_minor | integer | Yes |
| remaining_applied_minor | integer | Yes |
| currency | conditioned = GBP | Yes |
| status | string: allocated, part_refunded, refunded, reconciled | Yes |

## CancellationAssessment

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| commitment_id | string | Yes |
| agreement_id | string | Yes |
| policy_ref | string | Yes |
| initiator | string: customer, merchant, operations | Yes |
| reason_code | string | Yes |
| captured_minor | integer | Yes |
| proposed_refund_minor | integer | Yes |
| proposed_retained_minor | integer | Yes |
| currency | conditioned = GBP | Yes |
| outcome | string: refund_all, refund_partial, no_upfront_money, merchant_review, statutory_review | Yes |
| review_required | boolean | Yes |
| evidence_refs | array | Yes |
| expires_at | string | Yes |
| source_version | integer | Yes |

## GuidanceDefinition

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| key | string | Yes |
| revision | integer | Yes |
| capability | string | Yes |
| surface | string: onboarding, studio, customer, console | Yes |
| requires_all | array | Yes |
| completion_rule_key | string | Yes |
| dismissal | string: session, until_relevant_change, never_if_required | Yes |
| editor_route | string | Yes |
| quick_command | string | Yes |
| content_key | string | Yes |
| status | string: draft, active, retired | Yes |

## GuidanceProgress

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| principal_id | string | Yes |
| definition_id | string | Yes |
| definition_revision | integer | Yes |
| state | string: available, opened, dismissed, completed, invalidated | Yes |
| source_revision_hash | string | Yes |
| last_seen_at | string | Yes |
| dismiss_until | string | No |

## RewardProgramme

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| status | string: draft, active, paused, closed | Yes |
| rule_version_ref | string | Yes |
| earn_basis | string: completed_visit, eligible_spend, attended_session | Yes |
| threshold_units | integer | Yes |
| reward_kind | string: specific_offer, fixed_discount, capped_percent_discount | Yes |
| reward_offer_id | string | No |
| reward_minor | integer | No |
| reward_basis_points | integer | No |
| discount_cap_minor | integer | No |
| currency | conditioned = GBP | Yes |
| expiry_enabled | conditioned = False | Yes |
| policy_ref | string | Yes |
| programme_revision | integer | Yes |

## RewardRedemption

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| relationship_id | string | Yes |
| programme_id | string | Yes |
| rule_version_ref | string | Yes |
| reward_entry_id | string | Yes |
| source_commitment_id | string | Yes |
| holder_challenge_ref | string | No |
| units_spent | integer | Yes |
| state | string: reserved, redeemed, released, reversed | Yes |
| operation_id | string | Yes |
| expires_at | string | No |

## WalletRegistration

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| pass_id | string | Yes |
| device_ref_hash | string | Yes |
| push_token_secret_ref | string | Yes |
| registered_at | string | Yes |
| state | string: active, unregistered, invalid | Yes |

## HolderChallenge

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| relationship_id | string | Yes |
| programme_id | string | Yes |
| challenge_hash | string | Yes |
| expires_at | string | Yes |
| used_at | string | No |
| status | string: issued, used, expired, revoked | Yes |

## WidgetSnapshot

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| principal_id | string | Yes |
| audience | string: customer, studio | Yes |
| kind | string: next_up, today, reward_progress, saved_businesses | Yes |
| projection_revision | string | Yes |
| as_of | string | Yes |
| expires_at | string | Yes |
| private_details_enabled | boolean | Yes |
| state | string: current, stale, signed_out, revoked | Yes |
| public_safe_summary | string | Yes |

## CapabilityReadiness

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| capability | string | Yes |
| status | string: not_started, draft_incomplete, action_required, verification_pending, ready, temporarily_unavailable, restricted | Yes |
| blocking_codes | array | Yes |
| source_revision_hash | string | Yes |
| evaluated_at | string | Yes |

## FeePolicyVersion

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| basis_points | integer | Yes |
| effective_at | string | Yes |
| scope | string: captured_eligible_new_work | Yes |
| currency | conditioned = GBP | Yes |
| tax_treatment | string: inclusive_if_applicable, not_registered, review_required | Yes |
| refund_rule | conditioned = proportional_return | Yes |
| agreement_ref | string | Yes |
| status | string: draft, active, retired | Yes |

## LaunchEvidence

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| control_key | string | Yes |
| scope_key | string | Yes |
| state | string: specified, implemented, verified, blocked, failed, expired | Yes |
| owner_ref | string | No |
| artefact_refs | array | Yes |
| reviewed_at | string | No |
| expires_at | string | No |

## CampaignPreview

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| campaign_id | string | Yes |
| source_version | integer | Yes |
| eligible_count | integer | Yes |
| excluded_count | integer | Yes |
| estimated_segments | integer | Yes |
| reserved_units | integer | Yes |
| estimated_minor | integer | Yes |
| payload_hash | string | Yes |
| expires_at | string | Yes |

## TrustAppeal

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| decision_id | string | Yes |
| appellant_ref | string | Yes |
| reason_code | string | Yes |
| evidence_refs | array | Yes |
| state | string: submitted, reviewing, upheld, amended, reversed | Yes |

## TemplateBrand

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| template_ref | string | Yes |
| logo_asset_id | string | No |
| accent_hex | string | Yes |
| reply_contact_ref | string | Yes |

## AppearancePreference

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| principal_id | string | Yes |
| mode | string: system, light, dark | Yes |
| reduced_motion | boolean | Yes |

## PublishPreview

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | string | Yes |
| version | integer | Yes |
| created_at | string | Yes |
| updated_at | string | Yes |
| business_id | string | Yes |
| page_revision_ref | string | Yes |
| ready | boolean | Yes |
| blocking_codes | array | Yes |
| source_hash | string | Yes |
| expires_at | string | Yes |

## OnboardingDraft

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| display_name | string | Yes |
| category_query | string | Yes |
| capabilities | array | Yes |
| look_id | string | Yes |
| introduction | string | Yes |
| expires_at | #/$defs/Timestamp | Yes |

## AuthContinuation

| Field | Type/constraint | Required |
| --- | --- | --- |
| continuation_id | #/$defs/ID | Yes |
| method | string: apple, google, email_code | Yes |
| next | string: provider_redirect, email_code_sent, verification_required | Yes |
| expires_at | #/$defs/Timestamp | Yes |

## ExploreResults

| Field | Type/constraint | Required |
| --- | --- | --- |
| query_revision | string | Yes |
| result_business_ids | array | Yes |
| result_location_ids | array | Yes |
| next_cursor | string or null | Yes |
| has_more | boolean | Yes |

## PageRevision

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| look_id | string | Yes |
| accent_hex | string | Yes |
| block_ids | array | Yes |
| state | string: draft, published, superseded | Yes |
| content_hash | string | Yes |

## WorkResults

| Field | Type/constraint | Required |
| --- | --- | --- |
| booking_ids | array | Yes |
| order_ids | array | Yes |
| next_cursor | string or null | Yes |
| as_of | #/$defs/Timestamp | Yes |

## ServiceConfig

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| delivery_mode | string: premises, mobile, online_one_to_one | Yes |
| duration_minutes | integer | Yes |
| buffer_before_minutes | integer | Yes |
| buffer_after_minutes | integer | Yes |
| eligible_resource_ids | array | Yes |
| processing_overlap_enabled | conditioned = False | Yes |
| coverage_rule_ref | string or null | Yes |
| travel_buffer_minutes | integer | Yes |
| participant_required | boolean | Yes |

## FulfilmentConfig

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| modes | array | Yes |
| location_id | #/$defs/ID | Yes |
| lead_minutes | integer | Yes |
| capacity_per_window | integer | Yes |
| window_minutes | integer | Yes |
| shipping_rule_ref | string or null | Yes |
| returns_policy_ref | #/$defs/ID | Yes |

## ClassConfig

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| session_ids | array | Yes |
| purchase_mode | string: single_occurrence, whole_course | Yes |
| participant_naming | string: quantity_only, named_participants | Yes |
| waitlist_mode | string: off, fifo_whole_party_offer | Yes |
| waitlist_offer_minutes | integer | Yes |
| host_resource_ids | array | Yes |
| venue_resource_id | #/$defs/ID | Yes |

## ProjectConfig

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| milestones | array | Yes |
| licence_policy_ref | #/$defs/ID | Yes |
| revision_limit | integer | Yes |
| file_delivery_enabled | conditioned = False | Yes |
| quote_acceptance_reserves_time | conditioned = False | Yes |

## VehicleListing

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| stock_unit_ref | string | Yes |
| public_registration | boolean | Yes |
| viewing_enabled | boolean | Yes |
| vehicle_reservation_checkout_enabled | conditioned = False | Yes |
| finance_enabled | conditioned = False | Yes |
| vehicle_facts_ref | #/$defs/ID | Yes |
| listing_state | string: draft, available, reserved_elsewhere, sold, withdrawn | Yes |

## FoodPrepConfig

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| product_information_ref | #/$defs/ID | Yes |
| allergen_information_ref | #/$defs/ID | Yes |
| preparation_minutes | integer | Yes |
| capacity_per_window | integer | Yes |
| window_minutes | integer | Yes |
| cutoff_minutes | integer | Yes |
| substitution_enabled | conditioned = False | Yes |
| scope_review_evidence_ref | #/$defs/ID | Yes |

## HealthSchedulingConfig

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| practitioner_ref | #/$defs/ID | Yes |
| reviewed_scheduling_scope_ref | #/$defs/ID | Yes |
| clinical_record_storage_enabled | conditioned = False | Yes |
| emergency_service_enabled | conditioned = False | Yes |
| public_neutral_label | string | Yes |

## CreditPackageConfig

| Field | Type/constraint | Required |
| --- | --- | --- |
| id | #/$defs/ID | Yes |
| version | integer | Yes |
| created_at | #/$defs/Timestamp | Yes |
| updated_at | #/$defs/Timestamp | Yes |
| business_id | #/$defs/ID | Yes |
| offer_id | #/$defs/ID | Yes |
| credit_units | integer | Yes |
| eligible_offer_ids | array | Yes |
| validity_days | conditioned = 0 | Yes |
| recurring_charge_enabled | conditioned = False | Yes |
| terms_ref | #/$defs/ID | Yes |

## OfferConfigResult

| Field | Type/constraint | Required |
| --- | --- | --- |
| configuration_id | #/$defs/ID | Yes |
| record_kind | string: ServiceConfig, FulfilmentConfig, ClassConfig, ProjectConfig, VehicleListing, FoodPrepConfig, HealthSchedulingConfig, CreditPackageConfig | Yes |
| version | integer | Yes |
| readiness_codes | array | Yes |

## PublicShare

| Field | Type/constraint | Required |
| --- | --- | --- |
| public_url | string | Yes |
| public_title | string | Yes |
| preview_revision | string | Yes |
| qr_payload | string | Yes |

## WorkOutcome

| Field | Type/constraint | Required |
| --- | --- | --- |
| commitment_id | #/$defs/ID | Yes |
| version | integer | Yes |
| outcome | conditioned: completed, attended, no_show | Yes |
| recorded_at | #/$defs/Timestamp | Yes |

## HolderChallengeReceipt

| Field | Type/constraint | Required |
| --- | --- | --- |
| challenge_ref | #/$defs/ID | Yes |
| single_use_token | string | Yes |
| expires_at | #/$defs/Timestamp | Yes |

## PassIssueResult

| Field | Type/constraint | Required |
| --- | --- | --- |
| pass_id | #/$defs/ID | Yes |
| state | conditioned: issuing, issued, failed, update_pending | Yes |
| action_url | string or null | Yes |
| expires_at | #/$defs/Timestamp | Yes |
