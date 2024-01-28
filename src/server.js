const Hapi = require("@hapi/hapi");
require("dotenv").config();

// error handler
const ClientError = require("./exceptions/ClientError");
const NotFoundError = require("./exceptions/NotFoundError");

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
    port: 5000,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
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

  // on pre response useful for intercepting response after the function called
  // this trick use for prevent repeating line of code because a lot of casses implement this logical issue
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (
        response instanceof ClientError ||
        response instanceof NotFoundError
      ) {
        return h
          .response({
            status: "fail",
            message: response.message,
          })
          .code(response.statusCode);
      }

      if (!response.isServer) {
        return h.continue;
      }

      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami.",
        })
        .code(500);
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
