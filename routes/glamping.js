import express from 'express';
import { 
  create,
  glampings,
  image,
  sellerGlampings,
  remove,
  read,
  update,
  userGlampingBookings,
  isAlreadyBooked
} from '../controllers/glamping';
import formidable from 'express-formidable';
import { glampingOwner, requireSignin } from '../middlewares';

const router = express.Router();
router.post('/create-glamping', requireSignin, formidable(), create);
router.get('/glampings', glampings)
router.get('/glamping/:glampingId', read);
router.get('/glamping/image/:glampingId', image);
router.get('/seller-glampings', requireSignin, sellerGlampings);
router.delete('/delete-glamping/:glampingId',requireSignin ,glampingOwner ,remove);
router.put('/update-glamping/:glampingId', requireSignin, formidable(), glampingOwner, update);

// orders
router.get('/user-glamping-bookings', requireSignin, userGlampingBookings)
router.get('/isalready-booked/:glampingId', requireSignin, isAlreadyBooked)

module.exports = router;