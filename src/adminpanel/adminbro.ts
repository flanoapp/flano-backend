import { NextFunction } from 'express';
import AdminBro, { ActionContext, ActionRequest, ActionResponse, CurrentAdmin, flat } from 'admin-bro';
import BaseRecord from 'admin-bro/types/src/backend/adapters/record/base-record';
import AdminBroMongoose from '@admin-bro/mongoose';
import bcrypt from 'bcryptjs';

import DataSource from '../models/db/dataSource';
import FlanoObject from '../models/db/object';
import FlanoTour from '../models/db/tour';
import User from '../models/db/user';
import updateCollection, { resetCollection } from '../external/updateCollection';
import { createTour_helper } from '../api/helpers';
import { IImageSchema } from '../utils';

const AdminBroExpress = require('@admin-bro/express');
const uploadFeature = require('@admin-bro/upload');
const canModifyUsers = (currentAdmin: CurrentAdmin) => currentAdmin.currentAdmin?.role === 'admin';

const adminbro = (mongooseConnection: any) => {
    AdminBro.registerAdapter(AdminBroMongoose);

    const adminBroOptions = {
        databases: [mongooseConnection ? mongooseConnection : null],
        resources: [
            {
                resource: DataSource,
                options: {},
                actions: {
                    edit: {
                        before: async (request: ActionRequest, context: ActionContext, next: NextFunction) => {

                            return request;
                        },
                    },
                },
            },
            {
                resource: FlanoObject,
                options: {
                    properties: {
                        fileUrl: {
                            isVisible: false,
                        },
                        mimeType: {
                            isVisible: false,
                        },
                        imageTitle: {
                            isVisible: {
                                list: false, edit: true, filter: false, show: false, new: true,
                            },
                        },
                        imageAuthor: {
                            isVisible: {
                                list: false, edit: true, filter: false, show: false, new: true,
                            },
                        },
                        imageResourceUrl: {
                            isVisible: {
                                list: false, edit: true, filter: false, show: false, new: true,
                            },
                        },
                        imageLicense: {
                            isVisible: {
                                list: false, edit: true, filter: false, show: false, new: true,
                            },
                        },
                        imageLicenseUrl: {
                            isVisible: {
                                list: false, edit: true, filter: false, show: false, new: true,
                            },
                        },
                    },
                    actions: {
                        edit: {
                            after: async (response: ActionResponse, request: ActionRequest, context: ActionContext) => {
                                if (request.method === 'post') {
                                    let record = context.record;
                                    const fileUrl = record?.params.fileUrl;
                                    const copyright = {
                                        title: record?.params.imageTitle,
                                        author: record?.params.imageAuthor,
                                        resourceUrl: record?.params.imageResourceUrl,
                                        license: record?.params.imageLicense,
                                        licenseUrl: record?.params.imageLicenseUrl,

                                    };
                                    if (fileUrl) {
                                        const filePath = `https://${process.env.S3_IMAGE_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileUrl}`;
                                        const newImages = record?.get('images');
                                        // add image if no image exists with this path
                                        if (!newImages.some((i: IImageSchema) => i.imageSrc === filePath)) {
                                            newImages.push({ imageSrc: filePath, copyright: copyright });
                                            const newRecord = await record?.update({ images: newImages });
                                        }
                                    }

                                }
                                return response;
                            },
                        },
                        updateCollection: {
                            actionType: 'resource',
                            guard: 'Do you really want to update the collection?',
                            handler: async () => {
                                console.log('update collection');
                                await updateCollection();
                                console.log('[server]: Everything is up-to-date!');
                            },
                            component: false,
                        },
                        resetCollection: {
                            actionType: 'resource',
                            guard: 'Do you REALLY want to RESET the collection?',
                            handler: async () => {
                                console.log('reset collection');
                                await resetCollection();
                                console.log('[server]: Everything is up-to-date!');
                            },
                            component: false,
                        },

                    },
                },
                features: [uploadFeature({
                    provider: {
                        aws: {
                            region: `${process.env.AWS_REGION}`,
                            bucket: `${process.env.S3_IMAGE_BUCKET_NAME}`,
                            accessKeyId: `${process.env.AWS_USER_KEY}`,
                            secretAccessKey: `${process.env.AWS_USER_SECRET}`,
                            expires: 0,
                        },
                    },
                    properties: {
                        key: 'fileUrl',
                        mimeType: 'mimeType',
                    },
                    uploadPath: (record: BaseRecord, filename: string) => {
                        return `${record.get('id')}/${filename}`;
                    },
                })],
            },
            {
                resource: FlanoTour,
                options: {
                    editProperties: ['title', 'description', 'objects'],
                    properties: {
                        'objects.coordinates': {
                            isVisible: false,
                        },
                    },
                    actions: {
                        edit: {
                            before: async (request: ActionRequest, context: ActionContext, next: NextFunction) => {

                                if (request.method === 'post') {
                                    // console.log(request.payload);
                                    const objects = flat.get(request.payload, 'objects');
                                    let tourrequest = flat.get(request.payload);
                                    //@ts-ignore
                                    const tour = await createTour_helper(objects.map(o => o.id), next);

                                    if (tour) {
                                        const newObjects = tour.objects.map(o => ({
                                            id: o.id,
                                            coordinates: {
                                                coordinates: o.coordinates.coordinates,
                                                type: o.coordinates.type,
                                            },
                                        }));
                                        request.payload = flat.set(request.payload, 'objects', newObjects);

                                        const newPolyline = {
                                            type: tour.polyline.type,
                                            coordinates: tour.polyline.coordinates,
                                        };
                                        request.payload = flat.set(request.payload, 'polyline', newPolyline);
                                    }
                                }
                                return request;
                            },
                        },
                    },
                },
            },
            {
                resource: User,
                options: {
                    properties: {
                        encryptedPassword: { isVisible: false },
                        password: {
                            type: 'password',
                            isVisible: {
                                list: false, edit: true, filter: false, show: false, new: true,
                            },
                        },
                    },
                    actions: {
                        new: {
                            before: async (request: ActionRequest) => {
                                if (request.payload?.password) {
                                    request.payload = {
                                        ...request.payload,
                                        encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                                        password: undefined,
                                    };
                                }
                                return request;
                            },
                            isAccessible: canModifyUsers,
                        },
                        edit: {
                            before: async (request: ActionRequest) => {
                                if (request.payload?.password) {
                                    request.payload = {
                                        ...request.payload,
                                        encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                                        password: undefined,
                                    };
                                }
                                return request;
                            },
                            isAccessible: canModifyUsers,
                        },
                        delete: { isAccessible: canModifyUsers },
                    },

                },
            }],
        rootPath: '/admin',
        branding: {
            //logo: 'https://flano-images.s3.eu-central-1.amazonaws.com/flano_logo.svg',
            companyName: 'Flano',
        },
    };

    const adminBro = new AdminBro(adminBroOptions);
    //const router = AdminBroExpress.buildRouter(adminBro);


    const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
        cookieName: 'flano-adminconsole',
        cookiePassword: `${process.env.ADMINCONSOLE_COOKIE_PWD}`,
        authenticate: async (email: string, password: string) => {
            const user = await User.findOne({ email });
            if (user) {
                const matches = await bcrypt.compare(password, user.encryptedPassword);
                if (matches) {
                    return user;
                }
            }
            return false;
        },

    }, null, {
        resave: false,
        saveUninitialized: true,
    });

    return router;
};

export default adminbro;

