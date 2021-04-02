import { NextFunction } from 'express';
import mongoose from 'mongoose';
import assert from 'assert';

import FlanoObject, { IFlanoObjectSchema } from '../models/db/object';
import FlanoTour, { IFlanoTourSchema } from '../models/db/tour';
import HttpException from '../exceptions/HttpException';
import { ITourObjectSchema, TourObject } from '../utils';
import getPolyline from '../external/getPolyline';

export const getObjectById_helper = async (id: string, next: NextFunction): Promise<IFlanoObjectSchema> => {
    const object = await FlanoObject.findOne({ id: id });
    if (!object) {
        next(new HttpException(404, `Object with id '${id}' not found`));
    }
    assert(object);

    return object;
};

export const getTourObjectById_helper = async (id: string, next: NextFunction): Promise<ITourObjectSchema> => {
    const object = await FlanoObject.findOne({ id: id });
    if (!object) {
        next(new HttpException(404, `Object with id '${id}' not found`));
    }
    assert(object);

    return new TourObject({
        id: object.id,
        coordinates: object.coordinates,
    });
};

export const getTourById_helper = async (id: string, next: NextFunction): Promise<IFlanoTourSchema> => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next(new HttpException(404, `Tour with id '${id}' not found`));
    }
    const tour = await FlanoTour.findOne({ _id: id });
    if (!tour) {
        next(new HttpException(404, `Tour with id '${id}' not found`));
    }
    assert(tour);

    return tour;
};

export const getObjectPreviewById_helper = async (id: string, next: NextFunction): Promise<IFlanoObjectSchema> => {
    const object = await FlanoObject.findOne({ id: id });

    return object || {
        images: [{ imageSrc: 'https://flano-images.s3.eu-central-1.amazonaws.com/flano_logo.png' }],
        details: {
            title: 'Object not found',
        },
    } as IFlanoObjectSchema;
};

export const createTour_helper = async (ids: Array<string>, next: NextFunction) => {
    try {
        const tour = new FlanoTour();
        tour.objects = [];
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            // add object to tour, if it does not yet exist
            if (!tour.objects.map(o => o.id).includes(id)) {
                let object = await getTourObjectById_helper(id, next);
                tour.objects.push(object);
            }
        }

        // create polyline
        tour.polyline = await getPolyline(tour.objects.map(o => o.coordinates));

        return tour;
    } catch (error) {
        next(error);
    }
};

