import { pgTable, uuid, text, timestamp, integer, index } from 'drizzle-orm/pg-core';

export const communityNotes = pgTable('community_notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').notNull(),
  authorName: text('author_name').notNull(),
  authorSpelling: text('author_spelling').notNull(),
  color: text('color').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  likes: integer('likes').default(0).notNull(),
  rotation: integer('rotation').default(0).notNull(),
}, (table) => [index('community_notes_created_at_idx').on(table.createdAt)]);
