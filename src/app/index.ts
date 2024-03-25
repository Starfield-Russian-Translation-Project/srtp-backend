"use strict";

import express from 'express';
import { v1 } from '@api';
import { MongoClient } from 'mongodb';

const app = express();
export const client = new MongoClient(process.env.DB_CONFIG);

app.use(express.json());
app.use('/api/v1', v1);

export const run = async () => {
  try {
    app.listen(process.env.PORT, async () => {
      console.log(`Start listening ${process.env.PORT} port.`);

      await client.connect();
      await client.db(process.env.DB_NAME);
    });
  } catch(error) {
    console.log(error);
  }
}