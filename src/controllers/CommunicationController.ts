import { APIGatewayProxyHandler } from "aws-lambda";
import { ResponseService } from "../services/ResponseService";
import { ApiGatewayManagementApi } from "aws-sdk";
import { DatabaseService } from "../services/DatabaseService";
import { ETableName } from "../Enum/ETableName";
import { IWebsocketMessage } from "../interfaces/IRequest";
import { EWSMessageType } from "../Enum/EWSMessageType";
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

    // Save raspberry pi id in Communication table if MESSSaGE = INITIALISE
    if (body.message === EWSMessageType.INITIALISE) {
      await db.updateItem(connectionId, {
        raspberry_pi_id: body.raspberry_pi_id,
        client_type: body.client_type
      });
    }

    // IF MESSAGE IS START STREAM OR STOP STREAM
    if (
      body.message === EWSMessageType.START_STREAM ||
      body.message === EWSMessageType.STOP_STREAM
    ) {
      const apigatewaymanagementapi = new ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: url
      });

      let payload = {
        message: body.message,
        success: true
      };
      await apigatewaymanagementapi
        .postToConnection({
          Data: JSON.stringify(payload),
          ConnectionId: connectionId
        })
        .promise()
        .then(data => {
          return ResponseService.success("success");
        })
        .catch(error => {
          console.log("error", error);
          return ResponseService.success("error");
        });
    }
    // Send response to client

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
