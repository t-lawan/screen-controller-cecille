import { EVideoType } from '../Enum/EVideoType';
export interface IVideo {
    id: string;
    title: string;
    uri: string;
    type: EVideoType
}