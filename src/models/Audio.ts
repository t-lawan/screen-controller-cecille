import { IAudio } from '../interfaces/IAudio';
import { v4} from 'uuid'

export class Audio implements IAudio {
    id: string; 
    title: string;
    uri: string;
    constructor(title: string, uri: string) {
        this.id = v4();
        this.title = title;
        this.uri = uri;
    }
}