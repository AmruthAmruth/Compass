import dotenv from 'dotenv';
dotenv.config();
import './Config/passport.js'
import express from 'express';
import { MongodbConnection } from './Config/database.js';
import path from "path";
import { fileURLToPath } from "url";
import Router from './Routes/AuthRoute.js';
import session from 'express-session'
import passport from 'passport';
const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize());
app.use(passport.session());



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
  
 
