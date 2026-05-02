const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 7363;

let swaggerDocument = YAML.load('./swagger.yaml');

const swaggerSetup = (swaggerDoc) => {
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
};

swaggerSetup(swaggerDocument);

fs.watchFile(path.join(__dirname, 'swagger.yaml'), (curr, prev) => {
  console.log('swagger.yaml file changed');
  swaggerDocument = YAML.load('./swagger.yaml');
  swaggerSetup(swaggerDocument);
});

app.listen(PORT, () => {
  console.log(`Swagger UI is running on http://localhost:${PORT}/`);
});