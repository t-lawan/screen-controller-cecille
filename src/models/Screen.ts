import { v4} from 'uuid'
import { EScreenType } from '../Enum/EScreenType';


export class Screen  {
    id: string; 
    local_ip_address: string;
    raspberry_pi_id: number;
    number_of_screens: number;
    video_file_playlist: string[];
    type: EScreenType;

    constructor(local_ip_address: string, raspberry_pi_id: number, type: EScreenType = EScreenType.SLAVE, number_of_screens: number = 1, video_file_playlist: string[] = []) {
        this.id = v4();
        this.local_ip_address = local_ip_address;
        this.raspberry_pi_id = raspberry_pi_id;
        this.type = type;
        this.number_of_screens = number_of_screens;
        this.video_file_playlist = video_file_playlist;
    }
}