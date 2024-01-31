/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("playlist", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
  pgm.createTable("playlist_song", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
  pgm.addConstraint(
    "playlist_song",
    "unique_playlist_id_and_song_id",
    "UNIQUE(playlist_id, song_id)"
  );
  pgm.addConstraint(
    "playlist",
    "fk_playlist.owner_user.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "playlist_song",
    "fk_playlist_song.playlist_id_playlist.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "playlist_song",
    "fk_playlist_song.song_id_song.id",
    "FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("playlist");
  pgm.dropTable("playlist_song");
};
