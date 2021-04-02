import mongoose, { Document, Schema } from 'mongoose';

import { IPolylineSchema, ITourObjectSchema, polylineSchema, tourObjectSchema } from '../../utils';

export interface IFlanoTourSchema extends Document {
    title: string;
    description: string;
    objects: Array<ITourObjectSchema>;
    polyline: IPolylineSchema;
}

const flanoTourSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    objects: { type: [tourObjectSchema] },
    polyline: { type: polylineSchema },
});

const FlanoTour = mongoose.model<IFlanoTourSchema>('FlanoTour', flanoTourSchema);
export default FlanoTour;
