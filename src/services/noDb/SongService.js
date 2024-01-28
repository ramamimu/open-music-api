const { nanoid } = require("nanoid");

class SongService {
  constructor() {
    this._songs = [];
  }

  addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    this._songs.push({
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });
    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
    if (!isSuccess) throw new Error("lagu gagal ditambahkan");
    return id;
  }
  getAllSong() {
    return this._songs.map(({ id, title, performer }) => {
      return { id, title, performer };
    });
  }
  getSongById(id) {
    const songs = this._songs.filter((song) => song.id === id);
    if (songs.length < 1) throw new Error("lagu tidak ditemukan");
    return songs[0];
  }
  editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1)
      throw new Error("gagal mengedit lagu, Id tidak ditemukan");
    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };
  }
  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new Error("lagu gagal dihapus. Id tidak ditemukan");
    }
    this._songs.splice(index, 1);
  }
}

module.exports = SongService;
