const { nanoid } = require("nanoid");

const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumService {
  constructor() {
    this._albums = [];
  }

  addAlbum({ name, year }) {
    const id = nanoid(16);
    this._albums.push({
      id,
      name,
      year,
    });

    const isSuccess =
      this._albums.filter((album) => album.id === id).length > 0;
    if (!isSuccess) throw new Error("catatan gagal ditambahkan");
    return id;
  }
  getAlbumById(id) {
    const album = this._albums.filter((album) => album.id === id);
    if (album.length < 1) throw new NotFoundError("album tidak ditemukan");
    return album[0];
  }
  editAlbumById(id, { name, year }) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1)
      throw new NotFoundError("gagal mengedit album, Id tidak ditemukan");
    this._albums[index] = {
      ...this._albums[index],
      name,
      year,
    };
  }
  deleteAlbumById(id) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
    this._albums.splice(index, 1);
  }
}

module.exports = AlbumService;
