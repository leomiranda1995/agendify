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

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return row;
  }

  async create({
    name, email, password, phone, type_user,
  }) {
    const [row] = await db.query(`
      INSERT INTO users
        (name, email, password, phone, type_user)
      VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *
    `, [name, email, password, phone, type_user]);

    return row;
  }

  async update(id, {
    name, password, phone, type_user,
  }) {
    const [row] = await db.query(`
      UPDATE users
         SET name = $1,
             password = $2,
             phone = $3,
             type_user = $4
       WHERE id = $5
       RETURNING *
    `, [name, password, phone, type_user, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new EventRepository();
