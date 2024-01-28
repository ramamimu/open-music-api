const ClientError = require("../../exceptions/ClientError");

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getAllSongHandler = this.getAllSongHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  postSongHandler(request, h) {
    try {
      this._validator.ValidateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } =
        request.payload;
      const songId = this._service.addSong({
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
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);
    }
  }
  getAllSongHandler(request, h) {
    const songs = this._service.getAllSong();
    return h
      .response({
        status: "success",
        data: {
          songs,
        },
      })
      .code(200);
  }
  getSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = this._service.getSongById(id);
    return h
      .response({
        status: "success",
        data: { song },
      })
      .code(200);
  }
  putSongByIdHandler(request, h) {
    try {
      this._validator.ValidateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } =
        request.payload;
      const { id } = request.params;

      this._service.editSongById(id, {
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
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(error.statusCode);
      }
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);
    }
  }
  deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    this._service.deleteSongById(id);
    return h
      .response({
        status: "success",
        message: "berhasil menghapus lagu",
      })
      .code(200);
  }
}

module.exports = SongHandler;
