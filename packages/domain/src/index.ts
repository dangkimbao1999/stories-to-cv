export type EntityId = string;

export type FactStatus = "proposed" | "confirmed";

export interface KnowledgeFact {
  id: EntityId;
  userId: EntityId;
  kind: string;
  summary: string;
  status: FactStatus;
}
