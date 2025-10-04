import express from "express";
import itemRoutes from "./routes/itemRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { requestLogger } from "./middleware/loggerMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(requestLogger);

app.use("/users", userRoutes);

app.use("/items", itemRoutes);
app.use("/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Estocando API rodando na porta ${PORT}`);
});
