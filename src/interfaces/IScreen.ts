import { EScreenType } from '../Enum/EScreenType';
import { IPlaylistEntry } from './IPlaylistEntry';
export interface IScreen {
    id: string; 
    local_ip_address: string;
    raspberry_pi_id: number;
    number_of_screens: number;
    video_file_playlist: IPlaylistEntry[];
    screen_type: EScreenType;
}