const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumHandler {
  constructor({ service, storageService, validator }) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    return h
      .response({
        status: "success",
        data: {
          albumId,
        },
      })
      .code(201);
  }
  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return h
      .response({
        status: "success",
        data: {
          album,
        },
      })
      .code(200);
  }
  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;

    await this._service.verifyAlbumById(id);
    await this._service.editAlbumById(id, { name, year });

    return h
      .response({
        status: "success",
        message: "success to edit note",
      })
      .code(200);
  }
  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return h
      .response({
        status: "success",
        message: "success to delete album",
      })
      .code(200);
  }
  async postAlbumCoversByIdHandler(request, h) {
    const { cover: data } = request.payload;
    this._validator.validateImageCoversPayload(data.hapi.headers);

    const { id: albumId } = request.params;

    await this._storageService
      .writeFile(data, data.hapi.filename)
      .then(async (filename) => {
        await this._service.editCoverAlbumById(
          albumId,
          `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
        );
      })
      .catch((error) => {
        if (error instanceof NotFoundError) throw error;
        throw new Error("Gagal Membaca File");
      });
    return h
      .response({
        status: "success",
        message: "Sampul berhasil diunggah",
      })
      .code(201);
  }

  async postAlbumLikesByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._service.verifyAlbumById(albumId);
    await this._service.verifyAlbumHasLikedByUserId(albumId, credentialId);
    await this._service.addAlbumLikesById(albumId, credentialId);
    return h
      .response({
        status: "success",
        message: "Album berhasil disukai",
      })
      .code(201);
  }
  async deleteAlbumLikesByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._service.deleteAlbumLikesById(albumId, credentialId);
    return h
      .response({
        status: "success",
        message: "Album yang disukai berhasil dibatalkan",
      })
      .code(200);
  }
  async getAlbumLikesByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, isRedis } = await this._service.getAlbumLikesById(albumId);

    return h
      .response({
        status: "success",
        data: {
          likes: parseInt(likes),
        },
      })
      .header("X-Data-Source", `${isRedis ? "cache" : "no-cache"}`)
      .code(200);
  }
}

module.exports = AlbumHandler;
