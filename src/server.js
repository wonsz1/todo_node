import dotenv from 'dotenv';
import express from 'express';
import commands from './routes/commands.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/', commands);
app.listen(port);
