const db = require('../../database');

class ServicesRepository {
  async findAll(orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const rows = await db.query(`
      SELECT services.*
        FROM services
       INNER JOIN professionals ON (professionals.id = services.professional_id)
       ORDER BY services.name ${direction}
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

  async findByIdProfessional(id) {
    const rows = await db.query(`
    SELECT s.*
      FROM services s
     INNER JOIN professionals p on (s.professional_id = p.id)
     WHERE s.professional_id = $1
    `, [id]);
    return rows;
  }

  async create({
    name, description, price, duration, availability,
    special_requirements, optional, professional_id,
  }) {
    const [row] = await db.query(`
      INSERT INTO services
        (name, description, price, duration, availability,
         special_requirements, optional, professional_id)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `, [name, description, price, duration, availability,
      special_requirements, optional, professional_id]);

    return row;
  }

  async update(id, {
    name, description, price, duration, availability,
    special_requirements, optional, professional_id,
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
             professional_id = $8
       WHERE id = $9
       RETURNING *
    `, [name, description, price, duration, availability,
      special_requirements, optional, professional_id, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM services WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ServicesRepository();
