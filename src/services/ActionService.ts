import { DatabaseService } from "./DatabaseService";
import { IWebsocketMessage } from "../interfaces/IRequest";
import { ETableName } from "../Enum/ETableName";
import { ApiGatewayManagementApi } from "aws-sdk";
import { EWSClientType } from "../Enum/EWSClientType";
import { EWSMessageType } from "../Enum/EWSMessageType";
export class ActionService {
  // Save raspberry pi id in Communication table if MESSSaGE = INITIALISE

  static initialise = async (
    connectionId: string,
    message: IWebsocketMessage,
    url: string
  ) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);
    await db.updateItem(connectionId, {
      raspberry_pi_id: message.raspberry_pi_id,
      client_type: message.client_type
    });

    // if (message.client_type === EWSClientType.DISPLAY) {
    //   const apigatewaymanagementapi = new ApiGatewayManagementApi({
    //     apiVersion: "2018-11-29",
    //     endpoint: url
    //   });

    //   let data: IWebsocketMessage = {
    //     message: EWSMessageType.START_VIDEO,
    //     payload: null,
    //     client_type: message.client_type,
    //     raspberry_pi_id: message.raspberry_pi_id
    //   };

    //   await apigatewaymanagementapi
    //     .postToConnection({
    //       Data: JSON.stringify(data),
    //       ConnectionId: connectionId
    //     })
    //     .promise();
    // }
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

      let data: IWebsocketMessage = {
        message: message.message,
        payload: message.payload ? message.payload : null,
        client_type: message.client_type
      };

      await apigatewaymanagementapi
        .postToConnection({
          Data: JSON.stringify(data),
          ConnectionId: device.id
        })
        .promise();
    }
  };

  static sendToMasterAndAdmin = async (
    message: IWebsocketMessage,
    url: string
  ) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);
    // Get Connection ID of Receiver

    let response = await db.scan(
      {
        client_type: EWSClientType.MASTER
      },
      true
    );
    const apigatewaymanagementapi = new ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: url
    });
    let data: IWebsocketMessage = {
      message: message.message,
      payload: message.payload ? message.payload : null,
      client_type: message.client_type
    };

    let masterDevice = response.Items[0];

    // If Connection ID exists then send action
    if (masterDevice) {
      await apigatewaymanagementapi
        .postToConnection({
          Data: JSON.stringify(data),
          ConnectionId: masterDevice.id
        })
        .promise();
    }

    let adminQueryResponse = await db.scan(
      {
        client_type: EWSClientType.ADMIN
      },
      true
    );

    let adminDevices = adminQueryResponse.Items;
    // If logged in then send info
    if (adminDevices.length > 0) {
      adminDevices.forEach(async adminDevice => {
        await apigatewaymanagementapi
          .postToConnection({
            Data: JSON.stringify(data),
            ConnectionId: adminDevice.id
          })
          .promise();
      });
    }
  };

  static sendToMaster = async (message: IWebsocketMessage, url: string) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);
    // Get Connection ID of Receiver
    if (message.client_type === EWSClientType.MASTER) {
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

        let data: IWebsocketMessage = {
          message: message.message,
          payload: message.payload ? message.payload : null,
          client_type: message.client_type
        };

        await apigatewaymanagementapi
          .postToConnection({
            Data: JSON.stringify(data),
            ConnectionId: device.id
          })
          .promise();
      }
    }
  };

  static startVideo = async (message: IWebsocketMessage, url: string) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);

    if (message.raspberry_pi_id) {
      // Get Raspberry PI Device details
      let response = await db.scan(
        {
          raspberry_pi_id: message.raspberry_pi_id
        },
        true
      );

      let data: IWebsocketMessage = {
        message: message.message,
        payload: message.payload ? message.payload : null,
        client_type: message.client_type,
        raspberry_pi_id: message.raspberry_pi_id
      };

      let device = response.Items[0];
      const apigatewaymanagementapi = new ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: url
      });
      // If Device is logged in then send action
      if (device) {
        await apigatewaymanagementapi
          .postToConnection({
            Data: JSON.stringify(data),
            ConnectionId: device.id
          })
          .promise();
        // Check if Admin site is logged in
      }

      let adminQueryResponse = await db.scan(
        {
          client_type: EWSClientType.ADMIN
        },
        true
      );

      let adminDevices = adminQueryResponse.Items;
      // If logged in then send info
      if (adminDevices.length > 0) {
        adminDevices.forEach(async adminDevice => {
          await apigatewaymanagementapi
            .postToConnection({
              Data: JSON.stringify(data),
              ConnectionId: adminDevice.id
            })
            .promise();
        });
      }
    }
  };

  static sendToAll = async (message: IWebsocketMessage, url: string) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);

    // SEND TO ALL DISPLAY PIS
    let response = await db.scan(
      {
        client_type: EWSClientType.DISPLAY
      },
      true
    );

    let data: IWebsocketMessage = {
      message: message.message,
      payload: message.payload ? message.payload : null,
      client_type: message.client_type,
      raspberry_pi_id: message.raspberry_pi_id
    };

    const apigatewaymanagementapi = new ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: url
    });

    if (response && response.Items) {
      let devices = response.Items;

      // If Device is logged in then send action
      if (devices.length > 0) {
        devices.forEach(async device => {
          data = {
            ...data,
            raspberry_pi_id: device.raspberry_pi_id
          };
          await apigatewaymanagementapi
            .postToConnection({
              Data: JSON.stringify(data),
              ConnectionId: device.id
            })
            .promise();
        });
      }
    }

    let masterQueryResponse = await db.scan(
      {
        client_type: EWSClientType.MASTER
      },
      true
    );

    if (masterQueryResponse && masterQueryResponse.Items) {
      let masterDevice = masterQueryResponse.Items[0];
      if (masterDevice) {
        await apigatewaymanagementapi
          .postToConnection({
            Data: JSON.stringify(data),
            ConnectionId: masterDevice.id
          })
          .promise();
      }
    }

    let adminQueryResponse = await db.scan(
      {
        client_type: EWSClientType.ADMIN
      },
      true
    );

    if (adminQueryResponse && adminQueryResponse.Items) {
      let adminDevices = adminQueryResponse.Items;
      // If logged in then send info
      if (adminDevices.length > 0) {
        adminDevices.forEach(async adminDevice => {
          await apigatewaymanagementapi
            .postToConnection({
              Data: JSON.stringify(data),
              ConnectionId: adminDevice.id
            })
            .promise();
        });
      }
    }
  };

  static startAllDisplays = async (message: IWebsocketMessage, url: string) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);

    // SEND TO ALL DISPLAY PIS
    let response = await db.scan(
      {
        client_type: EWSClientType.DISPLAY
      },
      true
    );

    let data: IWebsocketMessage = {
      message: EWSMessageType.START_VIDEO,
      payload: null,
      client_type: message.client_type,
      raspberry_pi_id: message.raspberry_pi_id
    };

    let devices = response.Items;
    const apigatewaymanagementapi = new ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: url
    });
    // If Device is logged in then send action
    if (devices.length > 0) {
      devices.forEach(async device => {
        await apigatewaymanagementapi
          .postToConnection({
            Data: JSON.stringify(data),
            ConnectionId: device.id
          })
          .promise();
      });
    }
  };

  static startStream = async (message: IWebsocketMessage, url: string) => {
    let db: DatabaseService = new DatabaseService(ETableName.COMMUNICATION);
    // Get Connection ID of Receiver
    if (message.raspberry_pi_id) {
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

        let data: IWebsocketMessage = {
          message: message.message,
          payload: message.payload ? message.payload : null,
          client_type: message.client_type
        };

        await apigatewaymanagementapi
          .postToConnection({
            Data: JSON.stringify(data),
            ConnectionId: device.id
          })
          .promise();
      }
    }
  };
}
