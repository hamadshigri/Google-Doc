import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import documentRoutes from "./routes/document.route.js";
import userRoutes from "./routes/user.route.js";
import documentShareRoutes from "./routes/documentShare.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Vercel may start handling requests before MongoDB is connected. Wait here so
// database queries do not sit in Mongoose's buffer and time out later.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({
      success: false,
      message: "Database is unavailable",
    });
  }
});

app.use("/", userRoutes);
app.use("/document", documentRoutes);
app.use("/document", documentShareRoutes);

app.get("/", (req, res) => {
  res.send("homepage");
});

// Vercel imports the Express app as a serverless function. Keep a listener for
// local development only.
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
}

export default app;
