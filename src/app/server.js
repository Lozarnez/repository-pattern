const appRouter = require('./router/app.router');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const process = require('process');
const {
  responseHandler,
  errorLogger,
  errorHandler,
  errorRoute,
} = require('./middleware');
const { MongoConnection, MySQLConnection } = require('@db/connection');
const { systemLogger, loggerDb } = require('@lib');

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());

app.use(responseHandler); // Middleware para manejar las respuestas de la API
appRouter('/api/v2', app); // Método para manejar las rutas de la API
app.use(errorLogger); // Middleware para hacer log de errores
app.use(errorHandler); // Middleware para manejar errores y enviar una respuesta al cliente
app.use(errorRoute); // Middleware para manejar rutas no encontradas

function runServer() {
  const port = process.env.PORT || 3000;
  app.listen(port, async () => {
    try {
      await MySQLConnection('mysql');
      await MongoConnection('mongodb');
      systemLogger.info(`Server running on port ${port}`);
    } catch (error) {
      systemLogger.error('Error starting server:', error);
      loggerDb({
        messageString: 'Error starting server',
        additionalInfo: {
          error,
        },
      });
    }
  });
}

module.exports = runServer;
