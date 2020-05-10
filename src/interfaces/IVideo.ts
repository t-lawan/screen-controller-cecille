import { EVideoType } from '../Enum/EVideoType';
export interface IVideo {
    id: string;
    title: string;
    filename: string;
    type: EVideoType
}