const { pool } = require("../config/db");

function createUserRepository() {
  return {
    async findAll() {
      const { rows } = await pool.query(
        "SELECT * FROM users ORDER BY id"
      );
      return rows;
    },

    async findById(id) {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
      );
      return rows[0] || null;
    },

    async create({ name, email }) {
      const { rows } = await pool.query(
        `INSERT INTO users (name, email)
         VALUES ($1, $2)
         RETURNING *`,
        [name, email]
      );

      return rows[0];
    },

    async update(id, { name, email }) {
      const fields = [];
      const values = [];

      if (name !== undefined) {
        values.push(name);
        fields.push(`name = $${values.length}`);
      }

      if (email !== undefined) {
        values.push(email);
        fields.push(`email = $${values.length}`);
      }

      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);

      const { rows } = await pool.query(
        `UPDATE users
         SET ${fields.join(", ")}
         WHERE id = $${values.length}
         RETURNING *`,
        values
      );

      return rows[0] || null;
    },

    async delete(id) {
      const { rowCount } = await pool.query(
        "DELETE FROM users WHERE id = $1",
        [id]
      );

      return rowCount > 0;
    },
  };
}

module.exports = createUserRepository;