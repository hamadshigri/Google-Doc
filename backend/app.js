import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import documentRoutes from "./routes/document.route.js";
import userRoutes from "./routes/user.route.js";
import { verifyAuthentication } from "./middlewares/auth.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
connectDB();

app.use("/", userRoutes);
app.use(verifyAuthentication);
app.use("/document", documentRoutes);

app.get("/", (req, res) => {
  res.send("homepage");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
