import express from "express";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import indexRoutes from "./routes/indexRoutes.js";
import docsRoutes from "./routes/docsRoutes.js";
import { requestLogger } from "./middleware/loggerMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3333;

// --- CONFIGURAÇÃO DE CORS PARA CODESPACES ---
const allowedOrigins = ['http://localhost:3333', 'https://localhost:3333'];

// Se estiver no Codespaces, adiciona a URL pública à lista de origens permitidas
if (process.env.CODESPACE_NAME) {
  const codespaceUrl = `https://${process.env.CODESPACE_NAME}-${PORT}.app.github.dev`;
  console.log(`🔑 Permitindo origem CORS para: ${codespaceUrl}`);
  allowedOrigins.push(codespaceUrl);
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Adicionamos este log para depurar a origem da requisição
    console.log('➡️  Origem da Requisição Recebida:', origin);

    // Permite requisições sem 'origin' (ex: Postman, curl) ou se a origem estiver na lista
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pela política de CORS'));
    }
  },
};
// ----------------------------------------------
app.use(cors(corsOptions));

app.use(express.json());
app.use(requestLogger);

app.use('/', indexRoutes);
app.use("/docs", docsRoutes);
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Estocando API rodando na porta ${PORT}`);

  if (process.env.CODESPACE_NAME) {
    console.log(`📚 Documentação disponível em https://${process.env.CODESPACE_NAME}-${PORT}.app.github.dev/docs`);
  } else {
    console.log(`📚 Documentação disponível em http://localhost:${PORT}/docs`);
  }
});