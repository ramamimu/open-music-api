const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const NotFoundError = require("../../exceptions/NotFoundError");
const { AlbumTableName } = require("../../types/TableName");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);

    const query = {
      text: `INSERT INTO ${AlbumTableName} VALUES($1, $2, $3) RETURNING id`,
      values: [id, name, year],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error("catatan gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: `SELECT * from ${AlbumTableName} where id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: `UPDATE ${AlbumTableName} SET name = $1, year = $2 WHERE id = $3 RETURNING id`,
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: `DELETE FROM ${AlbumTableName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = AlbumService;
