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
    name, password, photo, phone, status = 'A', type_user,
  }) {
    const [row] = await db.query(`
      UPDATE users
         SET name = $1,
             password = $2,
             photo = $3,
             phone = $4,
             status = $5,
             type_user = $6
       WHERE id = $7
       RETURNING *
    `, [name, password, photo, phone, status, type_user, id]);

    return row;
  }

  async delete(id) {
    const deleteOp = await db.query('DELETE FROM users WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new UserRepository();
