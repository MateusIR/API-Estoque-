import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const swaggerDocument = require('../../swagger.json');

const router = Router();

const options = {
  customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css',
  customJs: [
    'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js',
    'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js'
  ],
  customSiteTitle: "Estocando API - Documentação",
  customCss: '.swagger-ui .topbar { display: none }' 
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, options));

export default router;