import express from 'express';
import swaggerUi from 'swagger-ui-express';

import objectsAPI from './objects';
import categoriesAPI from './categories';
import toursAPI from './tours';
import translationsApi from './translations';

const router = express.Router();

const swaggerDocument = require('../../resources/swagger.json');
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.use('/objects', objectsAPI);
router.use('/categories', categoriesAPI);
router.use('/tours', toursAPI);
router.use('/translations', translationsApi);

export default router;
