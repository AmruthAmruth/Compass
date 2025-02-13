import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { MongodbConnection } from './Config/database.js';

const app = express();
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server Running on the port ${PORT}`);
  MongodbConnection;
});
  
 
