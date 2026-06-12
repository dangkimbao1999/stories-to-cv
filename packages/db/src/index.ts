import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const authProviderEnum = pgEnum("auth_provider", ["google"]);
export const chatSessionStatusEnum = pgEnum("chat_session_status", ["draft", "active", "reviewed", "selected_for_kb"]);
export const cvGenerationStatusEnum = pgEnum("cv_generation_status", ["draft", "researching", "refining", "generated"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  primaryEmail: text("primary_email").notNull(),
  displayName: text("display_name"),
  ...timestamps,
});

export const authIdentities = pgTable(
  "auth_identities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: authProviderEnum("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    email: text("email").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("auth_identities_provider_account_unique").on(table.provider, table.providerAccountId)],
);

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name"),
  headline: text("headline"),
  onboardingCompletedAt: timestamp("onboarding_completed_at", { withTimezone: true }),
  ...timestamps,
});

export const onboardingForms = pgTable(
  "onboarding_forms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    version: integer("version").notNull(),
    active: boolean("active").notNull().default(true),
    questions: jsonb("questions").$type<Array<Record<string, unknown>>>().notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("onboarding_forms_slug_version_unique").on(table.slug, table.version)],
);

export const onboardingResponses = pgTable(
  "onboarding_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    formId: uuid("form_id")
      .notNull()
      .references(() => onboardingForms.id),
    formVersion: integer("form_version").notNull(),
    answers: jsonb("answers").$type<Array<Record<string, unknown>>>().notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("onboarding_responses_user_idx").on(table.userId)],
);

export const domainPacks = pgTable(
  "domain_packs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    label: text("label").notNull(),
    version: integer("version").notNull(),
    active: boolean("active").notNull().default(true),
    ...timestamps,
  },
  (table) => [uniqueIndex("domain_packs_slug_version_unique").on(table.slug, table.version)],
);

export const domainSkillClusters = pgTable(
  "domain_skill_clusters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    domainPackId: uuid("domain_pack_id")
      .notNull()
      .references(() => domainPacks.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    label: text("label").notNull(),
    active: boolean("active").notNull().default(true),
    ...timestamps,
  },
  (table) => [uniqueIndex("domain_skill_clusters_domain_slug_unique").on(table.domainPackId, table.slug)],
);

export const domainQuestionSets = pgTable(
  "domain_question_sets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    domainPackId: uuid("domain_pack_id")
      .notNull()
      .references(() => domainPacks.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    version: integer("version").notNull(),
    active: boolean("active").notNull().default(true),
    questions: jsonb("questions").$type<Array<Record<string, unknown>>>().notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("domain_question_sets_domain_slug_version_unique").on(table.domainPackId, table.slug, table.version),
  ],
);

export const jobDescriptions = pgTable(
  "job_descriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title"),
    company: text("company"),
    snapshotText: text("snapshot_text").notNull(),
    sourceUrl: text("source_url"),
    ...timestamps,
  },
  (table) => [index("job_descriptions_user_idx").on(table.userId)],
);

export const jobDescriptionSources = pgTable(
  "job_description_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobDescriptionId: uuid("job_description_id")
      .notNull()
      .references(() => jobDescriptions.id, { onDelete: "cascade" }),
    documentId: uuid("document_id").references(() => uploadedDocuments.id),
    sourceKind: text("source_kind", { enum: ["text", "url", "upload"] }).notNull(),
    sourceLabel: text("source_label").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("job_description_sources_jd_idx").on(table.jobDescriptionId)],
);

export const companyResearchSnapshots = pgTable(
  "company_research_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobDescriptionId: uuid("job_description_id")
      .notNull()
      .references(() => jobDescriptions.id, { onDelete: "cascade" }),
    summary: text("summary").notNull(),
    findings: jsonb("findings").$type<Array<Record<string, unknown>>>().notNull().default([]),
    ...timestamps,
  },
  (table) => [index("company_research_snapshots_jd_idx").on(table.jobDescriptionId)],
);

export const chatSessions = pgTable(
  "chat_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    domainPackId: uuid("domain_pack_id").references(() => domainPacks.id),
    status: chatSessionStatusEnum("status").notNull().default("draft"),
    selectedForKnowledgeBase: boolean("selected_for_knowledge_base").notNull().default(false),
    intent: text("intent").notNull(),
    skillClusterIds: uuid("skill_cluster_ids").array().notNull().default([]),
    startedAt: timestamp("started_at", { withTimezone: true }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [index("chat_sessions_user_status_idx").on(table.userId, table.status)],
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => chatSessions.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
    content: text("content").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("chat_messages_session_idx").on(table.sessionId)],
);

export const sessionTags = pgTable(
  "session_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => chatSessions.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("session_tags_session_label_unique").on(table.sessionId, table.label)],
);

export const uploadedDocuments = pgTable(
  "uploaded_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    storageKey: text("storage_key").notNull(),
    ...timestamps,
  },
  (table) => [index("uploaded_documents_user_idx").on(table.userId)],
);

