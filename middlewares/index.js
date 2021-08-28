import expressJwt from 'express-jwt';
import Glamping from '../models/glamping'

// req.user
export const requireSignin = expressJwt({
  // secret, expiryDate
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
})

export const glampingOwner = async(req, res, next) => {
  let glamping = await Glamping.findById(req.params.glampingId).exec()
  let owner = glamping.postedBy._id.toString() === req.user._id.toString();
  if(!owner) {
    return res.status(403).send("Unauthorized");
  }
  next();
}
