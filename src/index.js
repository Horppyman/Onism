import '@babel/polyfill';
import express from "express";
import dotenv from "dotenv";
import errorHandler from "errorhandler";
import routes from './routes'

dotenv.config();
const isProduction = process.env.NODE_ENV === "production";

const app = express();

if (!isProduction) {
  app.use(errorHandler());
}

app.use(routes)
const PORT = process.env.PORT || 5000;

if (!isProduction) {
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${server.address().port}`);
});
