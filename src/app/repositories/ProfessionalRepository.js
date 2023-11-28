const db = require('../../database');

class ProfessionalRepository {
  async findAll(orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const rows = await db.query(`
      SELECT *
        FROM professionals
       ORDER BY name ${direction}
    `);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
    SELECT *
      FROM professionals
       WHERE id = $1
    `, [id]);
    return row;
  }

  async findByUserId(id) {
    const [row] = await db.query(`
    SELECT *
      FROM professionals
       WHERE user_id = $1
    `, [id]);
    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM professionals WHERE email = $1', [email]);
    return row;
  }

  async create(user_id, {
    description, photo, activity, location, type_service,
  }) {
    const [row] = await db.query(`
      INSERT INTO professionals
        (description, photo, activity, location, type_service, user_id)
      VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `, [description, photo, activity, location, type_service, user_id]);

    return row;
  }

  async update(user_id, {
    description, photo, activity, location, type_service,
  }) {
    const [row] = await db.query(`
      UPDATE professionals
         SET description = $1,
             photo = $2,
             activity = $3,
             location = $4,
             type_service = $5
       WHERE user_id = $6
       RETURNING *
    `, [description, photo, activity, location, type_service, user_id]);

    return row;
  }

  async delete(user_id) {
    const deleteOp = await db.query('DELETE FROM professionals WHERE user_id = $1', [user_id]);
    return deleteOp;
  }
}

module.exports = new ProfessionalRepository();