export const documentExtractions = pgTable(
  "document_extractions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => uploadedDocuments.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["pending", "completed", "failed"] })
      .notNull()
      .default("pending"),
    extractedText: text("extracted_text"),
    errorMessage: text("error_message"),
    ...timestamps,
  },
  (table) => [index("document_extractions_document_idx").on(table.documentId)],
);

export const sessionSources = pgTable(
  "session_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => chatSessions.id, { onDelete: "cascade" }),
    documentId: uuid("document_id").references(() => uploadedDocuments.id),
    extractionId: uuid("extraction_id").references(() => documentExtractions.id),
    sourceKind: text("source_kind", { enum: ["upload", "paste", "note"] }).notNull(),
    label: text("label").notNull(),
    ...timestamps,
  },
  (table) => [index("session_sources_session_idx").on(table.sessionId)],
);

export const knowledgeAssets = pgTable(
  "knowledge_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sourceSessionId: uuid("source_session_id")
      .notNull()
      .references(() => chatSessions.id),
    summary: text("summary").notNull(),
    curatedConclusion: text("curated_conclusion").notNull(),
    ...timestamps,
  },
  (table) => [index("knowledge_assets_user_idx").on(table.userId)],
);

export const knowledgeFacts = pgTable(
  "knowledge_facts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("asset_id")
      .notNull()
      .references(() => knowledgeAssets.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    summary: text("summary").notNull(),
    status: text("status", { enum: ["proposed", "confirmed"] })
      .notNull()
      .default("proposed"),
    ...timestamps,
  },
  (table) => [index("knowledge_facts_user_kind_idx").on(table.userId, table.kind)],
);

export const knowledgeFactSources = pgTable(
  "knowledge_fact_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    factId: uuid("fact_id")
      .notNull()
      .references(() => knowledgeFacts.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id").references(() => chatSessions.id),
    messageId: uuid("message_id").references(() => chatMessages.id),
    documentId: uuid("document_id").references(() => uploadedDocuments.id),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("knowledge_fact_sources_fact_idx").on(table.factId)],
);

export const cvTemplates = pgTable(
  "cv_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    version: integer("version").notNull(),
    label: text("label").notNull(),
    active: boolean("active").notNull().default(true),
    templateDefinition: jsonb("template_definition").$type<Record<string, unknown>>().notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("cv_templates_slug_version_unique").on(table.slug, table.version)],
);

export const cvGenerationSessions = pgTable(
  "cv_generation_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobDescriptionId: uuid("job_description_id").references(() => jobDescriptions.id),
    status: cvGenerationStatusEnum("status").notNull().default("draft"),
    jobDescriptionSnapshot: jsonb("job_description_snapshot").$type<Record<string, unknown>>(),
    companyResearchSnapshot: jsonb("company_research_snapshot").$type<Record<string, unknown>>(),
    missingInfoChecklist: jsonb("missing_info_checklist").$type<Array<Record<string, unknown>>>().notNull().default([]),
    ...timestamps,
  },
  (table) => [index("cv_generation_sessions_user_status_idx").on(table.userId, table.status)],
);

export const cvVersions = pgTable(
  "cv_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    generationSessionId: uuid("generation_session_id")
      .notNull()
      .references(() => cvGenerationSessions.id, { onDelete: "cascade" }),
    templateId: uuid("template_id")
      .notNull()
      .references(() => cvTemplates.id),
    version: integer("version").notNull(),
    structuredContent: jsonb("structured_content").$type<Record<string, unknown>>().notNull(),
    renderedOutputKey: text("rendered_output_key"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("cv_versions_session_version_unique").on(table.generationSessionId, table.version)],
);

export const consents = pgTable(
  "consents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    purpose: text("purpose").notNull(),
    grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  },
  (table) => [index("consents_user_purpose_idx").on(table.userId, table.purpose)],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorUserId: uuid("actor_user_id").references(() => users.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("audit_logs_actor_action_idx").on(table.actorUserId, table.action)],
);

export const usersRelations = relations(users, ({ many, one }) => ({
  authIdentities: many(authIdentities),
  chatSessions: many(chatSessions),
  cvGenerationSessions: many(cvGenerationSessions),
  knowledgeAssets: many(knowledgeAssets),
  profile: one(profiles),
}));

export const chatSessionsRelations = relations(chatSessions, ({ many, one }) => ({
  domainPack: one(domainPacks, {
    fields: [chatSessions.domainPackId],
    references: [domainPacks.id],
  }),
  knowledgeAssets: many(knowledgeAssets),
  messages: many(chatMessages),
  user: one(users, {
    fields: [chatSessions.userId],
    references: [users.id],
  }),
}));

export const knowledgeAssetsRelations = relations(knowledgeAssets, ({ many, one }) => ({
  facts: many(knowledgeFacts),
  sourceSession: one(chatSessions, {
    fields: [knowledgeAssets.sourceSessionId],
    references: [chatSessions.id],
  }),
  user: one(users, {
    fields: [knowledgeAssets.userId],
    references: [users.id],
  }),
}));
