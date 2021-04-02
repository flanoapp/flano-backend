import mongoose, { Document, Schema } from 'mongoose';

export interface IDataSource extends Document {
    name: string;
    copyright: string;
}

export const dataSourceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    copyright: {
        type: String,
    },
});

const DataSource = mongoose.model<IDataSource>('DataSource', dataSourceSchema);
export default DataSource;
