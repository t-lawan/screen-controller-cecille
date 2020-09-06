import { v4} from 'uuid'
import { EScreenType } from '../Enum/EScreenType';
import { IPlaylistEntry } from '../interfaces/IPlaylistEntry';
import { IScreen } from '../interfaces/IScreen';


export class Screen implements IScreen {
    id: string; 
    local_ip_address: string;
    raspberry_pi_id: number;
    number_of_screens: number;
    video_file_playlist: IPlaylistEntry[];
    screen_type: EScreenType;
    video_id: string

    constructor(local_ip_address: string, raspberry_pi_id: number, type: EScreenType = EScreenType.SLAVE, number_of_screens: number = 1, video_id, video_file_playlist: IPlaylistEntry[] = []) {
        this.id = v4();
        this.local_ip_address = local_ip_address;
        this.raspberry_pi_id = raspberry_pi_id;
        this.screen_type = type;
        this.number_of_screens = number_of_screens;
        this.video_id = video_id;
        this.video_file_playlist = video_file_playlist;
    }
}