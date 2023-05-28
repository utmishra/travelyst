import express from "express";
import mainRoutes from "./endpoints/main.js";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import ejsLayouts from "express-ejs-layouts";
const upload = multer();

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.use(ejsLayouts);

app.use("/dist", express.static("dist"));
app.set("views", "views");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(upload.array());

const setRefererHeader = (req, res, next) => {
  req.headers.referer = process.env.HTTP_REFERER;
  next();
};

app.use(setRefererHeader);

app.use("/", mainRoutes);

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));
