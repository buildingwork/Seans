CREATE TABLE "community_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"owner_id" uuid NOT NULL,
	"author_name" text NOT NULL,
	"author_spelling" text NOT NULL,
	"color" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"rotation" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX "community_notes_created_at_idx" ON "community_notes" ("created_at");