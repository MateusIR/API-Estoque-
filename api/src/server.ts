import express from "express";
import cors from "cors";
import itemRoutes from "./routes/itemRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import indexRoutes from "./routes/indexRoutes.js";
import docsRoutes from "./routes/docsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { requestLogger } from "./middleware/loggerMiddleware.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3333;

// --- CONFIGURAÇÃO DE CORS PARA CODESPACES ---
// No server.ts
// --- CONFIGURAÇÃO DE CORS ---
const allowedOrigins = [
  'http://localhost:3333', 
  'http://localhost:5173', // Vite
  'http://localhost:3000', // React CRA
  'https://projeto-estoque-nine.vercel.app' // URL de produção fixa
];

// Se estiver no Codespaces
if (process.env.CODESPACE_NAME) {
  const codespaceUrl = `https://${process.env.CODESPACE_NAME}-${PORT}.app.github.dev`;
  allowedOrigins.push(codespaceUrl);
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // 1. LOG PARA DEBUG (Olhe nos logs da Vercel/Terminal para ver qual URL está chegando)
    if (origin) {
        console.log('🔍 Origem recebida:', origin);
    }

    // 2. Lógica de Verificação
    const isAllowed = 
        !origin || // Permite requisições back-to-back (sem origin, ex: Postman, mobile app)
        allowedOrigins.includes(origin) || // Está na lista exata
        origin.endsWith('.vercel.app') || // Permite qualquer preview da Vercel
        origin.endsWith('.app.github.dev'); // Permite Codespaces dinamicamente

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`❌ Bloqueado pelo CORS: ${origin}`); // Log do erro específico
      callback(new Error(`Não permitido pela política de CORS. Origem: ${origin}`));
    }
  },
  credentials: true // Importante se você estiver usando cookies/sessões
};

app.use(cors(corsOptions));
// ------------------------------

app.use(express.json());
app.use(requestLogger);

app.use('/', indexRoutes);
app.use("/docs", docsRoutes);
app.use("/users", userRoutes);
app.use("/items", itemRoutes);
app.use("/reports", reportRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Estocando API rodando na porta ${PORT}`);

  if (process.env.CODESPACE_NAME) {
    console.log(`📚 Documentação disponível em https://${process.env.CODESPACE_NAME}-${PORT}.app.github.dev/docs`);
  } else {
    console.log(`📚 Documentação disponível em http://localhost:${PORT}/docs`);
  }
});