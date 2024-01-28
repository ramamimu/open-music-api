const Hapi = require("@hapi/hapi");

// album
const album = require("./api/album");
const AlbumService = require("./services/noDb/AlbumService");
const AlbumValidator = require("./validators/album");

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

  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
