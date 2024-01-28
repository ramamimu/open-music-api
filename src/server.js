const Hapi = require("@hapi/hapi");
require("dotenv").config();

// album
const album = require("./api/album");
const AlbumService = require("./services/postgres/AlbumService");
const AlbumValidator = require("./validators/album");

// song
const song = require("./api/song");
const SongService = require("./services/postgres/SongService");
const SongValidator = require("./validators/song");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== "production" ? process.env.HOST : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const albumService = new AlbumService();
  const songService = new SongService();

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
