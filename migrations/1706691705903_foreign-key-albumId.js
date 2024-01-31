/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    "song",
    "fk_song.albumId_album.id",
    "FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("album", "fk_song.album_id_album.id");
};
