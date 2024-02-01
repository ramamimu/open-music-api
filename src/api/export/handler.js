const QueueName = require("../../types/QueueName");

class ExportPlaylists {
  constructor({ producerService, playlistService, validator }) {
    this._producerService = producerService;
    this._playlistService = playlistService;
    this._validator = validator;
  }

  async postExportPlaylistsByIdHandler(request, h) {
    this._validator.validateExportNotesPayload(request.payload);
    const { targetEmail } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const message = {
      playlistId,
      targetEmail,
    };

    await this._producerService.sendMessage(
      QueueName.ExportPlaylist,
      JSON.stringify(message)
    );
    return h
      .response({
        status: "success",
        message: "permintaan Anda sedang kami proses",
      })
      .code(201);
  }
}

module.exports = ExportPlaylists;
