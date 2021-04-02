import { IFlanoObjectSchema } from '../db/object';
import { IImageSchema, ILatLng } from '../../utils';

interface DetailsAPIFlanoObject {
    objectId: string;
    coordinates: ILatLng;
    isTopSpot: boolean;
    images: Array<IImageSchema>;
    likeCount: number;
    details: {
        title: string;
        artist: string;
        date: string;
        category: string;
        artistCountry?: string;
        description?: string;
        biography?: string;
        inscription?: string;
        history?: string;
        origin?: string;
        epoch?: string;
        vulgarNames?: string;
        material?: string;
        literature?: string;
        website?: string;
        address?: string;
        dataSource?: string;
    }
}

export const DBToObjectDetailsAPI = (dbObj: IFlanoObjectSchema): DetailsAPIFlanoObject => {
    return {
        objectId: dbObj.id,
        coordinates: {
            latitude: dbObj.coordinates.coordinates[1],
            longitude: dbObj.coordinates.coordinates[0],
        } as ILatLng,
        isTopSpot: dbObj.isTopSpot,
        images: dbObj.images,
        likeCount: dbObj.likeCount,
        details: { ...dbObj.details, dataSource: dbObj.dataSource.copyright },
    };
};

