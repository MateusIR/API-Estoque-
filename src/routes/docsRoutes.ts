// Arquivo: src/routes/docsRoutes.ts

import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';

const router = Router();

// Encontra o caminho absoluto para o arquivo swagger.yaml na raiz do projeto
const swaggerFilePath = path.resolve(process.cwd(), 'swagger.yaml');

// Lê o conteúdo do arquivo
const fileContent = fs.readFileSync(swaggerFilePath, 'utf8');

// Faz o parse do conteúdo YAML para um objeto JavaScript
const swaggerDocument = YAML.parse(fileContent);


const options = {
  customCss: '.swagger-ui .topbar { display: none }', 
  customSiteTitle: "Estocando API - Documentação",
};


router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, options));

export default router;