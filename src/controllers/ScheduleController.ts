import { Handler, ProxyHandler } from "aws-lambda";
import { DatabaseService } from '../services/DatabaseService';
import { ETableName } from '../Enum/ETableName';
import { IPiSchedulePayload } from '../interfaces/IRequest';
import { v4} from 'uuid'
import { EScheduleTableType } from '../Enum/EScheduleTableType';



export const setPiPayload: Handler = async (event, context) => {
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
        let item = {
            id: v4(),
            pi_id: body.pi_id,
            payload: body.payload,
            type: EScheduleTableType.STATUS
        }
        await db.putItem(item);
    }
}

export const startSchedule: Handler = async (event, context) => {
    let db: DatabaseService = new DatabaseService(ETableName.SCHEDULE);
    let response = await db.scan({
        type: EScheduleTableType.ACTIVE
    }, true);

    if(response && response.Items[0]) {
        await db.updateItem(response.Items[0], {
            isActive: true
        })
    } else {
        let item = {
            id: v4(),
            type: EScheduleTableType.ACTIVE,
            isActive: true
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
            isActive: false
        })
    } else {
        let item = {
            id: v4(),
            type: EScheduleTableType.ACTIVE,
            isActive: false
        }
        await db.putItem(item);
    }
}

