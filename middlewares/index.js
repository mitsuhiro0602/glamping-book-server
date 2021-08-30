const expressJwt = require('express-jwt');
const Glamping = require('../models/glamping');

// req.user
exports.requireSignin = expressJwt({
  // secret, expiryDate
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
})

exports.glampingOwner = async(req, res, next) => {
  let glamping = await Glamping.findById(req.params.glampingId).exec()
  let owner = glamping.postedBy._id.toString() === req.user._id.toString();
  if(!owner) {
    return res.status(403).send("Unauthorized");
  }
  next();
}
