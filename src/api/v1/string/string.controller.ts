import {Request, Response} from 'express';
import { TranslationString } from './string.types';
import { client } from '@app';

class StringController {
  constructor() {
    this.createOne = this.createOne.bind(this);
    this.createMany = this.createMany.bind(this);
    this.getOne = this.getOne.bind(this);
    this.getMany = this.getMany.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.deleteMany = this.deleteMany.bind(this);
  }

  get #collection() {
    return client.db().collection<TranslationString>('strings');
  }

  #validateString(str: Partial<TranslationString>): boolean {
    return !!str?.edid || !!str?.stringId || !!str?.source;
  }

  async createOne(request: Request<never, TranslationString>, response: Response) {
    try {
      if (!this.#validateString(request.body)) {
        return response.status(400).send('Incorrect string data format');
      }

      const duplicateString = await this.#collection.findOne({
        edid: request.body.edid, 
        stringId: request.body.stringId
      });

      if (duplicateString !== null) {
        return response.status(400).send('String is already exist.');
      }

      const dbElement = await this.#collection.insertOne(request.body);

      return response.status(200).send(dbElement.insertedId);
    } catch(error) {
      console.log(error);

      return response.status(500).send('Error with creating new string.');
    }
  }

  async createMany(request: Request, response: Response) {
    return response.status(501).send('Not available yet.')
  }

  async getOne(request: Request<never, never, never, {id: string}>, response: Response) {
    try {
      const requiredString = await this.#collection.findOne({id: request.query.id});

      return response.status(200).json(requiredString);
    } catch(error) {
      console.log(error);

      return response.status(500).send('Error with getting string.')
    }
  }

  async getMany() {

  }

  async deleteOne(request: Request, response: Response) {
    try {

    } catch(error) {
      console.log(error);

      return response.status(500).send('Error with deleting string.')
    }
  }

  async deleteMany(request: Request, response: Response) {
    return response.status(501).send('Not available yet.')
  }
}

export const stringController = new StringController();
