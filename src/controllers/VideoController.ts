import { ApiGatewayManagementApi } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { ResponseService } from '../services/ResponseService';
import { IVideo } from "../interfaces/IVideo";
import { DatabaseService } from '../services/DatabaseService';
import { EVideoType } from '../Enum/EVideoType';
import { VideoFile } from '../models/VideoFile';
import { VideoStream } from "../models/VideoStream";
import { ETableName } from '../Enum/ETableName';
import { IAddVideoRequestBody } from '../interfaces/IRequest';
export const addVideo: APIGatewayProxyHandler = async (event, context) => {
    try {
      let video: IVideo;
      let db: DatabaseService;
      const body: IAddVideoRequestBody = JSON.parse(event.body);

      if(!body.title) {
        throw new Error("Request is missing title");
      }

      if(!body.filename) {
        throw new Error("Request is missing filename");
      }

      if(!body.type) {
        throw new Error("Request is missing type");
      }

      switch(body.type) {
        case EVideoType.FILE: 
          video = new VideoFile(body.title, body.filename);
          break;
        case EVideoType.STREAM:
          video = new VideoStream(body.title, body.filename);
          break;
        default:
          break;
      }

      if(video) {
        db = new DatabaseService(ETableName.VIDEOS);
        await db.putItem(video)
      }

      return ResponseService.success(video)

    } catch (error) {
      return ResponseService.error(error.message, error.statusCode);
    }
  };