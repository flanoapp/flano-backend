import mongoose, { Document, Schema } from 'mongoose';

export const VIENNA_OPEN_DATA_URL = 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:KUNSTWERKOGD&srsName=EPSG:4326&outputFormat=json';
export const VIENNA_CALLE_LIBRE_URL = 'vienna_calle_libre.csv';
export const MAP_LIBRARY_URL = 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson';

export const DEFAULT_IMAGES = {
    'Brunnen': 'brunnen_wide',
    'Denkmäler': 'denkmal_wide',
    'Gedenktafeln': 'gedenktafel_wide',
    'Grabmäler/Grabhaine': 'grabmal_wide',
    'Kunst am Bau wandgebunden': 'kunst_am_bau_wide',
    'Profanplastiken/Kunst am Bau freistehend': 'profanplastik_wide',
    'Sakrale Kleindenkmäler': 'sakrales_denkmal_wide',
    'Street Art': 'streetart_wide',
};

export const DEFAULT_THUMBNAILS = {
    'Brunnen': 'brunnen',
    'Denkmäler': 'denkmal',
    'Gedenktafeln': 'gedenktafel',
    'Grabmäler/Grabhaine': 'grabmal',
    'Kunst am Bau wandgebunden': 'kunst_am_bau',
    'Profanplastiken/Kunst am Bau freistehend': 'profanplastik',
    'Sakrale Kleindenkmäler': 'sakrales_denkmal',
    'Street Art': 'streetart',
};

export const DATA_SOURCES = {
    vienna_open_data: 'vienna_open_data',
    vienna_calle_libre: 'vienna_calle_libre',
};

export const TOPSPOTS = {
    minLikes: 10,
    maxCount: 5,
};

export interface ILatLng extends Document {
    latitude: number;
    longitude: number;
}

export interface IPointSchema extends Document {
    type: string;
    coordinates: [number, number];
}

export const pointSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
    },
    coordinates: {
        type: [Number, Number],
        required: true,
    },
}, {
    _id: false,
    id: false,
});
export const Point = mongoose.model<IPointSchema>('Point', pointSchema);

export interface IPolylineSchema extends Document {
    type: string;
    coordinates: Array<[number, number]>;
}

export const polylineSchema = new Schema({
    type: {
        type: String,
        enum: ['LineString'],
        required: true,
    },
    coordinates: {
        type: Schema.Types.Array,
        required: true,
    },
}, {
    _id: false,
    id: false,
});
export const Polyline = mongoose.model<IPolylineSchema>('Polyline', polylineSchema);


export interface ITourObjectSchema extends Document {
    id: string;
    coordinates: IPointSchema;
}

export const tourObjectSchema = new Schema({
    id: { type: String, required: true },
    coordinates: { type: pointSchema, required: true },
}, {
    _id: false,
    id: false,
});

export const TourObject = mongoose.model<ITourObjectSchema>('TourObject', tourObjectSchema);

export interface IImageSchema extends Document {
    imageSrc: string;
    copyright: {
        title: string,
        author: string,
        resourceUrl: string,
        license: string,
        licenseUrl: string,
    };
}

export const copyrightSchema = new Schema({
    title: { type: String },
    author: { type: String },
    resourceUrl: { type: String },
    license: { type: String },
    licenseUrl: { type: String },
}, { _id: false, id: false });

export const imageSchema = new Schema({
    imageSrc: {
        type: String,
        required: true,
    },
    copyright: {
        type: copyrightSchema,
    },
}, {
    _id: false,
    id: false,
});

export const Image = mongoose.model<IImageSchema>('Image', imageSchema);
