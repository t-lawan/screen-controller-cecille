import { APIGatewayProxyHandler } from "aws-lambda";
import { ResponseService } from "../services/ResponseService";
import { DatabaseService } from "../services/DatabaseService";
import { ETableName } from "../Enum/ETableName";
import { IAudio } from "../interfaces/IAudio";
import {  IAddAudioRequestBody } from '../interfaces/IRequest';
import validator from "validator";
import { Audio } from '../models/Audio';

export const addAudio: APIGatewayProxyHandler = async (event, context) => {
  try {
    let db: DatabaseService;
    const body: IAddAudioRequestBody = JSON.parse(event.body);
    if (!validator.isAscii(body.title)) {
      throw new Error("Request is missing title");
    }

    if (!validator.isAscii(body.uri)) {
      throw new Error("Request is missing uri");
    }

    let audio: IAudio = new Audio(body.title, body.uri)


    if (audio) {
      db = new DatabaseService(ETableName.AUDIO);
      await db.putItem(audio);
    }

    return ResponseService.success(audio);
  } catch (error) {
    return ResponseService.error(error.message, error.statusCode);
  }
};

export const getAllAudio: APIGatewayProxyHandler = async (event, context) => {
    try {
      let audio: IAudio[] = [];
      let db: DatabaseService;
  
      db = new DatabaseService(ETableName.AUDIO);
      let response = await db.getAllItems();
      audio = response.Items;
      return ResponseService.success(audio);
    } catch (error) {
      return ResponseService.error(error.message, error.statusCode);
    }
  };

  export const updateAudio: APIGatewayProxyHandler = async (event, context) => {
    try {
      const body: IAudio = JSON.parse(event.body);
  
      if (!body.id) {
        throw new Error("Request is missing id");
      }
      if (!body.title) {
        throw new Error("Request is missing title");
      }
  
      if (!body.uri) {
        throw new Error("Request is missing uri");
      }
  
      let db: DatabaseService;
  
      db = new DatabaseService(ETableName.AUDIO);
      await db.updateItem(body.id, {
        uri: body.uri,
        title: body.title
      });
  
      return ResponseService.success(body);
    } catch (error) {
      return ResponseService.error(error.message, error.statusCode);
    }
  };
