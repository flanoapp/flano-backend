import fetch from 'node-fetch';

import DataSource, { IDataSource } from '../models/db/dataSource';
import { transferOldValues, viennaOpenDataToDB } from '../models/db/mappers/vienna_open_data';
import FlanoObject, { IFlanoObjectSchema } from '../models/db/object';
import { IViennaOpenDataObject } from '../models/external/vienna_open_data_object';
import { DATA_SOURCES, VIENNA_OPEN_DATA_URL } from '../utils';

const fetchData = async (): Promise<Array<IFlanoObjectSchema>> => {
    console.log('[server]: Fetching data from data.gv.at...');
    const res = await fetch(VIENNA_OPEN_DATA_URL, { method: 'Get' });
    const json = await res.json();
    console.log('[server]: Successfully fetched data');

    console.log('[server]: Retrieving data source...');
    const dataSrc = await DataSource.findOne({ name: DATA_SOURCES.vienna_open_data })
        || { name: DATA_SOURCES.vienna_open_data } as IDataSource;

    console.log('[server]: Parsing data...');
    return json.features.map((o: IViennaOpenDataObject) => viennaOpenDataToDB(o, dataSrc));
};

const updateViennaOpenData = async () => {
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
        await FlanoObject.deleteMany({ 'dataSource.name': DATA_SOURCES.vienna_open_data });

        console.log('[server]: Saving data...');
        await FlanoObject.insertMany(flanoObjects);

    } catch (err) {
        console.log(err);
    }
};

export const fetchViennaOpenData = async () => {
    try {
        const newObjs = await fetchData();

        console.log('[server]: Saving data...');
        await FlanoObject.insertMany(newObjs);

    } catch (err) {
        console.log(err);
    }
};

export default updateViennaOpenData;
