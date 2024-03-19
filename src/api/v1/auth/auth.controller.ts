import { Request, Response } from "express";
import { AuthLoginRequest, User } from "./auth.types";
import { MongoClient } from "mongodb";
import { hashSync, compareSync } from 'bcryptjs';
import { READ_GLOSSARY, READ_NPC, READ_STRINGS } from "src/utils/permissions";
import { sign } from 'jsonwebtoken';
import { client } from "@app";

class AuthController {
  private client;

  constructor(client: MongoClient) {
    this.client = client;
  }

  private get collection() {
    return this.client.db().collection<User>('users');
  }

  private generateJwt (username: string, permissions: number) {
    return sign({ username, permissions }, process.env.JWT_SECRET, { expiresIn: '10d' });
  }

  private validateUser (username: string, password: string) {
    return username.length > 4 && username.length < 30 && password.length > 6 && password.length < 30;
  }

  private async hashPassword(password: string): Promise<string> {
    return new Promise((resolve) => {
      resolve(hashSync(password, 5));
    });
  }
  
  async login(request: Request<never, never, AuthLoginRequest>, response: Response) {
    try {
      const {username, password} = request.body;
      const user = await this.collection.findOne({username});

      if (!user) {
        return response.status(403).json({message: "Can't login with current username or/and password."});
      }

      const isPasswordCorrect = compareSync(password, user.password);

      if (!isPasswordCorrect) {
        return response.status(403).json({message: "Can't login with current username or/and password."});
      }

      const token = this.generateJwt(username, user.role);

      return response.status(200).json({token});
    } catch(error) {
      console.log(error);

      return response.status(500).json({message: 'Error while login.'})
    }
  }

  async registration(request: Request<never, never, User>, response: Response) {
    try {
      const {username, password} = request.body;

      if (!this.validateUser(username, password)) {
        return response.status(400).json({message: "Password or username have incorrect length."});
      }

      const isUsernameExist = !!this.collection.findOne({username});

      if (isUsernameExist) {
        return response.status(400).json({message: "Username already exist."})
      }

      const hashPassword = await this.hashPassword(password);
      const role = READ_STRINGS | READ_GLOSSARY | READ_NPC;

      await this.collection.insertOne({username, password: hashPassword, role});

      return response.status(200).json({message: 'User successfully registered.'});
    } catch(error) {
      console.log(error);

      return response.status(500).json({message: 'Error while registration.'})
    }
  }

  async getUsers(request: Request<never, never, never>, response: Response<User[] | {message: string}>) {
    try {
      const users = await this.collection.find().toArray();
      
      return response.status(200).json(users ?? []);
    } catch(error) {
      console.log(error);

      return response.status(500).json({message: 'Error while getting users list.'})
    }
  }
}

export const authController = new AuthController(client);
