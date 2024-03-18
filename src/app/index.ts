import express from 'express';
import { v1 } from '@api';
import { MongoClient } from 'mongodb';

const app = express();
const client = new MongoClient(process.env.DB_CONFIG);
export const db = client.db(process.env.DB_NAME);

app.use(express.json());
app.use('/api/v1', v1);

export const run = async () => {
  try {
    await client.connect();
    app.listen(process.env.PORT, () => {
      console.log(`Start listening ${process.env.PORT} port.`);
    });
  } catch(error) {
    console.log(error);
  }
}