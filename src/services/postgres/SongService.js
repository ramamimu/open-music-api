const { nanoid } = require("nanoid");
const { Pool } = require("pg");

const NotFoundError = require("../../exceptions/NotFoundError");
const { SongTableName } = require("../../types/TableName");
const song = require("../../api/song");

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);

    const query = {
      text: `INSERT INTO ${SongTableName} VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error("catatan gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAllSong() {
    const query = {
      text: `SELECT * FROM ${SongTableName}`,
    };

    const result = await this._pool.query(query);

    return result.rows.map(({ id, title, performer }) => {
      return { id, title, performer };
    });
  }

  async getSongById(id) {
    const query = {
      text: `SELECT * from ${SongTableName} where id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifySongId(id) {
    const query = {
      text: `SELECT * from ${SongTableName} where id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
  }

  async editSongById(id, { title, year, genre, performer, duration = 0 }) {
    const query = {
      text: `UPDATE ${SongTableName} SET title = $2, year = $3, genre = $4, performer = $5, duration = $6 WHERE id = $1 RETURNING id, title`,
      values: [id, title, year, genre, performer, duration],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: `DELETE FROM ${SongTableName} WHERE id = $1 RETURNING id`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = SongService;
