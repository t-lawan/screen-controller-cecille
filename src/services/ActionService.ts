import { DatabaseService } from "./DatabaseService";
import { IWebsocketMessage } from "../interfaces/IRequest";
import { ETableName } from "../Enum/ETableName";
import { ApiGatewayManagementApi } from "aws-sdk";
export class ActionService {
    // Save raspberry pi id in Communication table if MESSSaGE = INITIALISE

  static initialise = async (
    connectionId: string,
    message: IWebsocketMessage
  ) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);
    await db.updateItem(connectionId, {
      raspberry_pi_id: message.raspberry_pi_id,
      client_type: message.client_type
    });
  };

  static sendGeneric = async (message: IWebsocketMessage, url: string) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);
    // Get Connection ID of Receiver
    let response = await db.scan(
      {
        raspberry_pi_id: message.raspberry_pi_id
      },
      true
    );

    // If Connection ID exists then send action
    if (response) {
      const apigatewaymanagementapi = new ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: url
      });

      let payload = {
        message: message.message,
        success: true
      };

      await apigatewaymanagementapi
      .postToConnection({
        Data: JSON.stringify(payload),
        ConnectionId: response
      })
      .promise()
    }
  };
}
