import { v4} from 'uuid'
import { EVideoType } from '../Enum/EVideoType';
import { IVideo } from '../interfaces/IVideo';

export class VideoStream implements IVideo {
    id: string; 
    title: string;
    filename: string;
    type: EVideoType;

    constructor(title: string, filename: string) {
        this.id = v4();
        this.title = title;
        this.filename = filename;
        this.type = EVideoType.STREAM;
    }
}