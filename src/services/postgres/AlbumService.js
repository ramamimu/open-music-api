const { Pool } = require("pg");
const { nanoid } = require("nanoid");

const NotFoundError = require("../../exceptions/NotFoundError");
const ClientError = require("../../exceptions/ClientError");
const {
  AlbumTableName,
  AlbumLikesTableName,
} = require("../../types/TableName");

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
      throw new NotFoundError("Album tidak ditemukan");
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

  async verifyAlbumById(albumId) {
    const query = {
      text: `SELECT * from ${AlbumTableName} where id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }
  }

  async verifyAlbumHasLikedByUserId(albumId, userId) {
    const queryHasLike = {
      text: `SELECT * FROM ${AlbumLikesTableName} WHERE album_id = $1 AND user_id = $2`,
      values: [albumId, userId],
    };

    const resultHasLike = await this._pool.query(queryHasLike);

    if (resultHasLike.rows.length) {
      throw new ClientError("Album sudah disukai");
    }
  }

  async addAlbumLikesById(albumId, userId) {
    const id = nanoid(16);
    const queryAddLike = {
      text: `INSERT INTO ${AlbumLikesTableName} VALUES($1, $2, $3) RETURNING id`,
      values: [id, userId, albumId],
    };

    const resultAddLike = await this._pool.query(queryAddLike);
    if (!resultAddLike.rows.length) {
      throw new Error("Album gagal ditambahkan");
    }
  }
  async deleteAlbumLikesById(albumId, userId) {
    const query = {
      text: `DELETE FROM ${AlbumLikesTableName} WHERE album_id = $1 AND user_id = $2 RETURNING id`,
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Album yang disukai tidak ditemukan");
    }
  }
  async getAlbumLikesById(albumId) {
    const query = {
      text: `SELECT COUNT(*) FROM ${AlbumLikesTableName} WHERE album_id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ada");
    }

    return result.rows[0];
  }
}

module.exports = AlbumService;
