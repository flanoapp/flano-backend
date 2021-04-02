import FlanoObject, { IFlanoObjectSchema } from '../models/db/object';
import { TOPSPOTS } from '../utils';
import updateViennaOpenData, { fetchViennaOpenData } from './vienna_open_data';
import updateViennaCalleLibre, { fetchViennaCalleLibre } from './vienna_calle_libre';

const calculateTopSpots = async () => {
    try {
        console.log('[server]: Calculating TopSpots...');

        const topSpots = await FlanoObject.find({ likeCount: { $gte: TOPSPOTS.minLikes } })
            .sort({ likeCount: -1 })
            .limit(TOPSPOTS.maxCount);

        const ids = topSpots.map((o: IFlanoObjectSchema) => o.id);

        await FlanoObject.updateMany(
            { id: { $in: ids } },
            { $set: { isTopSpot: true } },
        );

        console.log('[server]: TopSpots are set in database!');
    } catch (err) {
        console.log(err);
    }
};

const updateCollection = async () => {
    try {
        console.log('[server]: Update Collection');

        console.log('');
        console.log('[server]: ===== Vienna Open Data =====');
        await updateViennaOpenData();

        console.log('');
        console.log('[server]: ===== Vienna Calle Libre =====');
        await updateViennaCalleLibre();

        // other data sources

        await calculateTopSpots();

        console.log('[server]: Successfully updated and saved data!');
    } catch (err) {
        console.log(err);
    }
};


export const resetCollection = async () => {
    try {
        console.log('[server]: Wiping collection...');
        await FlanoObject.deleteMany({});

        console.log('');
        console.log('[server]: ===== Vienna Open Data =====');
        await fetchViennaOpenData();

        console.log('');
        console.log('[server]: ===== Vienna Calle Libre =====');
        await fetchViennaCalleLibre();

        // other data sources

        console.log('[server]: Successfully saved data');
    } catch (err) {
        console.log(err);
    }
};

export default updateCollection;
