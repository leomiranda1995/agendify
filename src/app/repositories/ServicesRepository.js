const db = require('../../database');

class ServicesRepository {
  async findAll(orderBy = 'ASC', userId = '') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const whereUserId = (userId !== '' ? `where u.id = '${userId}'` : '');

    const rows = await db.query(`
      SELECT s.*
        FROM services s
       INNER JOIN users u ON (u.id = s.user_id)
        ${whereUserId}
       ORDER BY s.name ${direction}
    `);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
    SELECT services.*
        FROM services
       WHERE services.id = $1
    `, [id]);
    return row;
  }

  async create({
    name, description, price, duration, availability,
    special_requirements, optional, photo1, photo2, photo3, user_id,
  }) {
    const [row] = await db.query(`
      INSERT INTO services
        (name, description, price, duration, availability,
         special_requirements, optional, photo1, photo2, photo3, user_id)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
    `, [name, description, price, duration, availability,
      special_requirements, optional, photo1, photo2, photo3, user_id]);

    return row;
  }

  async update(id, {
    name, description, price, duration, availability,
    special_requirements, optional, photo1, photo2, photo3,
  }) {
    const [row] = await db.query(`
      UPDATE services
         SET name = $1,
             description = $2,
             price = $3,
             duration = $4,
             availability = $5,
             special_requirements = $6,
             optional = $7,
             photo1 = $8,
             photo2 = $9,
             photo3 = $10
       WHERE id = $11
       RETURNING *
    `, [name, description, price, duration, availability,
      special_requirements, optional, photo1, photo2, photo3, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM services WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ServicesRepository();
