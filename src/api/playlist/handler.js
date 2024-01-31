class PlaylistsHandler {
  constructor({ playlistService, songService, validator }) {
    this._playlistService = playlistService;
    this._songService = songService;
    this._validator = validator;
  }
  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { name } = request.payload;
    const playlistId = await this._playlistService.addPlaylist(
      name,
      credentialId
    );

    return h
      .response({
        status: "success",
        data: {
          playlistId,
        },
      })
      .code(201);
  }
  async getPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistService.getPlaylist(credentialId);
    return h
      .response({
        status: "success",
        data: { playlists },
      })
      .code(200);
  }
  async deletePlaylistByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistService.deletePlaylistById(playlistId, credentialId);

    return h
      .response({
        status: "success",
        message: "Berhasil menghapus playlist",
      })
      .code(200);
  }
  async postPlaylistSongsByIdHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;

    await this._songService.verifySongId(songId);
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistService.addPlaylistSongsById(playlistId, songId);
    return h
      .response({
        status: "success",
        message: "berhasil menambahkan musik ke playlist",
      })
      .code(201);
  }
  async getPlaylistSongsByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const playlistSongs = await this._playlistService.getPlaylistSongsById(
      playlistId
    );

    return h.response({
      status: "success",
      data: playlistSongs,
    });
  }
  async deletePlaylistSongsByIdHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistService.deletePlaylistSongsById(playlistId, songId);

    return h
      .response({
        status: "success",
        message: "Berhasil menghapus lagu pada playlist",
      })
      .code(200);
  }
}

module.exports = PlaylistsHandler;
