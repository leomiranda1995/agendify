const db = require('../configs/database');

class EventRepository {
  async findAllProfessional(userIdProfessional, dateStart, dateEnd) {
    const rows = await db.query(`
    SELECT *
      FROM events
     WHERE userIdProfessional = $1
       AND dateEvent between $2 and $3
     ORDER BY dateEvent, startTime
    `, [userIdProfessional, dateStart, dateEnd]);

    return rows;
  }

  async findAllClient(userIdClient) {
    const rows = await db.query(`
    SELECT *
      FROM events
     WHERE userIdClient = $1
     ORDER BY dateEvent, startTime
    `, [userIdClient]);

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

  async findByProfessionalDateStartTime(userIdProfessional, dateEvent, startTime) {
    const [row] = await db.query(`
    SELECT *
      FROM events
     WHERE userIdProfessional = $1
       AND dateEvent = $2
       AND startTime = $3
    `, [userIdProfessional, dateEvent, startTime]);

    return row;
  }

  async create({
    userIdProfessional,
    userIdClient,
    clientName,
    clientPhone,
    clientEmail,
    serviceId,
    serviceDescription,
    servicePrice,
    eventDescription,
    dateEvent,
    startTime,
    status = 'A',
    observation,
    color = 'blue',
  }) {
    const [row] = await db.query(`
    INSERT INTO events (userIdProfessional, userIdClient, clientName, clientPhone,
                        clientEmail, serviceId, serviceDescription, servicePrice,
                        eventDescription, dateEvent, startTime, status, observation, color)
    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
    `, [
      userIdProfessional,
      userIdClient,
      clientName,
      clientPhone,
      clientEmail,
      serviceId,
      serviceDescription,
      servicePrice,
      eventDescription,
      dateEvent,
      startTime,
      status,
      observation,
      color,
    ]);

    return row;
  }

  async update(id, {
    clientName,
    clientPhone,
    clientEmail,
    serviceDescription,
    servicePrice,
    eventDescription,
    dateEvent,
    startTime,
    status,
    observation,
    color,
  }) {
    const [row] = await db.query(`
      UPDATE events
         SET clientName = $1,
             clientPhone = $2,
             clientEmail = $3,
             serviceDescription = $4,
             servicePrice = $5,
             eventDescription = $6,
             dateEvent = $7,
             startTime = $8,
             status = $9,
             observation = $10,
             color = $11,
             updated = timezone('America/Sao_Paulo', CURRENT_TIMESTAMP)
       WHERE id = $12
       RETURNING *
    `, [
      clientName,
      clientPhone,
      clientEmail,
      serviceDescription,
      servicePrice,
      eventDescription,
      dateEvent,
      startTime,
      status,
      observation,
      color,
      id,
    ]);

    return row;
  }

  async updateEventProfessional(id, {
    newPrice,
    newDateEvent,
    newStartTime,
  }) {
    const [row] = await db.query(`
      UPDATE events
         SET servicePrice = $1,
             dateEvent = $2,
             startTime = $3,
             updated = timezone('America/Sao_Paulo', CURRENT_TIMESTAMP)
       WHERE id = $4
       RETURNING *
    `, [
      newPrice,
      newDateEvent,
      newStartTime,
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
