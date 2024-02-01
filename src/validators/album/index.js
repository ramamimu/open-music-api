const InvariantError = require("../../exceptions/InvariantError");
const { AlbumPayloadSchema, ImageCoversSchema } = require("./schema");

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateImageCoversPayload: (payload) => {
    const validationResult = ImageCoversSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
