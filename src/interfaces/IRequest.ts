import { EVideoType } from '../Enum/EVideoType';
import { EScreenType } from '../Enum/EScreenType';
import { IPlaylistEntry } from './IPlaylistEntry';
import { EWSMessageType } from '../Enum/EWSMessageType';
import { EWSClientType } from '../Enum/EWSClientType';
import { EScheduleTableType } from '../Enum/EScheduleTableType';
export interface IAddVideoRequestBody {
    title: string;
    uri: string;
    video_type: EVideoType
}

export interface IUpdateVideoRequestBody {
    id: string;
    title: string;
    uri: string;
    video_type: EVideoType
}

export interface IAddScreenRequestBody {
    local_ip_address: string;
    raspberry_pi_id: number;
    number_of_screens: number;
    video_file_playlist: IPlaylistEntry[];
    screen_type: EScreenType;
    video_id: string;
}

export interface IScheduleItem {
    id: string;
    pi_id?: string;
    payload?: string;
    schedule_type: EScheduleTableType;
    is_active?: boolean;

}

export interface IUpdateScreenRequestBody {
    id: string; 
    local_ip_address: string;
    raspberry_pi_id: number;
    number_of_screens: number;
    video_file_playlist: IPlaylistEntry[];
    screen_type: EScreenType;
    video_id: string;
}

export interface IAddAudioRequestBody {
    title: string;
    uri: string;
}

export interface IWebsocketMessage {
    message: EWSMessageType;
    client_type: EWSClientType;
    raspberry_pi_id?: number;
    payload?: any;
}

export interface IPiSchedulePayload {
    pi_id: string;
    payload: string;
}

let exampleMessage = {"message": "START_SCHEDULE", "client_type":"MASTER"}
let initMessage = {"client_type":"ADMIN","message":"INITIALISE","raspberry_pi_id":0}