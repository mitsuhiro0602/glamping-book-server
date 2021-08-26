import express from 'express';
import { 
  create,
  glampings,
  image
} from '../controllers/glamping';
import formidable from 'express-formidable';
import { requireSignin } from '../middlewares';

const router = express.Router();
router.post('/create-glamping', requireSignin, formidable(), create);
router.get('/glampings', glampings)
router.get('/glamping/image/:glampingId', image)

module.exports = router;