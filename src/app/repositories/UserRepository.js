const db = require('../configs/database');

class UserRepository {
  async findAll(orderBy = 'ASC', userTypeFilter = '') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    userTypeFilter = userTypeFilter.toUpperCase();

    const whereUserTypeFilter = ((userTypeFilter.includes('C') || userTypeFilter.includes('P')) ? `where type_user = '${userTypeFilter}'` : '');

    const rows = await db.query(`
      SELECT *
        FROM users
        ${whereUserTypeFilter}
       ORDER BY name ${direction}
    `);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
    SELECT *
      FROM users
       WHERE id = $1
    `, [id]);
    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return row;
  }

  async create({
    name, email, password, photo, phone, type_user, status = 'A',
  }) {
    const [row] = await db.query(`
      INSERT INTO users
        (name, email, password, photo, phone, type_user, status)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `, [name, email, password, photo, phone, type_user, status]);

    return row;
  }

  async update(id, {
    name, photo, phone, status = 'A', type_user,
  }) {
    const [row] = await db.query(`
      UPDATE users
         SET name = $1,
             photo = $2,
             phone = $3,
             status = $4,
             type_user = $5
       WHERE id = $6
       RETURNING *
    `, [name, photo, phone, status, type_user, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return deleteOp;
  }

  async updatePassword(id, { newPassword }) {
    const [row] = await db.query(`
      UPDATE users
         SET password = $1
       WHERE id = $2
       RETURNING *
    `, [newPassword, id]);

    return row;
  }
}

module.exports = new UserRepository();
