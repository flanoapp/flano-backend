import express from 'express';
import path from 'path';

const router = express.Router();

console.log('========================');
console.log(path.join(__dirname, '..', '..', 'resources', 'website'));
console.log('========================');
router.use('/', express.static(path.join(__dirname, '..', '..', 'resources', 'website')));
// router.use('/', express.static('resources/website'));

export default router;
