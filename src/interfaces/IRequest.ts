import { EVideoType } from '../Enum/EVideoType';
import { EScreenType } from '../Enum/EScreenType';
export interface IAddVideoRequestBody {
    title: string;
    uri: string;
    type: EVideoType
}

export interface IUpdateVideoRequestBody {
    id: string;
    title: string;
    uri: string;
    type: EVideoType
}

export interface IAddScreenRequestBody {
    local_ip_address: string;
    raspberry_pi_id: number;
    number_of_screens: number;
    video_file_playlist: string[];
    screen_type: EScreenType;
}