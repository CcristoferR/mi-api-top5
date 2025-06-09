// app.js
require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 1) Conexión a MongoDB Atlas (base Top5DB)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a Mongo Atlas – Top5DB"))
  .catch(err => {
    console.error("❌ Error al conectar a Mongo Atlas:", err.message);
    process.exit(1);
  });

// 2) Esquema y modelo para top5_chile
const Top5Schema = new mongoose.Schema({
  rango:         { type: Number, required: true },
  idioma:        { type: String, required: true },
  participación: { type: Number, required: true }
});
const Top5Chile = mongoose.model("Top5Chile", Top5Schema, "top5_chile");

// 3) Ruta raíz: devuelve el Top 5 Chile
app.get("/", async (req, res) => {
  try {
    const items = await Top5Chile.find().sort({ rango: 1 });
    if (items.length === 0) {
      return res.status(404).json({ message: "No hay datos en top5_chile." });
    }
    return res.json(items);
  } catch(err) {
    return res.status(500).json({ error: "Error al leer datos Chile" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
});
