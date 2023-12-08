const db = require('../configs/database');

class EventRepository {
  async findAll(userIdProfessional, dateStart, dateEnd) {
    const rows = await db.query(`
    SELECT *
      FROM events
     WHERE userIdProfessional = $1
       AND dateEvent between $2 and $3
     ORDER BY dateEvent, startTime
    `, [userIdProfessional, dateStart, dateEnd]);

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
    serviceId,
    dateEvent,
    startTime,
    status = 'A',
    observation,
    color = 'blue',
  }) {
    const [row] = await db.query(`
    INSERT INTO events (userIdProfessional, userIdClient, serviceId, dateEvent, startTime, status, observation, color)
    values ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `, [
      userIdProfessional,
      userIdClient,
      serviceId,
      dateEvent,
      startTime,
      status,
      observation,
      color,
    ]);

    return row;
  }

  async update(id, {
    userIdClient,
    serviceId,
    dateEvent,
    startTime,
    status,
    observation,
    color,
  }) {
    const [row] = await db.query(`
      UPDATE events
         SET userIdClient = $1,
             serviceId = $2,
             dateEvent = $3,
             startTime = $4,
             status = $5,
             observation = $6,
             color = $7,
             updated = timezone('America/Sao_Paulo', CURRENT_TIMESTAMP)
       WHERE id = $8
       RETURNING *
    `, [
      userIdClient,
      serviceId,
      dateEvent,
      startTime,
      status,
      observation,
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
