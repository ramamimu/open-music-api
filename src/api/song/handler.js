const ClientError = require("../../exceptions/ClientError");
const NotFoundError = require("../../exceptions/NotFoundError");

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

  async postSongHandler(request, h) {
    try {
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
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return h
        .response({
          status: "success",
          data: { song },
        })
        .code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
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
  async putSongByIdHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError || error instanceof NotFoundError) {
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
  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return h
        .response({
          status: "success",
          message: "berhasil menghapus lagu",
        })
        .code(200);
    } catch (error) {
      if (error instanceof NotFoundError) {
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
}

module.exports = SongHandler;
