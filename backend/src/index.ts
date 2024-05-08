import express from 'express';
import 'dotenv/config';
import { connect } from 'mongoose';
import { v1Router } from './v1Router.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { environment } from './utils/env.js';
import { MongoClient } from 'mongodb';
import { unknownRoute } from './middleware/unknownRouteMiddleware.js';
import { initializeMinio } from './minio/initializeMinio.js';
import { runMigrations } from './utils/migrations.js';

declare module 'express-session' {
  interface SessionData {
    username: string;
    admin: boolean;
  }
}

console.log(`Starting up laurilat-backend in ${environment.NODE_ENV}`);

const app = express();
const port = 8000;

const addMiddleWare = (client: MongoClient) => {
  app.disable('x-powered-by');
  app.use(
    session({
      secret: environment.SESSION_KEY,
      store: MongoStore.create({ client, collectionName: 'sessions' }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: environment.NODE_ENV === 'development' ? false : true,
        maxAge: 1000 * 60 * 60 * 8,
      },
      name: environment.COOKIE_NAME,
    })
  );
  app.use('/api/v1', v1Router);
  app.use(unknownRoute);
};

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

console.log(`Connecting to MongoDB in ${environment.DB_URL}`);

connect(`mongodb://${environment.DB_USERNAME}:${environment.DB_PASSWORD}@${environment.DB_URL}`)
  .then((mongoose) => {
    console.log(`Mongoose connected to ${environment.DB_URL}`);
    runMigrations();
    addMiddleWare(mongoose.connection.getClient());
  })
  .catch((err) => {
    console.error(err);
  });

initializeMinio();

for (const signal of ['SIGTERM', 'SIGINT'])
  process.on(signal, () => {
    console.info(`${signal} signal received.`);
    console.log('Closing http server.');
    server.close((err) => {
      console.log('Http server closed.');
      process.exit(err ? 1 : 0);
    });
  });
