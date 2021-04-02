import express, { NextFunction, Request, Response } from 'express';
import { getObjectPreviewById_helper } from '../api/helpers';

const router = express.Router();

const object = async (req: Request, res: Response, next: NextFunction) => {
    const objectId = req.params.objectId;

    const object = await getObjectPreviewById_helper(objectId, next);

    res.render('redirect', {
        id: object.id,
        title: object.details.title,
        description: 'Flano - die Stadt als Museum',
        image: object.thumbnail,
        type: 'redirect',
        url: `flano:///objects/${objectId}`,
        site_name: 'Flano',
    });
};

router.get('/:objectId', object);

export default router;
