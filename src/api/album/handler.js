class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    const { name, year } = request.payload;
    const albumId = this._service.addAlbum({ name, year });

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
    const album = this._service.getAlbumById(id);

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
    const { id } = request.params;
    const { name, year } = request.payload;

    this._service.editAlbumById(id, { name, year });

    return h
      .response({
        status: "success",
        message: "success to edit note",
      })
      .code(200);
  }
  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    this._service.deleteAlbumById(id);

    return h
      .response({
        status: "success",
        message: "success to delete album",
      })
      .code(200);
  }
}

module.exports = AlbumHandler;
