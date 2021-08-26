import express from 'express';
import { create } from '../controllers/glamping';
import formidable from 'express-formidable';
import { requireSignin } from '../middlewares';

const router = express.Router();
router.post('/create-glamping', requireSignin, formidable(), create);


module.exports = router;