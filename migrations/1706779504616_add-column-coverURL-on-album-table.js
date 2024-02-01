/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql("ALTER TABLE album ADD COLUMN cover_url VARCHAR(200)");
};

exports.down = (pgm) => {
  pgm.sql("ALTER TABLE album DROP COLUMN cover_url");
};
