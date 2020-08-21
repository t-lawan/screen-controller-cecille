import { APIGatewayProxyHandler } from "aws-lambda";
import { ResponseService } from "../services/ResponseService";
import { ApiGatewayManagementApi } from "aws-sdk";
import { DatabaseService } from "../services/DatabaseService";
import { ETableName } from "../Enum/ETableName";
import { IWebsocketMessage } from "../interfaces/IRequest";
import { EWSMessageType } from "../Enum/EWSMessageType";
import { ActionService } from '../services/ActionService';
export const connectSocket: APIGatewayProxyHandler = async (event, context) => {
  const connectionId = event.requestContext.connectionId;
  const stage = event.requestContext.stage;
  const domain = event.requestContext.domainName;

  let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);
  let item = {
    id: connectionId
  };
  await db.putItem(item);

  let url = `https://${domain}/${stage}`;
  let payload;

  const apigatewaymanagementapi = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: url
  });

  payload = {
    success: true
  };

  await apigatewaymanagementapi
    .postToConnection({
      Data: JSON.stringify(payload),
      ConnectionId: connectionId
    })
    .promise()
    .then(data => {
      console.log("data", data);
      return ResponseService.success("success");
    })
    .catch(error => {
      console.log("error", error);
      return ResponseService.error(error.message, 200);
    });

  return ResponseService.success("success");
};

export const messageSocket: APIGatewayProxyHandler = async (event, context) => {
  // Assign values
  const connectionId = event.requestContext.connectionId;
  const stage = event.requestContext.stage;
  const domain = event.requestContext.domainName;
  let url = `https://${domain}/${stage}`;
  // url = `http://localhost:3001`;

  try {
    const body: IWebsocketMessage = JSON.parse(event.body);

    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);


    switch(body.message) {
      case EWSMessageType.INITIALISE:
        await ActionService.initialise(connectionId, body);
        break;
      case EWSMessageType.START_STREAM:
        await ActionService.sendGeneric(body, url);
        break;
      case EWSMessageType.STOP_STREAM:
        await ActionService.sendGeneric(body, url);
        break;      
      case EWSMessageType.START_PLAYLIST:
        await ActionService.sendGeneric(body, url);
        break;
      case EWSMessageType.STOP_PLAYLIST:
        await ActionService.sendGeneric(body, url);
        break;
      case EWSMessageType.START_AUDIO:
        await ActionService.sendToMasterOrAdmin(body, url);
        break;
      case EWSMessageType.START_VIDEO:
        await ActionService.startVideo(body, url);
        break;
      case EWSMessageType.START_SCHEDULE:
        await ActionService.sendToMasterOrAdmin(body, url);
        break;
      case EWSMessageType.STOP_SCHEDULE:
        await ActionService.sendToMasterOrAdmin(body, url);
        break;
      default:
        console.log('DEFAULT')
        break;

    }

    return ResponseService.success("success");
  } catch (error) {
    console.log("error", error);
    let payload = {
      success: false
    };

    const apigatewaymanagementapi = new ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: url
    });

    await apigatewaymanagementapi.postToConnection({
      Data: JSON.stringify(payload),
      ConnectionId: connectionId
    });
    return ResponseService.error(error.message, error.statusCode);
  }
};

export const disconnectSocket: APIGatewayProxyHandler = async (
  event,
  context
) => {
  try {
    const connectionId = event.requestContext.connectionId;

    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);
    await db
      .deleteItem(connectionId)
      .then(() => {
        console.log("deleted successfully");
      })
      .catch(error => {
        console.log("error", error);
      });

    return ResponseService.success("success");
  } catch (error) {
    return ResponseService.error(error.message, error.statusCode);
  }
};
