import { EVideoType } from '../Enum/EVideoType';
import { EScreenType } from '../Enum/EScreenType';
import { IPlaylistEntry } from './IPlaylistEntry';
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
}

export interface IUpdateScreenRequestBody {
    id: string;
    local_ip_address: string;
    raspberry_pi_id: number;
    number_of_screens: number;
    video_file_playlist: IPlaylistEntry[];
    screen_type: EScreenType;
}