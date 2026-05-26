export function insertMessage(db, { name, email, subject, message }) {
  const result = db
    .prepare(
      `INSERT INTO messages (name, email, subject, message)
       VALUES (@name, @email, @subject, @message)`
    )
    .run({ name, email, subject, message });

  return {
    id: result.lastInsertRowid,
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
  };
}

export function getMessages(db) {
  return db
    .prepare(
      `SELECT id, name, email, subject, message, created_at AS createdAt
       FROM messages ORDER BY created_at DESC`
    )
    .all();
}
