import mongoose, { Document, Schema } from 'mongoose';
import { IImageSchema, imageSchema, IPointSchema, pointSchema } from '../../utils';
import { dataSourceSchema, IDataSource } from './dataSource';

export interface IFlanoObjectSchema extends Document {
    id: string;
    foreignKey: string;
    dataSource: IDataSource;
    coordinates: IPointSchema;
    isTopSpot: boolean;
    images: Array<IImageSchema>;
    likeCount: number;
    thumbnail: string;
    distance: number;
    details: {
        title: string;
        artist: string;
        artistCountry: string;
        date: string;
        category: string;
        description: string;
        biography: string;
        inscription: string;
        history: string;
        origin: string;
        epoch: string;
        vulgarNames: string;
        material: string;
        literature: string;
        address: string;
    };
}

export const flanoObjectSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    foreignKey: { type: String, required: true },
    dataSource: { type: dataSourceSchema, required: true },
    coordinates: { type: pointSchema, required: true },
    isTopSpot: { type: Boolean, required: true },
    images: { type: [imageSchema], required: true },
    likeCount: { type: Number, min: 0, required: true },
    thumbnail: { type: String, required: true },
    details: {
        type: {
            title: { type: String, required: true },
            artist: { type: String, required: true },
            artistCountry: { type: String },
            date: { type: String, required: true },
            category: { type: String, required: true },
            description: { type: String },
            biography: { type: String },
            inscription: { type: String },
            history: { type: String },
            origin: { type: String },
            epoch: { type: String },
            vulgarNames: { type: String },
            material: { type: String },
            literature: { type: String },
            address: { type: String },
        }, required: true,
    },
});

const FlanoObject = mongoose.model<IFlanoObjectSchema>('FlanoObject', flanoObjectSchema);
export default FlanoObject;

