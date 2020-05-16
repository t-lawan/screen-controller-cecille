import { v4} from 'uuid'
import { IVideo } from '../interfaces/IVideo';
import { EVideoType } from '../Enum/EVideoType';

export class VideoFile implements IVideo {
    id: string; 
    title: string;
    uri: string;
    type: EVideoType;

    constructor(title: string, uri: string) {
        this.id = v4();
        this.title = title;
        this.uri = uri;
        this.type = EVideoType.FILE;
    }
}