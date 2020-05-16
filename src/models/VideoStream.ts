import { v4} from 'uuid'
import { EVideoType } from '../Enum/EVideoType';
import { IVideo } from '../interfaces/IVideo';

export class VideoStream implements IVideo {
    id: string; 
    title: string;
    uri: string;
    type: EVideoType;

    constructor(title: string, uri: string) {
        this.id = v4();
        this.title = title;
        this.uri = uri;
        this.type = EVideoType.STREAM;
    }
}