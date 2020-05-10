import { v4} from 'uuid'
import { IVideo } from '../interfaces/IVideo';
import { EVideoType } from '../Enum/EVideoType';

export class VideoFile implements IVideo {
    id: string; 
    title: string;
    filename: string;
    type: EVideoType;

    constructor(title: string, filename: string) {
        this.id = v4();
        this.title = title;
        this.filename = filename;
        this.type = EVideoType.FILE;
    }
}