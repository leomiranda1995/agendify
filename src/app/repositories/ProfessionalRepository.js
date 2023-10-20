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

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM professionals WHERE email = $1', [email]);
    return row;
  }

  async create({
    name, email, password, activity, description, location, phone, base_price, payment_methods,
  }) {
    const [row] = await db.query(`
      INSERT INTO professionals
        (name, email, password, activity, description, location, phone, base_price, payment_methods)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `, [name, email, password, activity, description, location, phone, base_price, payment_methods]);

    return row;
  }

  async update(id, {
    name, email, password, activity, description, location, phone, base_price, payment_methods,
  }) {
    const [row] = await db.query(`
      UPDATE professionals
         SET name = $1,
             email = $2,
             password = $3,
             activity = $4,
             description = $5,
             location = $6,
             phone = $7,
             base_price = $8,
             payment_methods = $9
       WHERE id = $10
       RETURNING *
    `, [name, email, password, activity, description, location, phone, base_price, payment_methods, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM professionals WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ProfessionalRepository();
