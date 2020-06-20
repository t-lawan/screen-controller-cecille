import { EVideoType } from '../Enum/EVideoType';
export interface IVideo {
    id: string;
    title: string;
    uri: string;
    video_type: EVideoType
}