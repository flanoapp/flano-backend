import { IFlanoObjectSchema } from '../db/object';
import { ILatLng } from '../../utils';

interface ListAPIFlanoObject {
    objectId: string;
    coordinates: ILatLng;
    isTopSpot: boolean;
    image: string;
    title: string;
    category: string;
    distance: string;
}

export const DBToObjectListAPI = (dbObj: Array<IFlanoObjectSchema>): Array<ListAPIFlanoObject> => {
    return dbObj.map((obj) => (
        {
            objectId: obj.id,
            coordinates: {
                latitude: obj.coordinates.coordinates[1],
                longitude: obj.coordinates.coordinates[0],
            } as ILatLng,
            isTopSpot: obj.isTopSpot,
            image: obj.thumbnail,
            title: obj.details.title,
            category: obj.details.category,
            distance: obj.distance < 10 ?
                `<10m` :
                obj.distance < 1000 ?
                    `${Math.floor(obj.distance / 10) * 10}m` :
                    `${Math.floor(obj.distance / 100) / 10}km`,
        }
    ));
};

