import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { MongodbConnection } from './Config/database.js';
import path from "path";
import { fileURLToPath } from "url";
import Router from './Routes/AuthRoute.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'Public')));

app.use('/',Router)


const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server Running on the port ${PORT}`);
  MongodbConnection;
});
  
 
