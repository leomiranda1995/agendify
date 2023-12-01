const db = require('../configs/database');

class ServiceRepository {
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
    name, description, price, availability,
    special_requirements, optional, photos, user_id,
  }) {
    const [row] = await db.query(`
      INSERT INTO services
        (name, description, price, availability,
         special_requirements, optional, photos, user_id)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `, [name, description, price, availability,
      special_requirements, optional, photos, user_id]);

    return row;
  }

  async update(id, {
    name, description, price, availability,
    special_requirements, optional, photos,
  }) {
    const [row] = await db.query(`
      UPDATE services
         SET name = $1,
             description = $2,
             price = $3,
             availability = $4,
             special_requirements = $5,
             optional = $6,
             photos = $7
       WHERE id = $8
       RETURNING *
    `, [name, description, price, availability,
      special_requirements, optional, photos, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM services WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ServiceRepository();
