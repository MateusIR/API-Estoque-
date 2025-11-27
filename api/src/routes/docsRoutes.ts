import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';

const router = Router();

const filePath = path.join(process.cwd(), "swagger.yaml");

const swaggerFile = fs.readFileSync(filePath, "utf8");

const swaggerDocument = YAML.parse(swaggerFile);

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Estocando API - Documentação",
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, options));

export default router;
