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

  async getAlbumById(albumId) {
    const query = {
      text: `SELECT * from ${AlbumTableName} where id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const { id, name, year, cover_url: coverUrl } = result.rows[0];
    return { id, name, year, coverUrl };
  }

  async editAlbumById(id, { name, year, coverUrl = null }) {
    const query = {
      text: `UPDATE ${AlbumTableName} SET name = $1, year = $2, cover_url = $3 WHERE id = $3 RETURNING id`,
      values: [name, year, id, coverUrl],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async editCoverAlbumById(id, coverUrl) {
    const query = {
      text: `UPDATE ${AlbumTableName} SET cover_url = $2 WHERE id = $1 RETURNING id`,
      values: [id, coverUrl],
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
