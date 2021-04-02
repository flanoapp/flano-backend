import md5 from 'md5';

import FlanoObject, { IFlanoObjectSchema } from '../object';
import { IDataSource } from '../dataSource';
import { DATA_SOURCES, DEFAULT_IMAGES, DEFAULT_THUMBNAILS, IPointSchema } from '../../../utils';
import { IViennaCalleLibreObject } from '../../external/vienna_calle_libre_object';

export const viennaCalleLibreToDB = (obj: IViennaCalleLibreObject, dataSrc: IDataSource): IFlanoObjectSchema | null => {

    const category = 'Street Art';

    const thumbnailSrc = `https://${process.env.S3_IMAGE_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/default/thumbnails/${DEFAULT_THUMBNAILS[category]}.png`;

    const imgSrc = `https://${process.env.S3_IMAGE_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/default/${DEFAULT_IMAGES[category]}.png`;

    const coordinates = obj['Coordinates'].split(',').map(c => +c.trim()).reverse();

    try {
        return new FlanoObject({
            id: md5(`${DATA_SOURCES.vienna_calle_libre}${obj['ID']}`),
            foreignKey: obj['ID'],
            dataSource: dataSrc,
            coordinates: {
                type: 'Point',
                coordinates: coordinates,
            } as IPointSchema,
            isTopSpot: false,
            thumbnail: thumbnailSrc,
            images: [{ imageSrc: imgSrc }],
            likeCount: 0,
            details: {
                title: obj['Mural Title'] || 'Ohne Titel',
                artist: obj['Artist Name'] || 'Unbekannt',
                artistCountry: obj['Country'] || 'Unbekannt',
                date: obj['Year'] || '-',
                category: category,
                description: obj['Mural Description'],
                biography: obj['Artist Bio'],
                address: obj['Mural Address'],
                website: obj['Media'],
            },
        });
    } catch (e) {
        console.log('[server]: Something went horribly wrong while parsing from vienna calle libre.');
        return null;
    }
};

export const transferOldValues = (newObj: IFlanoObjectSchema, oldObj: IFlanoObjectSchema) => {
    return Object.assign(newObj, {
        ...newObj,
        isTopSpot: oldObj.isTopSpot,
        images: oldObj.images,
        likeCount: oldObj.likeCount,
    });
};

