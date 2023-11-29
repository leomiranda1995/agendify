const db = require('../configs/database');

class EventRepository {
  async findAll(userIdProfessional, date) {
    const rows = await db.query(`
    SELECT *
      FROM events
     WHERE userIdProfessional = $1
       AND dateEvent = $2
     ORDER BY startTime
    `, [userIdProfessional, date]);

    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
    SELECT *
      FROM events
       WHERE id = $1
    `, [id]);

    return row;
  }

  async create({
    userIdProfessional,
    userIdClient,
    dateEvent,
    startTime,
    endTime,
    status = 'A',
    updated,
    summary,
    description,
    color = 'blue',
  }) {
    const [row] = await db.query(`
    INSERT INTO events (userIdProfessional, userIdClient, dateEvent, startTime, endTime, status, updated, summary, description, color)
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `, [
      userIdProfessional,
      userIdClient,
      dateEvent,
      startTime,
      endTime,
      status,
      updated,
      summary,
      description,
      color,
    ]);

    return row;
  }

  async update(id, {
    dateEvent,
    startTime,
    endTime,
    status,
    summary,
    description,
    color,
  }) {
    const [row] = await db.query(`
      UPDATE events
         SET dateEvent = $1,
             startTime = $2,
             endTime = $3,
             status = $4,
             summary = $5,
             description = $6,
             color = $7,
             updated = timezone('America/Sao_Paulo', CURRENT_TIMESTAMP)
       WHERE id = $8
       RETURNING *
    `, [
      dateEvent,
      startTime,
      endTime,
      status,
      summary,
      description,
      color,
      id,
    ]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM events WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new EventRepository();
