import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json' with { type: "json" };

const router = Router();

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Estocando API - Documentação",
};

// Configuração padrão do Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, options));

export default router;