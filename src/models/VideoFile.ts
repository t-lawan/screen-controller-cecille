import { v4} from 'uuid'
import { IVideo } from '../interfaces/IVideo';
import { EVideoType } from '../Enum/EVideoType';

export class VideoFile implements IVideo {
    id: string; 
    title: string;
    uri: string;
    video_type: EVideoType;

    constructor(title: string, uri: string) {
        this.id = v4();
        this.title = title;
        this.uri = uri;
        this.video_type = EVideoType.FILE;
    }
}