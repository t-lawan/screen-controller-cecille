import { ApiGatewayManagementApi } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { ResponseService } from "../services/ResponseService";
import { DatabaseService } from "../services/DatabaseService";
import { Screen } from "../models/Screen";
import { IAddScreenRequestBody, IUpdateScreenRequestBody } from "../interfaces/IRequest";
import { ETableName } from "../Enum/ETableName";
import { IScreen } from "../interfaces/IScreen";

export const addScreen: APIGatewayProxyHandler = async (event, context) => {
  try {
    const body: IAddScreenRequestBody = JSON.parse(event.body);
    if (!body.local_ip_address) {
      throw new Error("Request is missing title");
    }
    if (!body.raspberry_pi_id) {
      throw new Error("Request is missing raspberry_pi_id");
    }

    if (!body.number_of_screens) {
      throw new Error("Request is missing type");
    }

    let screen: Screen = new Screen(
      body.local_ip_address,
      body.raspberry_pi_id,
      body.screen_type,
      body.number_of_screens,
      body.video_file_playlist
    );
    let db: DatabaseService;

    db = new DatabaseService(ETableName.SCREENS);
    await db.putItem(screen);
    return ResponseService.success(screen);
  } catch (error) {
    return ResponseService.error(error.message, error.statusCode);
  }
};

export const getAllScreens: APIGatewayProxyHandler = async (event, context) => {
  try {
    let screens: IScreen[] = [];
    let db: DatabaseService;
    db = new DatabaseService(ETableName.SCREENS);
    
    let response = await db.getAllItems();

    screens = response.Items;
    return ResponseService.success(screens);
  } catch (error) {
    return ResponseService.error(error.message, error.statusCode);
  }
};

export const updateScreen: APIGatewayProxyHandler = async (event, context) => {
  try {
    const body: IUpdateScreenRequestBody = JSON.parse(event.body);

    if (!body.id) {
      throw new Error("Request is missing id");
    }
    if (!body.local_ip_address) {
      throw new Error("Request is missing local_ip_address");
    }
    if (!body.raspberry_pi_id) {
      throw new Error("Request is missing raspberry_pi_id");
    }

    if (!body.number_of_screens) {
      throw new Error("Request is missing number_of_screens");
    }

    let screen: IScreen = {
      ...body
    }
    
    let db: DatabaseService;

    db = new DatabaseService(ETableName.SCREENS);
    await db.updateItem(screen.id, {
      local_ip_address: body.local_ip_address,
      raspberry_pi_id: body.raspberry_pi_id,
      screen_type: body.screen_type,
      number_of_screens: body.number_of_screens,
      video_file_playlist: body.video_file_playlist
    });
    
    return ResponseService.success(screen);
  } catch (error) {
    return ResponseService.error(error.message, error.statusCode);
  }
};

