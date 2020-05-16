import { ApiGatewayManagementApi } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { ResponseService } from "../services/ResponseService";
import { IVideo } from "../interfaces/IVideo";
import { DatabaseService } from "../services/DatabaseService";
import { EVideoType } from '../Enum/EVideoType';
import { VideoFile } from "../models/VideoFile";
import { VideoStream } from "../models/VideoStream";
import { ETableName } from "../Enum/ETableName";
import {
  IAddVideoRequestBody,
  IUpdateVideoRequestBody
} from "../interfaces/IRequest";
import validator from "validator";

export const addVideo: APIGatewayProxyHandler = async (event, context) => {
  try {
    let video: IVideo;
    let db: DatabaseService;
    const body: IAddVideoRequestBody = JSON.parse(event.body);
    if (!validator.isAscii(body.title)) {
      throw new Error("Request is missing title");
    }

    if (!validator.isAscii(body.uri)) {
      throw new Error("Request is missing uri");
    }

    if (!body.type) {
      throw new Error("Request is missing type");
    }

    switch (body.type) {
      case EVideoType.FILE:
        video = new VideoFile(body.title, body.uri);
        break;
      case EVideoType.STREAM:
        video = new VideoStream(body.title, body.uri);
        break;
      default:
        break;
    }

    if (video) {
      db = new DatabaseService(ETableName.VIDEOS);
      await db.putItem(video);
    }

    return ResponseService.success(video);
  } catch (error) {
    return ResponseService.error(error.message, error.statusCode);
  }
};

export const getAllVideos: APIGatewayProxyHandler = async (event, context) => {
  try {
    let videos: IVideo[] = [];
    let db: DatabaseService;

    db = new DatabaseService(ETableName.VIDEOS);
    let response = await db.getAllItems();
    videos = response.Items;
    return ResponseService.success(videos);
  } catch (error) {
    return ResponseService.error(error.message, error.statusCode);
  }
};

export const updateVideo: APIGatewayProxyHandler = async (event, context) => {
  try {
    const body: IUpdateVideoRequestBody = JSON.parse(event.body);
    if (!body.id) {
      throw new Error("Request is missing id");
    }
    if (!body.title) {
      throw new Error("Request is missing title");
    }

    if (!body.uri) {
      throw new Error("Request is missing uri");
    }

    if (!body.type) {
      throw new Error("Request is missing type");
    }

    let video: IVideo;

    video = {
      id: body.id,
      uri: body.uri,
      title: body.title,
      type: body.type
    };

    let db: DatabaseService;

    db = new DatabaseService(ETableName.VIDEOS);
    await db.updateItem(video.id, {
      uri: video.uri,
      type: video.type,
      title: video.title
    });

    return ResponseService.success(video);
  } catch (error) {
    return ResponseService.error(error.message, error.statusCode);
  }
};

export const deleteVideo: APIGatewayProxyHandler = async (event, context) => {
  try {
    const body: IUpdateVideoRequestBody = JSON.parse(event.body);
    if (!body.id) {
      throw new Error("Request is missing id");
    }
    if (!body.title) {
      throw new Error("Request is missing title");
    }

    if (!body.uri) {
      throw new Error("Request is missing uri");
    }

    if (!body.type) {
      throw new Error("Request is missing type");
    }

    let db: DatabaseService;

    db = new DatabaseService(ETableName.VIDEOS);
    await db.deleteItem(body.id);
    return ResponseService.success(`${body.title} successfully deleted`);
  } catch (error) {
    return ResponseService.error(error.message, error.statusCode);
  }
};
