import express from "express";
import { products } from "./v1/routes/products";
const PORT = process.env.PORT || 8080;
const app = express();
app.use("/api/products", products);
app.use(express.json());
app.use(express.static("./src/public"));
app.get("/", (_req, res) => {
  res.send("Servidor Conectado");
});
app.listen(PORT, () => console.log(`Conectado en el puerto ${PORT}`));
