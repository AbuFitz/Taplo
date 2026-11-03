-- Taplo 3.0 canonical migration specification. Not applied. Validate in isolated Postgres before use.
BEGIN;
CREATE SCHEMA IF NOT EXISTS taplo;
CREATE TABLE taplo.business (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "display_name" text NOT NULL,
  "legal_name" text,
  "handle" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('draft','active','paused','closing','closed')),
  "capabilities" jsonb NOT NULL CHECK (jsonb_typeof("capabilities") = 'array'),
  "timezone" text NOT NULL,
  "logo_asset_id" text,
  "wordmark_asset_id" text,
  "published_page_version" bigint CHECK ("published_page_version" >= 0),
  "primary_website_url" text
);
CREATE TABLE taplo.user (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "display_name" text NOT NULL,
  "verified_contact_refs" jsonb NOT NULL CHECK (jsonb_typeof("verified_contact_refs") = 'array'),
  "status" text NOT NULL CHECK ("status" IN ('active','suspended','deletion_pending','deleted'))
);
CREATE TABLE taplo.membership (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "user_id" text NOT NULL,
  "role" text NOT NULL CHECK ("role" IN ('owner','manager','scheduler','practitioner','fulfilment','finance','support')),
  "status" text NOT NULL CHECK ("status" IN ('invited','active','revoked')),
  "location_ids" jsonb NOT NULL CHECK (jsonb_typeof("location_ids") = 'array'),
  "resource_ids" jsonb NOT NULL CHECK (jsonb_typeof("resource_ids") = 'array'),
  "grant_ids" jsonb NOT NULL CHECK (jsonb_typeof("grant_ids") = 'array'),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.customer_relationship (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "user_id" text,
  "guest_contact_ref" text,
  "status" text NOT NULL CHECK ("status" IN ('active','blocked','anonymised')),
  "marketing_consent_ref" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.participant (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "display_name" text NOT NULL,
  "kind" text NOT NULL CHECK ("kind" IN ('adult','learner','attendee')),
  "guardian_relationship_id" text,
  "support_details_ref" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.location (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "label" text NOT NULL,
  "kind" text NOT NULL CHECK ("kind" IN ('public_premises','private','mobile_coverage','online','event')),
  "public_address_ref" text,
  "private_address_ref" text,
  "timezone" text NOT NULL,
  "coverage_rule_id" text,
  "visibility" text NOT NULL CHECK ("visibility" IN ('public','approximate','private')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.offer (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "kind" text NOT NULL CHECK ("kind" IN ('goods','appointment','class','quote')),
  "title" text NOT NULL,
  "description" text,
  "visibility" text NOT NULL CHECK ("visibility" IN ('draft','published','paused','archived')),
  "price_mode" text NOT NULL CHECK ("price_mode" IN ('fixed','from','quote','free')),
  "price" jsonb,
  "policy_version_id" text NOT NULL,
  "delivery_modes" jsonb NOT NULL CHECK (jsonb_typeof("delivery_modes") = 'array'),
  "configuration_ref" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.variant (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "sku" text NOT NULL,
  "option_values" jsonb NOT NULL CHECK (jsonb_typeof("option_values") = 'object'),
  "price" jsonb NOT NULL,
  "inventory_mode" text NOT NULL CHECK ("inventory_mode" IN ('tracked','made_to_order','untracked')),
  "active" boolean NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.inventory_balance (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "variant_id" text NOT NULL,
  "location_id" text NOT NULL,
  "on_hand" bigint NOT NULL CHECK ("on_hand" >= 0),
  "held" bigint NOT NULL CHECK ("held" >= 0),
  "committed" bigint NOT NULL CHECK ("committed" >= 0),
  "unavailable" bigint NOT NULL CHECK ("unavailable" >= 0),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.inventory_adjustment (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "balance_id" text NOT NULL,
  "delta_on_hand" bigint NOT NULL,
  "reason" text NOT NULL CHECK ("reason" IN ('received','count','damage','return','fulfilment','correction')),
  "origin_ref" text NOT NULL,
  "actor_id" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.resource (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "kind" text NOT NULL CHECK ("kind" IN ('staff','room','equipment','vehicle')),
  "label" text NOT NULL,
  "capacity" bigint NOT NULL CHECK ("capacity" >= 1),
  "active" boolean NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.availability_rule (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "resource_ids" jsonb NOT NULL CHECK (jsonb_typeof("resource_ids") = 'array'),
  "timezone" text NOT NULL,
  "local_rule" text NOT NULL,
  "effective_from" timestamptz NOT NULL,
  "effective_until" timestamptz,
  "exception_refs" jsonb NOT NULL CHECK (jsonb_typeof("exception_refs") = 'array'),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.session (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "starts_at" timestamptz NOT NULL,
  "ends_at" timestamptz NOT NULL,
  "timezone" text NOT NULL,
  "resource_ids" jsonb NOT NULL CHECK (jsonb_typeof("resource_ids") = 'array'),
  "capacity" bigint NOT NULL CHECK ("capacity" >= 0),
  "held_seats" bigint NOT NULL CHECK ("held_seats" >= 0),
  "committed_seats" bigint NOT NULL CHECK ("committed_seats" >= 0),
  "series_id" text,
  "occurrence_key" text,
  "status" text NOT NULL CHECK ("status" IN ('scheduled','cancelled','completed')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.cart (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('open','converted','expired')),
  "lines" jsonb NOT NULL CHECK (jsonb_typeof("lines") = 'array'),
  "expires_at" timestamptz NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.reservation (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "kind" text NOT NULL CHECK ("kind" IN ('inventory','appointment','session')),
  "target_ids" jsonb NOT NULL CHECK (jsonb_typeof("target_ids") = 'array'),
  "quantity" bigint NOT NULL CHECK ("quantity" >= 1),
  "quote_version_id" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('held','committed','released','expired')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.agreement_snapshot (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "seller_name" text NOT NULL,
  "offer_title" text NOT NULL,
  "unit_price" jsonb NOT NULL,
  "quantity" bigint NOT NULL CHECK ("quantity" >= 1),
  "discount" jsonb NOT NULL,
  "tax" jsonb NOT NULL,
  "total" jsonb NOT NULL,
  "tax_rule_version" text NOT NULL,
  "policy_version_id" text NOT NULL,
  "fulfilment_mode" text NOT NULL CHECK ("fulfilment_mode" IN ('ship','collect','onsite','mobile','online')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.booking (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "participant_ids" jsonb NOT NULL CHECK (jsonb_typeof("participant_ids") = 'array'),
  "offer_id" text NOT NULL,
  "session_id" text,
  "location_id" text NOT NULL,
  "resource_ids" jsonb NOT NULL CHECK (jsonb_typeof("resource_ids") = 'array'),
  "starts_at" timestamptz NOT NULL,
  "ends_at" timestamptz NOT NULL,
  "timezone" text NOT NULL,
  "reservation_ids" jsonb NOT NULL CHECK (jsonb_typeof("reservation_ids") = 'array'),
  "agreement_id" text NOT NULL,
  "payment_ids" jsonb NOT NULL CHECK (jsonb_typeof("payment_ids") = 'array'),
  "status" text NOT NULL CHECK ("status" IN ('requested','confirmed','declined','expired','cancelled','completed','no_show')),
  "previous_version_id" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.order (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "agreement_ids" jsonb NOT NULL CHECK (jsonb_typeof("agreement_ids") = 'array'),
  "total" jsonb NOT NULL,
  "payment_ids" jsonb NOT NULL CHECK (jsonb_typeof("payment_ids") = 'array'),
  "status" text NOT NULL CHECK ("status" IN ('pending','accepted','cancelled','closed')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.payment (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "order_id" text,
  "booking_id" text,
  "amount" jsonb NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('created','requires_action','processing','failed','cancelled','succeeded')),
  "provider" text NOT NULL,
  "provider_account_ref" text NOT NULL,
  "provider_payment_ref" text,
  "attempt_id" text NOT NULL,
  "idempotency_ref" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.refund (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "payment_id" text NOT NULL,
  "amount" jsonb NOT NULL,
  "reason" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('requested','processing','failed','succeeded')),
  "provider_ref" text,
  "requested_by" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.fulfilment (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "order_id" text NOT NULL,
  "mode" text NOT NULL CHECK ("mode" IN ('ship','collect')),
  "status" text NOT NULL CHECK ("status" IN ('unfulfilled','preparing','ready','dispatched','completed','cancelled')),
  "lines" jsonb NOT NULL CHECK (jsonb_typeof("lines") = 'array'),
  "evidence_ref" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.quote (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "scope" text NOT NULL,
  "amount" jsonb NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "policy_version_id" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('draft','sent','accepted','declined','expired','superseded')),
  "supersedes_id" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.subscription (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "purpose" text NOT NULL CHECK ("purpose" IN ('merchant_customer_membership')),
  "amount" jsonb NOT NULL,
  "cadence" text NOT NULL CHECK ("cadence" IN ('month','year')),
  "provider_ref" text,
  "status" text NOT NULL CHECK ("status" IN ('pending','trial','active','cancelled','past_due')),
  "cancel_at_period_end" boolean NOT NULL,
  "period_end" timestamptz NOT NULL,
  "entitlement_version" bigint NOT NULL CHECK ("entitlement_version" >= 0),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.waitlist_entry (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "session_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "quantity" bigint NOT NULL CHECK ("quantity" >= 1),
  "joined_at" timestamptz NOT NULL,
  "offer_expires_at" timestamptz,
  "reservation_id" text,
  "status" text NOT NULL CHECK ("status" IN ('waiting','offered','converted','expired','removed')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.conversation (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "linked_record_ids" jsonb NOT NULL CHECK (jsonb_typeof("linked_record_ids") = 'array'),
  "kind" text NOT NULL CHECK ("kind" IN ('merchant','platform_support')),
  "status" text NOT NULL CHECK ("status" IN ('open','closed','blocked')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.message (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "conversation_id" text NOT NULL,
  "sender_id" text NOT NULL,
  "sender_role" text NOT NULL CHECK ("sender_role" IN ('customer','merchant','platform_support')),
  "text" text NOT NULL,
  "attachment_refs" jsonb NOT NULL CHECK (jsonb_typeof("attachment_refs") = 'array'),
  "status" text NOT NULL CHECK ("status" IN ('accepted','delivery_pending','delivered','failed')),
  "client_message_key" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.reward_entry (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "rule_version_id" text NOT NULL,
  "origin_id" text NOT NULL,
  "units" bigint NOT NULL,
  "kind" text NOT NULL CHECK ("kind" IN ('earn','redeem','reverse','expire','adjust')),
  "reverses_id" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.wallet_pass (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "purpose" text NOT NULL CHECK ("purpose" IN ('loyalty','business_card')),
  "provider" text NOT NULL CHECK ("provider" IN ('apple','google')),
  "holder_kind" text NOT NULL CHECK ("holder_kind" IN ('relationship','team_profile','business')),
  "holder_id" text NOT NULL,
  "programme_id" text,
  "public_destination_ref" text,
  "provider_class_ref" text,
  "provider_object_ref" text,
  "apple_pass_type_ref" text,
  "serial_ref" text,
  "credential_ref" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('eligible','issuing','issued','update_pending','failed','revoked')),
  "content_revision" bigint NOT NULL CHECK ("content_revision" >= 1),
  "provider_checked_at" timestamptz,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.domain (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "hostname" text NOT NULL,
  "kind" text NOT NULL CHECK ("kind" IN ('connected','registered')),
  "provider_ref" text,
  "status" text NOT NULL CHECK ("status" IN ('pending','verifying','failed','active','expired','detached')),
  "registrant_ref" text,
  "renewal_at" timestamptz,
  "auto_renew" boolean NOT NULL,
  "is_primary" boolean NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.hardware_asset (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "serial_ref" text NOT NULL,
  "claim_proof_hash_ref" text NOT NULL,
  "redirect_id" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('unclaimed','claimed','active','lost','revoked')),
  "destination_kind" text CHECK ("destination_kind" IN ('business','offer','review','contact')),
  "destination_id" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.support_case (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text,
  "linked_record_ids" jsonb NOT NULL CHECK (jsonb_typeof("linked_record_ids") = 'array'),
  "kind" text NOT NULL CHECK ("kind" IN ('technical','merchant_service','payment','privacy','moderation','hardware','domain')),
  "priority" text NOT NULL CHECK ("priority" IN ('urgent','high','normal','low')),
  "status" text NOT NULL CHECK ("status" IN ('open','in_progress','waiting_customer','waiting_provider','resolved')),
  "assigned_operator_id" text,
  "next_action_at" timestamptz,
  "outcome" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.audit_event (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "actor_id" text NOT NULL,
  "action" text NOT NULL,
  "target_id" text NOT NULL,
  "reason" text NOT NULL,
  "request_id" text NOT NULL,
  "changed_field_names" jsonb NOT NULL CHECK (jsonb_typeof("changed_field_names") = 'array'),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.event_envelope (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "event_type" text NOT NULL,
  "aggregate_id" text NOT NULL,
  "aggregate_version" bigint NOT NULL CHECK ("aggregate_version" >= 1),
  "occurred_at" timestamptz NOT NULL,
  "correlation_id" text NOT NULL,
  "payload_ref" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.provider_operation (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "provider" text NOT NULL,
  "operation_kind" text NOT NULL,
  "subject_id" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('queued','running','uncertain','succeeded','failed')),
  "attempt_count" bigint NOT NULL CHECK ("attempt_count" >= 0),
  "next_retry_at" timestamptz,
  "provider_ref" text,
  "idempotency_ref" text NOT NULL,
  "last_error_code" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.team_profile (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "resource_id" text NOT NULL,
  "membership_id" text,
  "display_name" text NOT NULL,
  "slug" text NOT NULL,
  "bio" text,
  "photo_asset_id" text,
  "gallery_asset_ids" jsonb NOT NULL CHECK (jsonb_typeof("gallery_asset_ids") = 'array'),
  "service_offer_ids" jsonb NOT NULL CHECK (jsonb_typeof("service_offer_ids") = 'array'),
  "location_ids" jsonb NOT NULL CHECK (jsonb_typeof("location_ids") = 'array'),
  "status" text NOT NULL CHECK ("status" IN ('draft','pending_review','published','hidden','archived')),
  "appearance_policy" text NOT NULL CHECK ("appearance_policy" IN ('inherit_business')),
  "published_version" bigint NOT NULL CHECK ("published_version" >= 0),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.permission_grant (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "membership_id" text NOT NULL,
  "action" text NOT NULL,
  "scope" text NOT NULL CHECK ("scope" IN ('own','assigned','assigned_locations','business')),
  "location_ids" jsonb NOT NULL CHECK (jsonb_typeof("location_ids") = 'array'),
  "resource_ids" jsonb NOT NULL CHECK (jsonb_typeof("resource_ids") = 'array'),
  "field_policy" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('active','revoked')),
  "approved_by" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.availability_change (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "membership_id" text NOT NULL,
  "resource_id" text NOT NULL,
  "kind" text NOT NULL CHECK ("kind" IN ('one_off','recurring','leave','busy_block')),
  "proposed_rule" text NOT NULL,
  "timezone" text NOT NULL,
  "effective_from" timestamptz NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('requested','approved','rejected','cancelled')),
  "impacted_booking_ids" jsonb NOT NULL CHECK (jsonb_typeof("impacted_booking_ids") = 'array'),
  "decision_reason" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.calendar_connection (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "membership_id" text NOT NULL,
  "provider" text NOT NULL,
  "provider_account_ref" text NOT NULL,
  "calendar_ref" text NOT NULL,
  "mode" text NOT NULL CHECK ("mode" IN ('free_busy_import','one_way_export','two_way_reviewed')),
  "status" text NOT NULL CHECK ("status" IN ('pending','active','stale','revoked','failed')),
  "last_success_at" timestamptz,
  "cursor_ref" text,
  "credential_secret_ref" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.policy_version (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "kind" text NOT NULL CHECK ("kind" IN ('saas','merchant_supply','hardware','domain','membership','privacy_notice','acceptable_use')),
  "responsible_entity_id" text NOT NULL,
  "jurisdiction_scope" text NOT NULL,
  "content_ref" text NOT NULL,
  "content_hash" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('draft','reviewed','active','retired')),
  "effective_at" timestamptz NOT NULL,
  "supersedes_id" text,
  "review_evidence_ref" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.policy_acceptance (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "principal_id" text NOT NULL,
  "authority_ref" text,
  "subject_id" text NOT NULL,
  "policy_version_id" text NOT NULL,
  "content_hash" text NOT NULL,
  "action_kind" text NOT NULL CHECK ("action_kind" IN ('contract_accept','service_start_request','digital_supply_acknowledgement','notice_record')),
  "copy_version" text NOT NULL,
  "accepted_at" timestamptz NOT NULL,
  "evidence_ref" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.consent_evidence (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "sender_scope" text NOT NULL CHECK ("sender_scope" IN ('merchant','taplo_platform')),
  "business_id" text,
  "recipient_ref" text NOT NULL,
  "channel" text NOT NULL CHECK ("channel" IN ('email','sms','push')),
  "purpose" text NOT NULL CHECK ("purpose" IN ('marketing')),
  "basis" text NOT NULL CHECK ("basis" IN ('explicit_consent','reviewed_products_services_soft_opt_in')),
  "notice_version" text NOT NULL,
  "notice_snapshot_ref" text NOT NULL,
  "collection_context_ref" text NOT NULL,
  "collected_at" timestamptz NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('active','withdrawn','superseded')),
  "withdrawn_at" timestamptz,
  "soft_opt_in_evidence_ref" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.team_invitation (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "contact_ref" text NOT NULL,
  "grant_plan_id" text NOT NULL,
  "token_secret_hash_ref" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('pending','accepted','expired','revoked')),
  "accepted_user_id" text,
  "invited_by" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.business_subscription (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "amount" jsonb NOT NULL,
  "cadence" text NOT NULL CHECK ("cadence" IN ('month','year')),
  "provider_ref" text,
  "status" text NOT NULL CHECK ("status" IN ('pending','trial','active','cancelled','past_due')),
  "cancel_at_period_end" boolean NOT NULL,
  "period_end" timestamptz NOT NULL,
  "entitlement_version" bigint NOT NULL CHECK ("entitlement_version" >= 0),
  "billing_contact_ref" text NOT NULL,
  "plan_version_id" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.import_job (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "requested_by" text NOT NULL,
  "source_type" text NOT NULL CHECK ("source_type" IN ('merchant_website','merchant_upload','authorised_google')),
  "source_url" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('queued','fetching','review_ready','applying','applied','failed','cancelled','expired')),
  "source_use_status" text NOT NULL CHECK ("source_use_status" IN ('unreviewed','permitted','blocked')),
  "source_policy_ref" text NOT NULL,
  "candidate_ids" jsonb NOT NULL CHECK (jsonb_typeof("candidate_ids") = 'array'),
  "warning_codes" jsonb NOT NULL CHECK (jsonb_typeof("warning_codes") = 'array'),
  "expires_at" timestamptz NOT NULL,
  "applied_draft_version" bigint CHECK ("applied_draft_version" >= 1),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.import_candidate (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "job_id" text NOT NULL,
  "target_field" text NOT NULL CHECK ("target_field" IN ('business.display_name','business.short_introduction','business.logo_asset','business.cover_asset','business.public_phone','business.public_email','business.social_links','business.website_url')),
  "source_reference" text NOT NULL,
  "value_reference" text NOT NULL,
  "extraction_method" text NOT NULL CHECK ("extraction_method" IN ('structured_data','visible_text','asset_candidate','merchant_entry','provider_data')),
  "decision" text NOT NULL CHECK ("decision" IN ('needs_review','selected','rejected')),
  "conflict" boolean NOT NULL,
  "source_policy_ref" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.campaign (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "sender_scope" text NOT NULL CHECK ("sender_scope" IN ('merchant','taplo_platform')),
  "business_id" text,
  "channel" text NOT NULL CHECK ("channel" IN ('email','sms')),
  "audience_definition_ref" text NOT NULL,
  "template_ref" text NOT NULL,
  "template_version" text NOT NULL,
  "state" text NOT NULL CHECK ("state" IN ('draft','awaiting_approval','approved','scheduled','dispatching','paused','finished','cancelled')),
  "created_by" text NOT NULL,
  "approved_by" text,
  "approved_revision" bigint CHECK ("approved_revision" >= 1),
  "scheduled_at" timestamptz,
  "timezone" text NOT NULL,
  "budget_units" bigint NOT NULL CHECK ("budget_units" >= 0),
  "budget_minor" bigint NOT NULL CHECK ("budget_minor" >= 0),
  "currency" jsonb NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.notification_intent (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "sender_scope" text NOT NULL CHECK ("sender_scope" IN ('merchant','taplo_platform')),
  "business_id" text,
  "recipient_ref" text NOT NULL,
  "purpose" text NOT NULL CHECK ("purpose" IN ('security','operational','marketing')),
  "classification_version" text NOT NULL,
  "source_event_ref" text NOT NULL,
  "source_record_version" bigint NOT NULL CHECK ("source_record_version" >= 1),
  "template_ref" text NOT NULL,
  "template_version" text NOT NULL,
  "idempotency_key" text NOT NULL,
  "state" text NOT NULL CHECK ("state" IN ('planned','queued','suppressed','dispatching','reconciling','provider_accepted','delivered','failed','expired','cancelled')),
  "due_at" timestamptz NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "channel" text NOT NULL CHECK ("channel" IN ('email','sms','push','in_app')),
  "consent_evidence_ref" text,
  "suppression_reason" text,
  "provider_attempt_refs" jsonb NOT NULL CHECK (jsonb_typeof("provider_attempt_refs") = 'array'),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.review (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "author_ref" text NOT NULL,
  "interaction_ref" text,
  "verification" text NOT NULL CHECK ("verification" IN ('booked_through_taplo','ordered_through_taplo','experience_checked','not_yet_checked')),
  "verification_evidence_ref" text,
  "rating" bigint NOT NULL CHECK ("rating" >= 1),
  "text" text NOT NULL,
  "public_name" text NOT NULL,
  "state" text NOT NULL CHECK ("state" IN ('draft','submitted','screening','held_for_review','published','removed','withdrawn')),
  "policy_version" text NOT NULL,
  "published_at" timestamptz,
  "moderation_case_ref" text,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.trust_report (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "target_type" text NOT NULL CHECK ("target_type" IN ('business','offer','review','reply','message','media')),
  "target_ref" text NOT NULL,
  "target_revision" bigint NOT NULL CHECK ("target_revision" >= 1),
  "reason" text NOT NULL CHECK ("reason" IN ('scam_impersonation','unsafe_prohibited','misleading','abuse_hate_threat','child_safety','privacy','intellectual_property','review_manipulation','other')),
  "explanation" text NOT NULL,
  "reporter_ref" text,
  "followup_contact_ref" text,
  "evidence_refs" jsonb NOT NULL CHECK (jsonb_typeof("evidence_refs") = 'array'),
  "state" text NOT NULL CHECK ("state" IN ('received','triaged','investigating','awaiting_information','actioned','no_action','closed')),
  "case_ref" text NOT NULL,
  "public_receipt_ref" text
);
CREATE TABLE taplo.moderation_decision (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "case_ref" text NOT NULL,
  "target_ref" text NOT NULL,
  "target_revision" bigint NOT NULL CHECK ("target_revision" >= 1),
  "policy_version" text NOT NULL,
  "actor_ref" text NOT NULL,
  "action" text NOT NULL CHECK ("action" IN ('no_action','hold_publication','remove_item','restrict_discovery','restrict_new_transactions','restrict_messages','suspend_account','restore')),
  "rationale" text NOT NULL,
  "shareable_reason" text NOT NULL,
  "restricted_evidence_refs" jsonb NOT NULL CHECK (jsonb_typeof("restricted_evidence_refs") = 'array'),
  "review_by" timestamptz,
  "appeal_state" text NOT NULL CHECK ("appeal_state" IN ('available','filed','reviewing','upheld','reversed','not_applicable')),
  "notice_refs" jsonb NOT NULL CHECK (jsonb_typeof("notice_refs") = 'array')
);
CREATE TABLE taplo.legal_document (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "document_key" text NOT NULL,
  "audience" text NOT NULL CHECK ("audience" IN ('public','customer','merchant','processor_schedule','internal')),
  "locale" text NOT NULL,
  "document_version" text NOT NULL,
  "content_hash" text NOT NULL,
  "state" text NOT NULL CHECK ("state" IN ('draft','under_review','approved','published','superseded','withdrawn')),
  "effective_at" timestamptz,
  "reviewer_ref" text,
  "review_scope_ref" text,
  "unresolved_fields" jsonb NOT NULL CHECK (jsonb_typeof("unresolved_fields") = 'array'),
  "supersedes_ref" text
);
CREATE TABLE taplo.suppression (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "sender_scope" text NOT NULL CHECK ("sender_scope" IN ('merchant','taplo_platform')),
  "recipient_ref" text NOT NULL,
  "channel" text NOT NULL CHECK ("channel" IN ('email','sms','push')),
  "reason" text NOT NULL CHECK ("reason" IN ('withdrawn','hard_bounce','complaint','abuse','legal','manual')),
  "purpose_scope" text NOT NULL CHECK ("purpose_scope" IN ('marketing','all_provider_delivery')),
  "source_ref" text NOT NULL,
  "active" boolean NOT NULL
);
CREATE TABLE taplo.payment_authority (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "provider" jsonb NOT NULL,
  "connected_account_ref" text NOT NULL,
  "controller_fees" text NOT NULL CHECK ("controller_fees" IN ('stripe','application')),
  "controller_losses" text NOT NULL CHECK ("controller_losses" IN ('stripe','application')),
  "charges_enabled" boolean NOT NULL,
  "payouts_enabled" boolean NOT NULL,
  "requirements_state" text NOT NULL CHECK ("requirements_state" IN ('unconnected','onboarding','verification_pending','action_required','ready','restricted','disconnected')),
  "configuration_version" text NOT NULL,
  "provider_checked_at" timestamptz NOT NULL,
  "agreement_ref" text NOT NULL,
  "capability_evidence_ref" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.payment_policy (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('draft','reviewed','active','retired')),
  "mode" text NOT NULL CHECK ("mode" IN ('none','full','deposit_fixed','deposit_percent')),
  "fixed_minor" bigint NOT NULL CHECK ("fixed_minor" >= 0),
  "basis_points" bigint NOT NULL CHECK ("basis_points" >= 0),
  "currency" jsonb NOT NULL,
  "cancellation_policy_ref" text NOT NULL,
  "policy_version_ref" text NOT NULL,
  "card_on_file_enabled" jsonb NOT NULL,
  "automatic_no_show_charge_enabled" jsonb NOT NULL,
  "effective_at" timestamptz NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.deposit_allocation (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "payment_id" text NOT NULL,
  "agreement_id" text NOT NULL,
  "commitment_id" text NOT NULL,
  "allocated_minor" bigint NOT NULL CHECK ("allocated_minor" >= 0),
  "refunded_minor" bigint NOT NULL CHECK ("refunded_minor" >= 0),
  "remaining_applied_minor" bigint NOT NULL CHECK ("remaining_applied_minor" >= 0),
  "currency" jsonb NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('allocated','part_refunded','refunded','reconciled')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.cancellation_assessment (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "commitment_id" text NOT NULL,
  "agreement_id" text NOT NULL,
  "policy_ref" text NOT NULL,
  "initiator" text NOT NULL CHECK ("initiator" IN ('customer','merchant','operations')),
  "reason_code" text NOT NULL,
  "captured_minor" bigint NOT NULL CHECK ("captured_minor" >= 0),
  "proposed_refund_minor" bigint NOT NULL CHECK ("proposed_refund_minor" >= 0),
  "proposed_retained_minor" bigint NOT NULL CHECK ("proposed_retained_minor" >= 0),
  "currency" jsonb NOT NULL,
  "outcome" text NOT NULL CHECK ("outcome" IN ('refund_all','refund_partial','no_upfront_money','merchant_review','statutory_review')),
  "review_required" boolean NOT NULL,
  "evidence_refs" jsonb NOT NULL CHECK (jsonb_typeof("evidence_refs") = 'array'),
  "expires_at" timestamptz NOT NULL,
  "source_version" bigint NOT NULL CHECK ("source_version" >= 1),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.guidance_definition (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "key" text NOT NULL,
  "revision" bigint NOT NULL CHECK ("revision" >= 1),
  "capability" text NOT NULL,
  "surface" text NOT NULL CHECK ("surface" IN ('onboarding','studio','customer','console')),
  "requires_all" jsonb NOT NULL CHECK (jsonb_typeof("requires_all") = 'array'),
  "completion_rule_key" text NOT NULL,
  "dismissal" text NOT NULL CHECK ("dismissal" IN ('session','until_relevant_change','never_if_required')),
  "editor_route" text NOT NULL,
  "quick_command" text NOT NULL,
  "content_key" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('draft','active','retired')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.guidance_progress (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "principal_id" text NOT NULL,
  "definition_id" text NOT NULL,
  "definition_revision" bigint NOT NULL CHECK ("definition_revision" >= 1),
  "state" text NOT NULL CHECK ("state" IN ('available','opened','dismissed','completed','invalidated')),
  "source_revision_hash" text NOT NULL,
  "last_seen_at" timestamptz NOT NULL,
  "dismiss_until" timestamptz,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.reward_programme (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('draft','active','paused','closed')),
  "rule_version_ref" text NOT NULL,
  "earn_basis" text NOT NULL CHECK ("earn_basis" IN ('completed_visit','eligible_spend','attended_session')),
  "threshold_units" bigint NOT NULL CHECK ("threshold_units" >= 1),
  "reward_kind" text NOT NULL CHECK ("reward_kind" IN ('specific_offer','fixed_discount','capped_percent_discount')),
  "reward_offer_id" text,
  "reward_minor" bigint CHECK ("reward_minor" >= 0),
  "reward_basis_points" bigint CHECK ("reward_basis_points" >= 0),
  "discount_cap_minor" bigint CHECK ("discount_cap_minor" >= 0),
  "currency" jsonb NOT NULL,
  "expiry_enabled" jsonb NOT NULL,
  "policy_ref" text NOT NULL,
  "programme_revision" bigint NOT NULL CHECK ("programme_revision" >= 1),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.reward_redemption (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "programme_id" text NOT NULL,
  "rule_version_ref" text NOT NULL,
  "reward_entry_id" text NOT NULL,
  "source_commitment_id" text NOT NULL,
  "holder_challenge_ref" text,
  "units_spent" bigint NOT NULL CHECK ("units_spent" >= 1),
  "state" text NOT NULL CHECK ("state" IN ('reserved','redeemed','released','reversed')),
  "operation_id" text NOT NULL,
  "expires_at" timestamptz,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.wallet_registration (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "pass_id" text NOT NULL,
  "device_ref_hash" text NOT NULL,
  "push_token_secret_ref" text NOT NULL,
  "registered_at" timestamptz NOT NULL,
  "state" text NOT NULL CHECK ("state" IN ('active','unregistered','invalid')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.holder_challenge (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "relationship_id" text NOT NULL,
  "programme_id" text NOT NULL,
  "challenge_hash" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "used_at" timestamptz,
  "status" text NOT NULL CHECK ("status" IN ('issued','used','expired','revoked')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.widget_snapshot (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "principal_id" text NOT NULL,
  "audience" text NOT NULL CHECK ("audience" IN ('customer','studio')),
  "kind" text NOT NULL CHECK ("kind" IN ('next_up','today','reward_progress','saved_businesses')),
  "projection_revision" text NOT NULL,
  "as_of" timestamptz NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "private_details_enabled" boolean NOT NULL,
  "state" text NOT NULL CHECK ("state" IN ('current','stale','signed_out','revoked')),
  "public_safe_summary" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.capability_readiness (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "capability" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('not_started','draft_incomplete','action_required','verification_pending','ready','temporarily_unavailable','restricted')),
  "blocking_codes" jsonb NOT NULL CHECK (jsonb_typeof("blocking_codes") = 'array'),
  "source_revision_hash" text NOT NULL,
  "evaluated_at" timestamptz NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.fee_policy_version (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "basis_points" bigint NOT NULL CHECK ("basis_points" >= 0),
  "effective_at" timestamptz NOT NULL,
  "scope" text NOT NULL CHECK ("scope" IN ('captured_eligible_new_work')),
  "currency" jsonb NOT NULL,
  "tax_treatment" text NOT NULL CHECK ("tax_treatment" IN ('inclusive_if_applicable','not_registered','review_required')),
  "refund_rule" jsonb NOT NULL,
  "agreement_ref" text NOT NULL,
  "status" text NOT NULL CHECK ("status" IN ('draft','active','retired')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.launch_evidence (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "control_key" text NOT NULL,
  "scope_key" text NOT NULL,
  "state" text NOT NULL CHECK ("state" IN ('specified','implemented','verified','blocked','failed','expired')),
  "owner_ref" text,
  "artefact_refs" jsonb NOT NULL CHECK (jsonb_typeof("artefact_refs") = 'array'),
  "reviewed_at" timestamptz,
  "expires_at" timestamptz,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.campaign_preview (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "campaign_id" text NOT NULL,
  "source_version" bigint NOT NULL CHECK ("source_version" >= 0),
  "eligible_count" bigint NOT NULL CHECK ("eligible_count" >= 0),
  "excluded_count" bigint NOT NULL CHECK ("excluded_count" >= 0),
  "estimated_segments" bigint NOT NULL CHECK ("estimated_segments" >= 0),
  "reserved_units" bigint NOT NULL CHECK ("reserved_units" >= 0),
  "estimated_minor" bigint NOT NULL CHECK ("estimated_minor" >= 0),
  "payload_hash" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.trust_appeal (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "decision_id" text NOT NULL,
  "appellant_ref" text NOT NULL,
  "reason_code" text NOT NULL,
  "evidence_refs" jsonb NOT NULL CHECK (jsonb_typeof("evidence_refs") = 'array'),
  "state" text NOT NULL CHECK ("state" IN ('submitted','reviewing','upheld','amended','reversed')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.template_brand (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "template_ref" text NOT NULL,
  "logo_asset_id" text,
  "accent_hex" text NOT NULL,
  "reply_contact_ref" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.appearance_preference (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "principal_id" text NOT NULL,
  "mode" text NOT NULL CHECK ("mode" IN ('system','light','dark')),
  "reduced_motion" boolean NOT NULL
);
CREATE TABLE taplo.publish_preview (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "page_revision_ref" text NOT NULL,
  "ready" boolean NOT NULL,
  "blocking_codes" jsonb NOT NULL CHECK (jsonb_typeof("blocking_codes") = 'array'),
  "source_hash" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.onboarding_draft (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 0),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "display_name" text NOT NULL,
  "category_query" text NOT NULL,
  "capabilities" jsonb NOT NULL CHECK (jsonb_typeof("capabilities") = 'array'),
  "look_id" text NOT NULL,
  "introduction" text NOT NULL,
  "expires_at" timestamptz NOT NULL
);
CREATE TABLE taplo.page_revision (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 0),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "look_id" text NOT NULL,
  "accent_hex" text NOT NULL,
  "block_ids" jsonb NOT NULL CHECK (jsonb_typeof("block_ids") = 'array'),
  "state" text NOT NULL CHECK ("state" IN ('draft','published','superseded')),
  "content_hash" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.service_config (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "delivery_mode" text NOT NULL CHECK ("delivery_mode" IN ('premises','mobile','online_one_to_one')),
  "duration_minutes" bigint NOT NULL CHECK ("duration_minutes" >= 1),
  "buffer_before_minutes" bigint NOT NULL CHECK ("buffer_before_minutes" >= 0),
  "buffer_after_minutes" bigint NOT NULL CHECK ("buffer_after_minutes" >= 0),
  "eligible_resource_ids" jsonb NOT NULL CHECK (jsonb_typeof("eligible_resource_ids") = 'array'),
  "processing_overlap_enabled" jsonb NOT NULL,
  "coverage_rule_ref" text,
  "travel_buffer_minutes" bigint NOT NULL CHECK ("travel_buffer_minutes" >= 0),
  "participant_required" boolean NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.fulfilment_config (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "modes" jsonb NOT NULL CHECK (jsonb_typeof("modes") = 'array'),
  "location_id" text NOT NULL,
  "lead_minutes" bigint NOT NULL CHECK ("lead_minutes" >= 0),
  "capacity_per_window" bigint NOT NULL CHECK ("capacity_per_window" >= 1),
  "window_minutes" bigint NOT NULL CHECK ("window_minutes" >= 1),
  "shipping_rule_ref" text,
  "returns_policy_ref" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.class_config (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "session_ids" jsonb NOT NULL CHECK (jsonb_typeof("session_ids") = 'array'),
  "purchase_mode" text NOT NULL CHECK ("purchase_mode" IN ('single_occurrence','whole_course')),
  "participant_naming" text NOT NULL CHECK ("participant_naming" IN ('quantity_only','named_participants')),
  "waitlist_mode" text NOT NULL CHECK ("waitlist_mode" IN ('off','fifo_whole_party_offer')),
  "waitlist_offer_minutes" bigint NOT NULL CHECK ("waitlist_offer_minutes" >= 1),
  "host_resource_ids" jsonb NOT NULL CHECK (jsonb_typeof("host_resource_ids") = 'array'),
  "venue_resource_id" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.project_config (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "milestones" jsonb NOT NULL CHECK (jsonb_typeof("milestones") = 'array'),
  "licence_policy_ref" text NOT NULL,
  "revision_limit" bigint NOT NULL CHECK ("revision_limit" >= 0),
  "file_delivery_enabled" jsonb NOT NULL,
  "quote_acceptance_reserves_time" jsonb NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.vehicle_listing (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "stock_unit_ref" text NOT NULL,
  "public_registration" boolean NOT NULL,
  "viewing_enabled" boolean NOT NULL,
  "vehicle_reservation_checkout_enabled" jsonb NOT NULL,
  "finance_enabled" jsonb NOT NULL,
  "vehicle_facts_ref" text NOT NULL,
  "listing_state" text NOT NULL CHECK ("listing_state" IN ('draft','available','reserved_elsewhere','sold','withdrawn')),
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.food_prep_config (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "product_information_ref" text NOT NULL,
  "allergen_information_ref" text NOT NULL,
  "preparation_minutes" bigint NOT NULL CHECK ("preparation_minutes" >= 0),
  "capacity_per_window" bigint NOT NULL CHECK ("capacity_per_window" >= 1),
  "window_minutes" bigint NOT NULL CHECK ("window_minutes" >= 1),
  "cutoff_minutes" bigint NOT NULL CHECK ("cutoff_minutes" >= 0),
  "substitution_enabled" jsonb NOT NULL,
  "scope_review_evidence_ref" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.health_scheduling_config (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "practitioner_ref" text NOT NULL,
  "reviewed_scheduling_scope_ref" text NOT NULL,
  "clinical_record_storage_enabled" jsonb NOT NULL,
  "emergency_service_enabled" jsonb NOT NULL,
  "public_neutral_label" text NOT NULL,
  UNIQUE (business_id, id)
);
CREATE TABLE taplo.credit_package_config (
  "id" text PRIMARY KEY,
  "version" bigint NOT NULL CHECK ("version" >= 1),
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  "business_id" text NOT NULL,
  "offer_id" text NOT NULL,
  "credit_units" bigint NOT NULL CHECK ("credit_units" >= 1),
  "eligible_offer_ids" jsonb NOT NULL CHECK (jsonb_typeof("eligible_offer_ids") = 'array'),
  "validity_days" jsonb NOT NULL,
  "recurring_charge_enabled" jsonb NOT NULL,
  "terms_ref" text NOT NULL,
  UNIQUE (business_id, id)
);
ALTER TABLE taplo.membership ADD FOREIGN KEY (business_id) REFERENCES taplo.business (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.customer_relationship ADD FOREIGN KEY (business_id) REFERENCES taplo.business (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.location ADD FOREIGN KEY (business_id) REFERENCES taplo.business (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.offer ADD FOREIGN KEY (business_id) REFERENCES taplo.business (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.variant ADD FOREIGN KEY (business_id, offer_id) REFERENCES taplo.offer (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.inventory_balance ADD FOREIGN KEY (business_id, variant_id) REFERENCES taplo.variant (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.inventory_balance ADD FOREIGN KEY (business_id, location_id) REFERENCES taplo.location (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.booking ADD FOREIGN KEY (business_id, relationship_id) REFERENCES taplo.customer_relationship (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.booking ADD FOREIGN KEY (business_id, offer_id) REFERENCES taplo.offer (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.order ADD FOREIGN KEY (business_id, relationship_id) REFERENCES taplo.customer_relationship (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.deposit_allocation ADD FOREIGN KEY (business_id, payment_id) REFERENCES taplo.payment (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.deposit_allocation ADD FOREIGN KEY (business_id, agreement_id) REFERENCES taplo.agreement_snapshot (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.cancellation_assessment ADD FOREIGN KEY (business_id, agreement_id) REFERENCES taplo.agreement_snapshot (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.reward_entry ADD FOREIGN KEY (business_id, relationship_id) REFERENCES taplo.customer_relationship (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.reward_redemption ADD FOREIGN KEY (business_id, relationship_id) REFERENCES taplo.customer_relationship (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.reward_redemption ADD FOREIGN KEY (business_id, programme_id) REFERENCES taplo.reward_programme (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.reward_redemption ADD FOREIGN KEY (business_id, reward_entry_id) REFERENCES taplo.reward_entry (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.holder_challenge ADD FOREIGN KEY (business_id, relationship_id) REFERENCES taplo.customer_relationship (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.holder_challenge ADD FOREIGN KEY (business_id, programme_id) REFERENCES taplo.reward_programme (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.wallet_registration ADD FOREIGN KEY (business_id, pass_id) REFERENCES taplo.wallet_pass (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.guidance_progress ADD FOREIGN KEY (business_id, definition_id) REFERENCES taplo.guidance_definition (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.campaign_preview ADD FOREIGN KEY (business_id, campaign_id) REFERENCES taplo.campaign (business_id, id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.trust_appeal ADD FOREIGN KEY (decision_id) REFERENCES taplo.moderation_decision (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.team_profile ADD FOREIGN KEY (business_id) REFERENCES taplo.business (id) DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE taplo.team_invitation ADD FOREIGN KEY (business_id) REFERENCES taplo.business (id) DEFERRABLE INITIALLY IMMEDIATE;
CREATE TABLE taplo.command_receipt (id text PRIMARY KEY, business_id text NOT NULL REFERENCES taplo.business(id), principal_id text NOT NULL, command text NOT NULL, idempotency_key text NOT NULL, payload_sha256 text NOT NULL, status text NOT NULL CHECK(status IN ('accepted','running','uncertain','succeeded','failed')), response_ref text, created_at timestamptz NOT NULL, UNIQUE(business_id,principal_id,command,idempotency_key));
CREATE TABLE taplo.outbox (id text PRIMARY KEY, business_id text NOT NULL REFERENCES taplo.business(id), aggregate_id text NOT NULL, aggregate_version bigint NOT NULL CHECK(aggregate_version>0), event_type text NOT NULL, payload jsonb NOT NULL, occurred_at timestamptz NOT NULL, dispatched_at timestamptz, attempts integer NOT NULL DEFAULT 0);
CREATE TABLE taplo.inbox (provider text NOT NULL, account_scope text NOT NULL, event_id text NOT NULL, received_at timestamptz NOT NULL, processed_at timestamptz, PRIMARY KEY(provider,account_scope,event_id));
CREATE TABLE taplo.resource_allocation (id text PRIMARY KEY, business_id text NOT NULL REFERENCES taplo.business(id), resource_id text NOT NULL, commitment_id text NOT NULL, start_at timestamptz NOT NULL, end_at timestamptz NOT NULL, quantity bigint NOT NULL CHECK(quantity>0), state text NOT NULL CHECK(state IN ('held','committed','released','expired')), expires_at timestamptz, CHECK(end_at>start_at), FOREIGN KEY(business_id,resource_id) REFERENCES taplo.resource(business_id,id));
CREATE INDEX resource_allocation_active ON taplo.resource_allocation(business_id,resource_id,start_at,end_at) WHERE state IN ('held','committed');
ALTER TABLE taplo.reward_entry ADD COLUMN programme_id text NOT NULL;
ALTER TABLE taplo.reward_entry ADD FOREIGN KEY (business_id,programme_id) REFERENCES taplo.reward_programme(business_id,id);
CREATE UNIQUE INDEX reward_earn_source_once ON taplo.reward_entry(business_id,programme_id,relationship_id,origin_id) WHERE kind='earn';
CREATE UNIQUE INDEX reward_reverse_once ON taplo.reward_entry(business_id,reverses_id,origin_id) WHERE kind='reverse';
CREATE INDEX outbox_pending ON taplo.outbox(occurred_at) WHERE dispatched_at IS NULL;
ALTER TABLE taplo.membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.membership FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.membership USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.customer_relationship ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.customer_relationship FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.customer_relationship USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.participant ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.participant FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.participant USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.location ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.location FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.location USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.offer ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.offer FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.offer USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.variant ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.variant FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.variant USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.inventory_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.inventory_balance FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.inventory_balance USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.inventory_adjustment ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.inventory_adjustment FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.inventory_adjustment USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.resource ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.resource FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.resource USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.availability_rule ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.availability_rule FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.availability_rule USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.session ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.session FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.session USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.cart FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.cart USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.reservation ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.reservation FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.reservation USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.agreement_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.agreement_snapshot FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.agreement_snapshot USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.booking FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.booking USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.order ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.order FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.order USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.payment FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.payment USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.refund ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.refund FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.refund USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.fulfilment ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.fulfilment FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.fulfilment USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.quote ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.quote FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.quote USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.subscription FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.subscription USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.waitlist_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.waitlist_entry FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.waitlist_entry USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.conversation ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.conversation FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.conversation USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.message ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.message FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.message USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.reward_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.reward_entry FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.reward_entry USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.wallet_pass ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.wallet_pass FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.wallet_pass USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.domain ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.domain FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.domain USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.hardware_asset ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.hardware_asset FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.hardware_asset USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.support_case ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.support_case FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.support_case USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.audit_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.audit_event FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.audit_event USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.event_envelope ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.event_envelope FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.event_envelope USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.provider_operation ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.provider_operation FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.provider_operation USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.team_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.team_profile FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.team_profile USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.permission_grant ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.permission_grant FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.permission_grant USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.availability_change ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.availability_change FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.availability_change USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.calendar_connection ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.calendar_connection FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.calendar_connection USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.policy_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.policy_version FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.policy_version USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.policy_acceptance ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.policy_acceptance FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.policy_acceptance USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.consent_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.consent_evidence FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.consent_evidence USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.team_invitation ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.team_invitation FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.team_invitation USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.business_subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.business_subscription FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.business_subscription USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.import_job ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.import_job FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.import_job USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.import_candidate ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.import_candidate FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.import_candidate USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.campaign ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.campaign FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.campaign USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.notification_intent ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.notification_intent FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.notification_intent USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.review ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.review FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.review USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.payment_authority ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.payment_authority FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.payment_authority USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.payment_policy ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.payment_policy FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.payment_policy USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.deposit_allocation ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.deposit_allocation FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.deposit_allocation USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.cancellation_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.cancellation_assessment FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.cancellation_assessment USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.guidance_definition ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.guidance_definition FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.guidance_definition USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.guidance_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.guidance_progress FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.guidance_progress USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.reward_programme ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.reward_programme FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.reward_programme USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.reward_redemption ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.reward_redemption FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.reward_redemption USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.wallet_registration ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.wallet_registration FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.wallet_registration USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.holder_challenge ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.holder_challenge FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.holder_challenge USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.widget_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.widget_snapshot FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.widget_snapshot USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.capability_readiness ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.capability_readiness FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.capability_readiness USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.fee_policy_version ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.fee_policy_version FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.fee_policy_version USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.launch_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.launch_evidence FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.launch_evidence USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.campaign_preview ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.campaign_preview FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.campaign_preview USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.trust_appeal ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.trust_appeal FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.trust_appeal USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.template_brand ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.template_brand FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.template_brand USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.publish_preview ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.publish_preview FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.publish_preview USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.page_revision ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.page_revision FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.page_revision USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.service_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.service_config FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.service_config USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.fulfilment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.fulfilment_config FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.fulfilment_config USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.class_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.class_config FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.class_config USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.project_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.project_config FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.project_config USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.vehicle_listing ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.vehicle_listing FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.vehicle_listing USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.food_prep_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.food_prep_config FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.food_prep_config USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.health_scheduling_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.health_scheduling_config FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.health_scheduling_config USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.credit_package_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.credit_package_config FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.credit_package_config USING (business_id = nullif(current_setting('app.business_id', true),'')) WITH CHECK (business_id = nullif(current_setting('app.business_id', true),''));
ALTER TABLE taplo.offer ADD CHECK ("price" IS NULL OR (jsonb_typeof("price")='object' AND ("price"->>'minor') ~ '^[0-9]+$' AND ("price"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.variant ADD CHECK ("price" IS NULL OR (jsonb_typeof("price")='object' AND ("price"->>'minor') ~ '^[0-9]+$' AND ("price"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.agreement_snapshot ADD CHECK ("unit_price" IS NULL OR (jsonb_typeof("unit_price")='object' AND ("unit_price"->>'minor') ~ '^[0-9]+$' AND ("unit_price"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.agreement_snapshot ADD CHECK ("discount" IS NULL OR (jsonb_typeof("discount")='object' AND ("discount"->>'minor') ~ '^[0-9]+$' AND ("discount"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.agreement_snapshot ADD CHECK ("tax" IS NULL OR (jsonb_typeof("tax")='object' AND ("tax"->>'minor') ~ '^[0-9]+$' AND ("tax"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.agreement_snapshot ADD CHECK ("total" IS NULL OR (jsonb_typeof("total")='object' AND ("total"->>'minor') ~ '^[0-9]+$' AND ("total"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.order ADD CHECK ("total" IS NULL OR (jsonb_typeof("total")='object' AND ("total"->>'minor') ~ '^[0-9]+$' AND ("total"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.payment ADD CHECK ("amount" IS NULL OR (jsonb_typeof("amount")='object' AND ("amount"->>'minor') ~ '^[0-9]+$' AND ("amount"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.refund ADD CHECK ("amount" IS NULL OR (jsonb_typeof("amount")='object' AND ("amount"->>'minor') ~ '^[0-9]+$' AND ("amount"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.quote ADD CHECK ("amount" IS NULL OR (jsonb_typeof("amount")='object' AND ("amount"->>'minor') ~ '^[0-9]+$' AND ("amount"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.subscription ADD CHECK ("amount" IS NULL OR (jsonb_typeof("amount")='object' AND ("amount"->>'minor') ~ '^[0-9]+$' AND ("amount"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.business_subscription ADD CHECK ("amount" IS NULL OR (jsonb_typeof("amount")='object' AND ("amount"->>'minor') ~ '^[0-9]+$' AND ("amount"->>'currency') ~ '^[A-Z]{3}$'));
ALTER TABLE taplo.membership DROP COLUMN "resource_ids";
CREATE TABLE taplo.membership__resource_ids (business_id text NOT NULL, owner_id text NOT NULL, target_id text NOT NULL, position integer NOT NULL CHECK(position>=0), PRIMARY KEY(business_id,owner_id,target_id), UNIQUE(business_id,owner_id,position), FOREIGN KEY(business_id,owner_id) REFERENCES taplo.membership(business_id,id), FOREIGN KEY(business_id,target_id) REFERENCES taplo.resource(business_id,id));
ALTER TABLE taplo.membership__resource_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.membership__resource_ids FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.membership__resource_ids USING (business_id=nullif(current_setting('app.business_id',true),'')) WITH CHECK (business_id=nullif(current_setting('app.business_id',true),''));
ALTER TABLE taplo.availability_rule DROP COLUMN "resource_ids";
CREATE TABLE taplo.availability_rule__resource_ids (business_id text NOT NULL, owner_id text NOT NULL, target_id text NOT NULL, position integer NOT NULL CHECK(position>=0), PRIMARY KEY(business_id,owner_id,target_id), UNIQUE(business_id,owner_id,position), FOREIGN KEY(business_id,owner_id) REFERENCES taplo.availability_rule(business_id,id), FOREIGN KEY(business_id,target_id) REFERENCES taplo.resource(business_id,id));
ALTER TABLE taplo.availability_rule__resource_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.availability_rule__resource_ids FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.availability_rule__resource_ids USING (business_id=nullif(current_setting('app.business_id',true),'')) WITH CHECK (business_id=nullif(current_setting('app.business_id',true),''));
ALTER TABLE taplo.session DROP COLUMN "resource_ids";
CREATE TABLE taplo.session__resource_ids (business_id text NOT NULL, owner_id text NOT NULL, target_id text NOT NULL, position integer NOT NULL CHECK(position>=0), PRIMARY KEY(business_id,owner_id,target_id), UNIQUE(business_id,owner_id,position), FOREIGN KEY(business_id,owner_id) REFERENCES taplo.session(business_id,id), FOREIGN KEY(business_id,target_id) REFERENCES taplo.resource(business_id,id));
ALTER TABLE taplo.session__resource_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.session__resource_ids FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.session__resource_ids USING (business_id=nullif(current_setting('app.business_id',true),'')) WITH CHECK (business_id=nullif(current_setting('app.business_id',true),''));
ALTER TABLE taplo.booking DROP COLUMN "resource_ids";
CREATE TABLE taplo.booking__resource_ids (business_id text NOT NULL, owner_id text NOT NULL, target_id text NOT NULL, position integer NOT NULL CHECK(position>=0), PRIMARY KEY(business_id,owner_id,target_id), UNIQUE(business_id,owner_id,position), FOREIGN KEY(business_id,owner_id) REFERENCES taplo.booking(business_id,id), FOREIGN KEY(business_id,target_id) REFERENCES taplo.resource(business_id,id));
ALTER TABLE taplo.booking__resource_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.booking__resource_ids FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.booking__resource_ids USING (business_id=nullif(current_setting('app.business_id',true),'')) WITH CHECK (business_id=nullif(current_setting('app.business_id',true),''));
ALTER TABLE taplo.permission_grant DROP COLUMN "resource_ids";
CREATE TABLE taplo.permission_grant__resource_ids (business_id text NOT NULL, owner_id text NOT NULL, target_id text NOT NULL, position integer NOT NULL CHECK(position>=0), PRIMARY KEY(business_id,owner_id,target_id), UNIQUE(business_id,owner_id,position), FOREIGN KEY(business_id,owner_id) REFERENCES taplo.permission_grant(business_id,id), FOREIGN KEY(business_id,target_id) REFERENCES taplo.resource(business_id,id));
ALTER TABLE taplo.permission_grant__resource_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.permission_grant__resource_ids FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.permission_grant__resource_ids USING (business_id=nullif(current_setting('app.business_id',true),'')) WITH CHECK (business_id=nullif(current_setting('app.business_id',true),''));
ALTER TABLE taplo.service_config DROP COLUMN "eligible_resource_ids";
CREATE TABLE taplo.service_config__eligible_resource_ids (business_id text NOT NULL, owner_id text NOT NULL, target_id text NOT NULL, position integer NOT NULL CHECK(position>=0), PRIMARY KEY(business_id,owner_id,target_id), UNIQUE(business_id,owner_id,position), FOREIGN KEY(business_id,owner_id) REFERENCES taplo.service_config(business_id,id), FOREIGN KEY(business_id,target_id) REFERENCES taplo.resource(business_id,id));
ALTER TABLE taplo.service_config__eligible_resource_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.service_config__eligible_resource_ids FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.service_config__eligible_resource_ids USING (business_id=nullif(current_setting('app.business_id',true),'')) WITH CHECK (business_id=nullif(current_setting('app.business_id',true),''));
ALTER TABLE taplo.class_config DROP COLUMN "host_resource_ids";
CREATE TABLE taplo.class_config__host_resource_ids (business_id text NOT NULL, owner_id text NOT NULL, target_id text NOT NULL, position integer NOT NULL CHECK(position>=0), PRIMARY KEY(business_id,owner_id,target_id), UNIQUE(business_id,owner_id,position), FOREIGN KEY(business_id,owner_id) REFERENCES taplo.class_config(business_id,id), FOREIGN KEY(business_id,target_id) REFERENCES taplo.resource(business_id,id));
ALTER TABLE taplo.class_config__host_resource_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.class_config__host_resource_ids FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.class_config__host_resource_ids USING (business_id=nullif(current_setting('app.business_id',true),'')) WITH CHECK (business_id=nullif(current_setting('app.business_id',true),''));
ALTER TABLE taplo.class_config DROP COLUMN "session_ids";
CREATE TABLE taplo.class_config__session_ids (business_id text NOT NULL, owner_id text NOT NULL, target_id text NOT NULL, position integer NOT NULL CHECK(position>=0), PRIMARY KEY(business_id,owner_id,target_id), UNIQUE(business_id,owner_id,position), FOREIGN KEY(business_id,owner_id) REFERENCES taplo.class_config(business_id,id), FOREIGN KEY(business_id,target_id) REFERENCES taplo.session(business_id,id));
ALTER TABLE taplo.class_config__session_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.class_config__session_ids FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.class_config__session_ids USING (business_id=nullif(current_setting('app.business_id',true),'')) WITH CHECK (business_id=nullif(current_setting('app.business_id',true),''));
ALTER TABLE taplo.credit_package_config DROP COLUMN "eligible_offer_ids";
CREATE TABLE taplo.credit_package_config__eligible_offer_ids (business_id text NOT NULL, owner_id text NOT NULL, target_id text NOT NULL, position integer NOT NULL CHECK(position>=0), PRIMARY KEY(business_id,owner_id,target_id), UNIQUE(business_id,owner_id,position), FOREIGN KEY(business_id,owner_id) REFERENCES taplo.credit_package_config(business_id,id), FOREIGN KEY(business_id,target_id) REFERENCES taplo.offer(business_id,id));
ALTER TABLE taplo.credit_package_config__eligible_offer_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE taplo.credit_package_config__eligible_offer_ids FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON taplo.credit_package_config__eligible_offer_ids USING (business_id=nullif(current_setting('app.business_id',true),'')) WITH CHECK (business_id=nullif(current_setting('app.business_id',true),''));
COMMIT;
-- Before use: runtime role must not bypass RLS/own tables; authenticated server binds transaction-local tenant context and checks action/field/assurance. Worker and Console use scoped dedicated roles, not browser service credentials.
