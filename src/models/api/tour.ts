import { IFlanoTourSchema } from '../db/tour';
import { ILatLng } from '../../utils';

interface ITourObjectResponseSchema {
    objectId: string;
    coordinates: ILatLng;
}

interface IAPIFlanoTour {
    id: string;
    title: string;
    description: string;
    objects: Array<ITourObjectResponseSchema>;
    polyline?: Array<ILatLng>;
}

interface IPostAPIFlanoTour {
    id: string;
    title: string;
    description: string;
    objects: Array<string>;
}

export const DBToTourAPIMany = (dbObj: Array<IFlanoTourSchema>): Array<IAPIFlanoTour> => {
    return dbObj.map((obj) => DBToTourAPIOne(obj));
};

export const DBToTourAPIOne = (dbObj: IFlanoTourSchema): IAPIFlanoTour => {
    return {
        id: dbObj._id,
        title: dbObj.title,
        description: dbObj.description,
        objects: dbObj.objects.map(o => ({
            objectId: o.id,
            coordinates: {
                latitude: o.coordinates.coordinates[1],
                longitude: o.coordinates.coordinates[0],
            } as ILatLng,
        })),
        polyline:
            !dbObj.polyline
                ? []
                : dbObj.polyline.coordinates.map(point => ({
                    latitude: point[1],
                    longitude: point[0],
                } as ILatLng)),
    };
};
