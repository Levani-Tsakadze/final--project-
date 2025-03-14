const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors({ origin: "http://45.143.108.110:5173", credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running at http://45.143.108.110:${PORT}`));
