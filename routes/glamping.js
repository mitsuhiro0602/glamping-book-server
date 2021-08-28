import express from 'express';
import { 
  create,
  glampings,
  image,
  sellerGlampings,
  remove,
  read,
  update
} from '../controllers/glamping';
import formidable from 'express-formidable';
import { glampingOwner, requireSignin } from '../middlewares';

const router = express.Router();
router.post('/create-glamping', requireSignin, formidable(), create);
router.get('/glampings', glampings)
router.get('/glamping/image/:glampingId', image);
router.get('/seller-glampings', requireSignin, sellerGlampings);
router.delete('/delete-glamping/:glampingId',requireSignin ,glampingOwner ,remove);
router.get('/glamping/:glampingId', read);
router.put('/update-glamping/:glampingId', requireSignin, formidable(), glampingOwner, update);

module.exports = router;