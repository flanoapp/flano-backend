import md5 from 'md5';

import FlanoObject, { IFlanoObjectSchema } from '../object';
import { IDataSource } from '../dataSource';
import { IViennaOpenDataObject } from '../../external/vienna_open_data_object';
import { DATA_SOURCES, DEFAULT_IMAGES, DEFAULT_THUMBNAILS } from '../../../utils';

export const viennaOpenDataToDB = (obj: IViennaOpenDataObject, dataSrc: IDataSource): IFlanoObjectSchema | null => {
    const isVienna = obj.properties['PLZ'].toString().startsWith('1');
    const city = obj.properties['ORT'] || isVienna ? 'Wien' : '';
    const street = obj.properties['STRASSE'] ? `${obj.properties['STRASSE'].trim()}, ` : '';
    const location = obj.properties['STANDORT'] ? ` - ${obj.properties['STANDORT'].trim()} ` : '';

    const address = `${street}${obj.properties['PLZ']} ${city}${location}`;

    let biography = obj.properties.BIOGR_ANGABEN?.trim();
    if (biography?.endsWith('.')) {
        biography = biography.slice(0, -1);
    }

    let date = obj.properties.ENTSTEHUNG?.trim();
    if (date?.endsWith('.')) {
        date = date.slice(0, -1);
    }

    const epoch = obj.properties.EPOCHE?.trim().slice(3);

    const thumbnailSrc = `https://${process.env.S3_IMAGE_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/default/thumbnails/${DEFAULT_THUMBNAILS[obj.properties.TYP]}.png`;

    const imgSrc = `https://${process.env.S3_IMAGE_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/default/${DEFAULT_IMAGES[obj.properties.TYP]}.png`;

    try {
        return new FlanoObject({
            id: md5(`${DATA_SOURCES.vienna_open_data}${obj.properties.ID.toString()}`),
            foreignKey: obj.properties.ID.toString(),
            dataSource: dataSrc,
            coordinates: obj.geometry,
            isTopSpot: false,
            thumbnail: thumbnailSrc,
            images: [{ imageSrc: imgSrc }],
            likeCount: 0,
            details: {
                title: obj.properties.OBJEKTTITEL,
                artist: obj.properties.KUENSTLER || '-',
                date: date || '-',
                category: obj.properties.TYP || '-',
                description: obj.properties.BESCHREIBUNG?.trim(),
                biography: biography,
                inscription: obj.properties.INSCHRIFT?.trim(),
                history: obj.properties.GESCHICHTE?.trim(),
                epoch: epoch,
                vulgarNames: obj.properties.VULGONAMEN?.trim(),
                material: obj.properties.MATERIAL?.trim(),
                literature: obj.properties.LITERATURQUELLEN?.trim(),
                address: address,
            },
        });
    } catch (e) {
        console.log('[server]: Something went horribly wrong while parsing from vienna open data.');
        return null;
    }
};

export const transferOldValues = (newObj: IFlanoObjectSchema, oldObj: IFlanoObjectSchema) => {
    return Object.assign(newObj, {
        ...newObj,
        isTopSpot: oldObj.isTopSpot,
        images: oldObj.images,
        thumbnail: oldObj.thumbnail,
        likeCount: oldObj.likeCount,
    });
};

