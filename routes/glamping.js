const express = require('express');
const { 
  create,
  glampings,
  image,
  sellerGlampings,
  remove,
  read,
  update,
  userGlampingBookings,
  isAlreadyBooked,
  searchListings
} = require('../controllers/glamping');
const formidable = require('express-formidable');
const { glampingOwner, requireSignin } = require('../middlewares');

const router = express.Router();
router.post('/create-glamping', requireSignin, formidable(), create);
router.get('/glampings', glampings)
router.get('/glamping/:glampingId', read);
router.get('/glamping/image/:glampingId', image);
router.get('/seller-glampings', requireSignin, sellerGlampings);
router.delete('/delete-glamping/:glampingId',requireSignin ,glampingOwner ,remove);
router.put('/update-glamping/:glampingId', requireSignin, formidable(), glampingOwner, update);

// orders
router.get('/user-glamping-bookings', requireSignin, userGlampingBookings);
router.get('/isalready-booked/:glampingId', requireSignin, isAlreadyBooked);
router.post('/search-listings', searchListings)

module.exports = router;