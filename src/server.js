require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

// middleware
const ErrorManager = require("./middleware/onPreResponse/ErrorManager");

// album
const album = require("./api/album");
const AlbumService = require("./services/postgres/AlbumService");
const AlbumValidator = require("./validators/album");

// song
const song = require("./api/song");
const SongService = require("./services/postgres/SongService");
const SongValidator = require("./validators/song");

// user
const user = require("./api/user");
const UserService = require("./services/postgres/UserService");
const UserValidator = require("./validators/user");

// authentication
const authentication = require("./api/authentication");
const AuthenticationService = require("./services/postgres/AuthenticationService");
const AuthenticationValidator = require("./validators/authentication");
const TokenManager = require("./tokenize/TokenManager");

// playlist
const playlist = require("./api/playlist");
const PlaylistService = require("./services/postgres/PlaylistService");
const PlaylistValidator = require("./validators/playlist");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy("musicapp_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authenticationService = new AuthenticationService();
  const playlistService = new PlaylistService();

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
    {
      plugin: user,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentication,
      options: {
        authenticationService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        playlistService,
        songService,
        validator: PlaylistValidator,
      },
    },
  ]);

  // on pre response useful for intercepting response after the function called
  // this trick use for prevent repeating line of code because a lot of casses implement this logical issue
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      return ErrorManager(response, h);
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
