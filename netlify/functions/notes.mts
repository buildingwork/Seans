import type { Config, Context } from '@netlify/functions';
import { and, desc, eq, sql } from 'drizzle-orm';
import { getDb } from '../../db/index.js';
import { communityNotes } from '../../db/schema.js';
import { verifySeanAccess } from '../../src/utils/nameVerification.js';

function publicNote(note: typeof communityNotes.$inferSelect, ownerId?: string) {
  const { ownerId: storedOwner, ...fields } = note;
  return { ...fields, createdAt: note.createdAt.getTime(), x: 0, y: 0, canDelete: storedOwner === ownerId };
}

export default async (req: Request, context: Context) => {
  const respond = (body: unknown, status = 200) => Response.json(body, {
    status, headers: { 'Cache-Control': 'no-store' },
  });
  if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(req.method)) {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, POST, PATCH, DELETE' } });
  }
  // Writes must originate on this site and use JSON; no cross-site form submissions.
  if (req.method !== 'GET') {
    const origin = req.headers.get('origin');
    if (origin && origin !== new URL(req.url).origin) return respond({ error: 'Request origin is not allowed.' }, 403);
    if (!req.headers.get('content-type')?.includes('application/json')) return respond({ error: 'JSON is required.' }, 415);
  }
  const cookieName = 'sean_board_owner';
  const ownerId = context.cookies.get(cookieName);
  try {
    if (req.method === 'GET') {
      const db = getDb();
      const notes = await db.select().from(communityNotes).orderBy(desc(communityNotes.createdAt)).limit(100);
      return respond(notes.map((note) => publicNote(note, ownerId)));
    }
    const raw = await req.text();
    if (raw.length > 8192) return respond({ error: 'Your note is too long.' }, 413);
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
      if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    } catch {
      return respond({ error: 'Invalid JSON request.' }, 400);
    }
    if (req.method === 'POST') {
      const { authorName, content, color } = body;
      if (typeof authorName !== 'string' || !authorName.trim() || authorName.trim().length > 80 ||
          typeof content !== 'string' || !content.trim() || content.trim().length > 1000 ||
          typeof color !== 'string' || !['yellow', 'pink', 'cyan', 'green', 'orange', 'purple'].includes(color)) {
        return respond({ error: 'Use a name up to 80 characters, a note of 1–1,000 characters, and a valid color.' }, 400);
      }
      const verification = verifySeanAccess(authorName);
      if (!verification.allowed) return respond({ error: 'Please enter a Sean name to post.' }, 400);
      const writerId = ownerId || crypto.randomUUID();
      const db = getDb();
      const [note] = await db.insert(communityNotes).values({
        ownerId: writerId, authorName: authorName.trim(), authorSpelling: verification.matchedSpelling!,
        content: content.trim(), color, rotation: Math.floor(Math.random() * 8) - 4,
      }).returning();
      if (!ownerId) context.cookies.set({
        name: cookieName, value: writerId, httpOnly: true, secure: new URL(req.url).protocol === 'https:',
        sameSite: 'Strict', path: '/', maxAge: 60 * 60 * 24 * 365,
      });
      return respond(publicNote(note, writerId), 201);
    }
    if (typeof body.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.id)) {
      return respond({ error: 'Invalid note ID.' }, 400);
    }
    if (req.method === 'PATCH') {
      const db = getDb();
      const [note] = await db.update(communityNotes).set({ likes: sql`${communityNotes.likes} + 1` })
        .where(eq(communityNotes.id, body.id)).returning();
      return note ? respond(publicNote(note, ownerId)) : respond({ error: 'This note no longer exists.' }, 404);
    }
    if (!ownerId) return respond({ error: 'Only the browser that posted a note can delete it.' }, 403);
    const db = getDb();
    const deleted = await db.delete(communityNotes).where(and(eq(communityNotes.id, body.id), eq(communityNotes.ownerId, ownerId))).returning({ id: communityNotes.id });
    return deleted.length ? respond({ id: body.id }) : respond({ error: 'Note not found or not owned by this browser.' }, 403);
  } catch {
    return respond({ error: 'The community board is unavailable. Please try again shortly.' }, 503);
  }
};

export const config: Config = { path: '/api/notes' };
