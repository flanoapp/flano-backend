import express, { NextFunction, Request, Response } from 'express';

import FlanoObject from '../models/db/object';
import { DBToObjectDetailsAPI } from '../models/api/detailsObject';
import { DBToObjectListAPI } from '../models/api/listObject';
import HttpException from '../exceptions/HttpException';
import { getObjectById_helper } from './helpers';
import { DBToMarkerListAPI } from '../models/api/marker';

const router = express.Router();

const DEFAUL_POS = {
    longitude: 16.372557,
    latitude: 48.208710,
};

const getCategories = async (categoriesString: string): Promise<Array<string>> => {
    let categories: Array<string>;
    try {
        categories = JSON.parse(categoriesString as string);
    } catch (err) {
        categories = await FlanoObject.distinct('details.category');
    }
    return categories;
};

const getAllByPosition = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const skip = +(req.query.skip as string) || 0;
        const limit = +(req.query.limit as string) || 20;

        const longitude = +(req.query.longitude as string) || DEFAUL_POS.longitude;
        const latitude = +(req.query.latitude as string) || DEFAUL_POS.latitude;

        const search = req.query.search as string || '';
        const categories = await getCategories(req.query.categories as string);

        const objects = await FlanoObject.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [longitude, latitude] },
                    distanceField: 'distance',
                    minDistance: 0,
                    spherical: true,
                    query: {
                        $and: [
                            {
                                $or: [
                                    { 'details.title': new RegExp(search, 'i') },
                                    { 'details.artist': new RegExp(search, 'i') },
                                    { 'details.address': new RegExp(search, 'i') }],
                            },
                            { 'details.category': { $in: categories } },
                        ],
                    },

                },
            },
            {
                $sort: {
                    'distance': 1,
                },

            },

        ]).skip(skip).limit(limit);

        const mappedObjects = DBToObjectListAPI(objects);

        console.log('[server]: Request successful');
        res.status(200).json(mappedObjects);
    } catch (error) {
        next(error);
    }
};

const getByObjectIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const longitude = +(req.query.longitude as string) || DEFAUL_POS.longitude;
        const latitude = +(req.query.latitude as string) || DEFAUL_POS.latitude;

        const idsString = req.query.objects as string;
        let ids = JSON.parse(idsString);

        const objects = await FlanoObject.aggregate([
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [longitude, latitude] },
                    distanceField: 'distance',
                    minDistance: 0,
                    spherical: true,
                    query: { id: { $in: ids } },
                },
            },
        ]);

        if (!objects) {
            next(new HttpException(404, `Objects with ids ${ids.join('\', \'')} not found`));
        }

        const mappedRes = DBToObjectListAPI(objects);

        console.log('[server]: Request successful');
        res.status(200).json(mappedRes);
    } catch (error) {
        next(error);
    }
};

const getByObjectId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const object = await getObjectById_helper(req.params.objectId, next);

        const mappedRes = DBToObjectDetailsAPI(object);
        console.log('[server]: Request successful');
        res.status(200).json(mappedRes);
    } catch (error) {
        next(error);
    }

};
const likeByObjectId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const object = await getObjectById_helper(req.params.objectId, next);

        const newObject = await FlanoObject.findOneAndUpdate(
            { id: object.id },
            { $inc: { likeCount: 1 } },
            { new: true },
        );

        console.log('[server]: Request successful');
        if (newObject) {
            const mappedRes = DBToObjectDetailsAPI(newObject);
            res.status(200).json(mappedRes);
        } else {
            res.status(400);
        }
    } catch (error) {
        next(error);
    }
};
const unlikeByObjectId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const object = await getObjectById_helper(req.params.objectId, next);

        const newObject = await FlanoObject.findOneAndUpdate(
            { id: object.id, likeCount: { $gt: 0 } },
            { $inc: { likeCount: -1 } },
            { new: true },
        );

        console.log('[server]: Request successful');
        if (newObject) {
            const mappedRes = DBToObjectDetailsAPI(newObject);
            res.status(200).json(mappedRes);
        } else {
            res.status(400);
        }
    } catch (error) {
        next(error);
    }
};

const getAllMarkers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const search = req.query.search as string || '';
        const categories = await getCategories(req.query.categories as string);

        const result = await FlanoObject.find(
            {
                $and: [
                    {
                        $or: [
                            { 'details.title': new RegExp(search, 'i') },
                            { 'details.artist': new RegExp(search, 'i') },
                            { 'details.address': new RegExp(search, 'i') }],
                    },
                    { 'details.category': { $in: categories } },
                ],
            },
            [
                'id',
                'coordinates',
                'isTopSpot',
            ],
        );
        const mappedRes = DBToMarkerListAPI(result);

        console.log('[server]: Request successful');
        res.status(200).json(mappedRes);
    } catch (error) {
        next(error);
    }
};

router.get('/', getAllByPosition);
router.get('/find', getByObjectIds);
router.get('/markers', getAllMarkers);
router.get('/:objectId', getByObjectId);
router.patch('/:objectId/like', likeByObjectId);
router.patch('/:objectId/unlike', unlikeByObjectId);

export default router;
