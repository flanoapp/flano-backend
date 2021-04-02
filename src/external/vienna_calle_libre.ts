import AWS from 'aws-sdk';
import csv from 'csvtojson';

import DataSource, { IDataSource } from '../models/db/dataSource';
import FlanoObject, { IFlanoObjectSchema } from '../models/db/object';
import { transferOldValues, viennaCalleLibreToDB } from '../models/db/mappers/vienna_calle_libre';
import { IViennaCalleLibreObject } from '../models/external/vienna_calle_libre_object';
import { DATA_SOURCES, VIENNA_CALLE_LIBRE_URL } from '../utils';

const fetchData = async (): Promise<Array<IFlanoObjectSchema>> => {
    console.log('[server]: Fetching data from S3');
    const S3 = new AWS.S3({
        region: `${process.env.AWS_REGION}`,
        accessKeyId: `${process.env.AWS_USER_KEY}`,
        secretAccessKey: `${process.env.AWS_USER_SECRET}`,
    });
    const params = {
        Bucket: `${process.env.S3_DATA_BUCKET_NAME}`,
        Key: VIENNA_CALLE_LIBRE_URL,
    };

    const stream = S3.getObject(params).createReadStream();
    const json = await csv({
        delimiter: ',',
        trim: true,
        ignoreEmpty: true,
    }).fromStream(stream) as [IViennaCalleLibreObject];
    console.log('[server]: Successfully fetched data');

    console.log('[server]: Retrieving data source...');
    const dataSrc = await DataSource.findOne({ name: DATA_SOURCES.vienna_calle_libre })
        || { name: DATA_SOURCES.vienna_calle_libre } as IDataSource;

    console.log('[server]: Parsing data...');
    // @ts-ignore
    return json
        .filter(o => !!o && !!o['ID'] && !!o['Coordinates'])
        .map((o: IViennaCalleLibreObject) => viennaCalleLibreToDB(o, dataSrc));
};

const updateViennaCalleLibre = async () => {
    try {
        const newObjs = await fetchData();

        console.log('[server]: Caching old values...');
        const oldObjs = await FlanoObject.find();

        console.log('[server]: Updating data...');
        const flanoObjects = newObjs.map((newObj: IFlanoObjectSchema) => {
            const oldObj = oldObjs.find((o: IFlanoObjectSchema) => o.id === newObj.id);
            return transferOldValues(newObj, oldObj || newObj);
        });

        console.log('[server]: Deleting old data...');
        await FlanoObject.deleteMany({ 'dataSource.name': DATA_SOURCES.vienna_calle_libre });

        console.log('[server]: Saving data...');
        await FlanoObject.insertMany(flanoObjects);

    } catch (err) {
        console.log(err);
    }
};

export const fetchViennaCalleLibre = async () => {
    try {
        const newObjs = await fetchData();

        console.log('[server]: Saving data...');
        await FlanoObject.insertMany(newObjs);

    } catch (err) {
        console.log(err);
    }
};

export default updateViennaCalleLibre;
