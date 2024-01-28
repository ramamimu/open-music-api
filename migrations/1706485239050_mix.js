/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("album", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "integer",
      notNull: true,
    },
  });
  pgm.createTable("song", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "integer",
      notNull: true,
    },
    genre: {
      type: "TEXT",
      notNull: true,
    },
    performer: {
      type: "TEXT",
      notNull: true,
    },
    duration: {
      type: "integer",
      notNull: false,
    },
    albumId: {
      type: "TEXT",
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("album");
  pgm.dropTable("song");
};
