const { nanoid } = require("nanoid");
const { Pool } = require("pg");

const {
  PlaylistTableName,
  PlaylistSongTableName,
  UserTableName,
  SongTableName,
} = require("../../types/TableName");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }
  async addPlaylist(name, owner) {
    const id = nanoid(16);

    const query = {
      text: `INSERT INTO ${PlaylistTableName} VALUES($1, $2, $3) RETURNING id`,
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error("playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }
  async getPlaylist(owner) {
    const query = {
      text: `SELECT a.id, a.name, b.username FROM ${PlaylistTableName} as a JOIN ${UserTableName} as b ON a.owner = b.id  GROUP BY a.id, b.username HAVING a.owner = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: `SELECT * FROM ${PlaylistTableName} WHERE id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length)
      throw new NotFoundError("Playlist tidak ditemukan");

    if (result.rows[0].owner !== owner)
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
  }
  async deletePlaylistById(playlistId, owner) {
    const query = {
      text: `DELETE FROM ${PlaylistTableName} WHERE id = $1 AND owner = $2 RETURNING id, owner `,
      values: [playlistId, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
  }
  async addPlaylistSongsById(playlistId, songId) {
    const id = nanoid(16);
    const query = {
      text: `INSERT INTO ${PlaylistSongTableName} VALUES($1, $2, $3) RETURNING id`,
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error("Gagal Menambahkan Lagu pada Playlist");
    }
  }
  async getPlaylistSongsById(playlistId) {
    const queryPlaylist = {
      text: `SELECT a.id, a.name, b.username FROM ${PlaylistTableName} as a JOIN ${UserTableName} as b ON a.owner = b.id  GROUP BY a.id, b.username HAVING a.id = $1`,
      values: [playlistId],
    };
    const resultQueryPlaylist = await this._pool.query(queryPlaylist);
    if (!resultQueryPlaylist.rows.length) {
      throw new Error("Playlist tidak ditemukan");
    }

    const { id, name, username } = resultQueryPlaylist.rows[0];

    const querySonglist = {
      text: `SELECT a.song_id, b.title, b.performer FROM ${PlaylistSongTableName} AS a JOIN ${SongTableName} AS b ON a.song_id = b.id GROUP BY a.song_id, b.title, b.performer, a.playlist_id HAVING a.playlist_id = $1`,
      values: [id],
    };

    const resultQuerySonglist = await this._pool.query(querySonglist);
    const songList = resultQuerySonglist.rows.map(
      ({ song_id, title, performer }) => {
        return {
          id: song_id,
          title,
          performer,
        };
      }
    );

    return {
      playlist: {
        id,
        name,
        username,
        songs: songList,
      },
    };
  }
  async deletePlaylistSongsById(playlistId, songId) {
    const query = {
      text: `DELETE FROM ${PlaylistSongTableName} WHERE playlist_id = $1 AND song_id = $2 RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error("Gagal Menghapus lagu di playlist");
    }
  }
}

module.exports = PlaylistService;
