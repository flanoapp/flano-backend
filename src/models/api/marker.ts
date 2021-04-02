import { ILatLng, IPointSchema } from '../../utils';

interface IDBMarker {
    id: string;
    isTopSpot: boolean;
    coordinates: IPointSchema;
}

interface IMarker {
    objectId: string;
    isTopSpot: boolean;
    coordinates: ILatLng;
}

export const DBToMarkerListAPI = (coordinates: Array<IDBMarker>): Array<IMarker> => {
    return coordinates.map((marker: IDBMarker) => (
        {
            objectId: marker.id,
            isTopSpot: marker.isTopSpot,
            coordinates: {
                latitude: marker.coordinates.coordinates[1],
                longitude: marker.coordinates.coordinates[0],
            } as ILatLng,
        }
    ));
};
