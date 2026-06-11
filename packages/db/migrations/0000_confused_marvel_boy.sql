CREATE TYPE "public"."auth_provider" AS ENUM('google');--> statement-breakpoint
CREATE TYPE "public"."chat_session_status" AS ENUM('draft', 'active', 'reviewed', 'selected_for_kb');--> statement-breakpoint
CREATE TYPE "public"."cv_generation_status" AS ENUM('draft', 'researching', 'refining', 'generated');--> statement-breakpoint
CREATE TABLE "auth_identities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" "auth_provider" NOT NULL,
	"provider_account_id" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"domain_pack_id" uuid,
	"status" "chat_session_status" DEFAULT 'draft' NOT NULL,
	"selected_for_knowledge_base" boolean DEFAULT false NOT NULL,
	"intent" text NOT NULL,
	"skill_cluster_ids" uuid[] DEFAULT '{}' NOT NULL,
	"started_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_generation_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "cv_generation_status" DEFAULT 'draft' NOT NULL,
	"job_description_snapshot" jsonb,
	"company_research_snapshot" jsonb,
	"missing_info_checklist" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"version" integer NOT NULL,
	"label" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"template_definition" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generation_session_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"structured_content" jsonb NOT NULL,
	"rendered_output_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domain_packs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"label" text NOT NULL,
	"version" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domain_question_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain_pack_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"version" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"questions" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domain_skill_clusters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain_pack_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"label" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"source_session_id" uuid NOT NULL,
	"summary" text NOT NULL,
	"curated_conclusion" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_fact_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fact_id" uuid NOT NULL,
	"session_id" uuid,
	"message_id" uuid,
	"document_id" uuid,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_facts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"summary" text NOT NULL,
	"status" text DEFAULT 'proposed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onboarding_forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"version" integer NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"questions" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "onboarding_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"form_id" uuid NOT NULL,
	"form_version" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"headline" text,
	"onboarding_completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploaded_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"storage_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"primary_email" text NOT NULL,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_identities" ADD CONSTRAINT "auth_identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_domain_pack_id_domain_packs_id_fk" FOREIGN KEY ("domain_pack_id") REFERENCES "public"."domain_packs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_generation_sessions" ADD CONSTRAINT "cv_generation_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_versions" ADD CONSTRAINT "cv_versions_generation_session_id_cv_generation_sessions_id_fk" FOREIGN KEY ("generation_session_id") REFERENCES "public"."cv_generation_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_versions" ADD CONSTRAINT "cv_versions_template_id_cv_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."cv_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_question_sets" ADD CONSTRAINT "domain_question_sets_domain_pack_id_domain_packs_id_fk" FOREIGN KEY ("domain_pack_id") REFERENCES "public"."domain_packs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_skill_clusters" ADD CONSTRAINT "domain_skill_clusters_domain_pack_id_domain_packs_id_fk" FOREIGN KEY ("domain_pack_id") REFERENCES "public"."domain_packs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_assets" ADD CONSTRAINT "knowledge_assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_assets" ADD CONSTRAINT "knowledge_assets_source_session_id_chat_sessions_id_fk" FOREIGN KEY ("source_session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_fact_sources" ADD CONSTRAINT "knowledge_fact_sources_fact_id_knowledge_facts_id_fk" FOREIGN KEY ("fact_id") REFERENCES "public"."knowledge_facts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_fact_sources" ADD CONSTRAINT "knowledge_fact_sources_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_fact_sources" ADD CONSTRAINT "knowledge_fact_sources_message_id_chat_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."chat_messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_fact_sources" ADD CONSTRAINT "knowledge_fact_sources_document_id_uploaded_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."uploaded_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_facts" ADD CONSTRAINT "knowledge_facts_asset_id_knowledge_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."knowledge_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_facts" ADD CONSTRAINT "knowledge_facts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_responses" ADD CONSTRAINT "onboarding_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "onboarding_responses" ADD CONSTRAINT "onboarding_responses_form_id_onboarding_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."onboarding_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_documents" ADD CONSTRAINT "uploaded_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "auth_identities_provider_account_unique" ON "auth_identities" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE INDEX "chat_messages_session_idx" ON "chat_messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "chat_sessions_user_status_idx" ON "chat_sessions" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "cv_generation_sessions_user_status_idx" ON "cv_generation_sessions" USING btree ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "cv_templates_slug_version_unique" ON "cv_templates" USING btree ("slug","version");--> statement-breakpoint
CREATE UNIQUE INDEX "cv_versions_session_version_unique" ON "cv_versions" USING btree ("generation_session_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "domain_packs_slug_version_unique" ON "domain_packs" USING btree ("slug","version");--> statement-breakpoint
CREATE UNIQUE INDEX "domain_question_sets_domain_slug_version_unique" ON "domain_question_sets" USING btree ("domain_pack_id","slug","version");--> statement-breakpoint
CREATE UNIQUE INDEX "domain_skill_clusters_domain_slug_unique" ON "domain_skill_clusters" USING btree ("domain_pack_id","slug");--> statement-breakpoint
CREATE INDEX "knowledge_assets_user_idx" ON "knowledge_assets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "knowledge_fact_sources_fact_idx" ON "knowledge_fact_sources" USING btree ("fact_id");--> statement-breakpoint
CREATE INDEX "knowledge_facts_user_kind_idx" ON "knowledge_facts" USING btree ("user_id","kind");--> statement-breakpoint
CREATE UNIQUE INDEX "onboarding_forms_slug_version_unique" ON "onboarding_forms" USING btree ("slug","version");--> statement-breakpoint
CREATE INDEX "onboarding_responses_user_idx" ON "onboarding_responses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "uploaded_documents_user_idx" ON "uploaded_documents" USING btree ("user_id");