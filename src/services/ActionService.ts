import { DatabaseService } from "./DatabaseService";
import { IWebsocketMessage } from "../interfaces/IRequest";
import { ETableName } from "../Enum/ETableName";
import { ApiGatewayManagementApi } from "aws-sdk";
import { EWSClientType } from "../Enum/EWSClientType";
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

    let device = response.Items[0];

    // If Connection ID exists then send action
    if (device) {
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
        ConnectionId: device.id
      })
      .promise()
    }
  };

  static startAudio = async (message: IWebsocketMessage, url: string) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);
    // Get Connection ID of Receiver
    if(message.client_type === EWSClientType.ADMIN || message.client_type === EWSClientType.MASTER) {
      let response = await db.scan(
        {
          client_type: message.client_type
        },
        true
      );

      let device = response.Items[0];
  
      // If Connection ID exists then send action
      if (device) {
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
          ConnectionId: device.id
        })
        .promise()
      }
    } 

  };

  static startSchedule = async (message: IWebsocketMessage, url: string) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);
    // Get Connection ID of Receiver
    if(message.client_type === EWSClientType.MASTER) {
      let response = await db.scan(
        {
          client_type: message.client_type
        },
        true
      );
      let device = response.Items[0];

      console.log('RESPONSE', response)
  
      // If Connection ID exists then send action
      if (device) {
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
          ConnectionId: device.id
        })
        .promise()
      }
    } 

  };
}
