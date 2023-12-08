const db = require('../configs/database');

class ScheduleConfigRepository {
  async findAll(userIdProfessional) {
    const whereUserTypeFilter = ((userIdProfessional) ? `where userIdProfessional = '${userIdProfessional}'` : '');

    const rows = await db.query(`
      SELECT *
        FROM professional_weekdays_times
       ${whereUserTypeFilter}
       ORDER BY userIdProfessional, indice
    `);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
    SELECT *
      FROM professional_weekdays_times
     WHERE id = $1
    `, [id]);
    return row;
  }

  async create({
    userIdProfessional, weekDay, indice, work = true, startTimes = ['08:00', '10:00', '13:00', '15:00', '17:00'],
  }) {
    const [row] = await db.query(`
      INSERT INTO professional_weekdays_times
        (userIdProfessional, weekDay, indice, work, startTimes)
      VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *
    `, [userIdProfessional, weekDay, indice, work, startTimes]);

    return row;
  }

  async update(id, {
    userIdProfessional, weekDay, work, startTimes,
  }) {
    const [row] = await db.query(`
      UPDATE professional_weekdays_times
         SET startTimes = $1,
             work = $2
       WHERE id = $3
         AND userIdProfessional = $4
         AND weekDay = $5
       RETURNING *
    `, [startTimes, work, id, userIdProfessional, weekDay]);

    return row;
  }

  async deleteScheduleProfessionalId(userIdProfessional) {
    const deleteOp = await db.query('DELETE FROM professional_weekdays_times WHERE userIdProfessional = $1', [userIdProfessional]);
    return deleteOp;
  }
}

module.exports = new ScheduleConfigRepository();
