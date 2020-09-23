import { Handler, ProxyHandler, APIGatewayProxyHandler } from "aws-lambda";
import { DatabaseService } from '../services/DatabaseService';
import { ETableName } from '../Enum/ETableName';
import { IPiSchedulePayload, IScheduleItem } from '../interfaces/IRequest';
import { v4} from 'uuid'
import { EScheduleTableType } from '../Enum/EScheduleTableType';
import { ResponseService } from "../services/ResponseService";



export const updatePiSchedule: Handler = async (event, context) => {
    let db: DatabaseService = new DatabaseService(ETableName.SCHEDULE);
    let body: IPiSchedulePayload = event.body;
    if(!body.pi_id) {
      throw new Error("Request is missing title");
    }

    if(!body.payload) {
        throw new Error("Request is missing title");
    }

    let response = await db.scan({
        pi_id: body.pi_id
    }, true);

    if(response && response.Items[0]) {
        await db.updateItem(response.Items[0], {
            payload: body.payload
        })
    } else {
        let item: IScheduleItem = {
            id: v4(),
            pi_id: body.pi_id,
            payload: body.payload,
            schedule_type: EScheduleTableType.STATUS
        }
        await db.putItem(item);
    }
}

export const startSchedule: Handler = async (event, context) => {
    let db: DatabaseService = new DatabaseService(ETableName.SCHEDULE);
    let response = await db.scan({
        schedule_type: EScheduleTableType.ACTIVE
    }, true);

    if(response && response.Items[0]) {
        await db.updateItem(response.Items[0], {
            is_active: true
        })
    } else {
        let item: IScheduleItem = {
            id: v4(),
            schedule_type: EScheduleTableType.ACTIVE,
            is_active: true
        }
        await db.putItem(item);
    }
}

export const stopSchedule: Handler = async (event, context) => {
    let db: DatabaseService = new DatabaseService(ETableName.SCHEDULE);
    let response = await db.scan({
        type: EScheduleTableType.ACTIVE
    }, true);

    if(response && response.Items[0]) {
        await db.updateItem(response.Items[0], {
            is_active: false
        })
    } else {
        let item: IScheduleItem = {
            id: v4(),
            schedule_type: EScheduleTableType.ACTIVE,
            is_active: false
        }
        await db.putItem(item);
    }
}

export const getVideosScheduledOnScreens: APIGatewayProxyHandler = async (event, context) => {
    try {
      let db: DatabaseService = new DatabaseService(ETableName.SCHEDULE)

      let response = await db.getAllItems();

      let screens: IScheduleItem[] = response.Items;

      let activeScheduleItem: IScheduleItem  = screens.find((vid) => {
          return vid.is_active
      })

      screens = screens.filter((vid) => {
          return vid.schedule_type === EScheduleTableType.STATUS
      })

      let object = {
          is_active: activeScheduleItem ? activeScheduleItem.is_active : false,
          screens: screens
      }
  
      return ResponseService.success(object);
    } catch (error) {
      return ResponseService.error(error.message, error.statusCode);
    }
  };

