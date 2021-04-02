import fetch from 'node-fetch';

import { IPointSchema, MAP_LIBRARY_URL } from '../utils';

const getPolyline = async (wayPoints: Array<IPointSchema>) => {
    try {
        if (wayPoints.length < 2) {
            return null;
        }
        console.log('[server]: Requesting Polyline from api.openrouteservice.org...');

        const options = {
            method: 'Post',
            headers: {
                Authorization: `${process.env.MAP_LIBRARY_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                coordinates: wayPoints.map(p => p.coordinates),
            }),
        };

        const res = await fetch(MAP_LIBRARY_URL, options);
        const json = await res.json();
        const geoJSON = json.features[0].geometry;

        console.log('[server]: Successfully retrieved Polyline!');

        return geoJSON;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export default getPolyline;
