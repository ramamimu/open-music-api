class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.ValidateSongPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } =
      request.payload;
    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    return h
      .response({
        status: "success",
        data: {
          songId,
        },
      })
      .code(201);
  }
  async getAllSongHandler(request, h) {
    const songs = await this._service.getAllSong();
    return h
      .response({
        status: "success",
        data: {
          songs,
        },
      })
      .code(200);
  }
  async getSongByIdHandler(request, h) {
    const { id: idSong } = request.params;
    const song = await this._service.getSongById(idSong);
    const {
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId: album_id,
    } = song;
    return h
      .response({
        status: "success",
        data: {
          song: { id, title, year, genre, performer, duration, album_id },
        },
      })
      .code(200);
  }
  async putSongByIdHandler(request, h) {
    this._validator.ValidateSongPayload(request.payload);
    const { title, year, genre, performer, duration, albumId } =
      request.payload;
    const { id } = request.params;

    await this._service.editSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    return h
      .response({
        status: "success",
        message: "berhasil mengedit lagu",
      })
      .code(200);
  }
  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return h
      .response({
        status: "success",
        message: "berhasil menghapus lagu",
      })
      .code(200);
  }
}

module.exports = SongHandler;
