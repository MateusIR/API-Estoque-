import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';

const router = Router();

const swaggerFilePath = path.resolve(process.cwd(), 'swagger.yaml');
const fileContent = fs.readFileSync(swaggerFilePath, 'utf8');
const swaggerDocument = YAML.parse(fileContent);

//-------------------------------------------------------------------------
if (process.env.CODESPACE_NAME) {
  const codespaceName = process.env.CODESPACE_NAME;
  const port = process.env.PORT || 3333;
  // Constrói a URL pública que o Codespaces cria
  const serverUrl = `https://${codespaceName}-${port}.app.github.dev`;
  
  console.log(`✅ Detectado ambiente Codespaces. Configurando URL do servidor para: ${serverUrl}`);
  
  // Substitui a URL no documento do Swagger dinamicamente
  if (swaggerDocument.servers && swaggerDocument.servers.length > 0) {
    swaggerDocument.servers[0].url = serverUrl;
    swaggerDocument.servers[0].description = "Servidor do GitHub Codespaces";
  }
}
// ------------------------------------------------------------------
const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Estocando API - Documentação",
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, options));

export default router;