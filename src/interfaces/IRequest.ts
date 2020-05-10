import { EVideoType } from '../Enum/EVideoType';
export interface IAddVideoRequestBody {
    title: string;
    filename: string;
    type: EVideoType
}