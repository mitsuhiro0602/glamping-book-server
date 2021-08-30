const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
  // res.set({ 'Access-Control-Allow-Origin': '*' });
  try {
    // console.log(req.body);
    const {name, email, password} = req.body;
    // validation
    if(!name) return res.status(400).send('Name is required')
    if(!password || password.length < 6)
      return res
        .status(400)
        .send('Password is required and should be min 6 characters long');
    let userExist = await User.findOne({email}).exec()
    if(userExist) return res.status(400).send('Email is taken')
    // register
    const user = new User(req.body)

    await user.save();
    console.log('USER CREATED', user)
    return res.json({ ok: true });
  } catch (err) {
    console.log('CREATE USER FAILD', err)
    return res.status(400).send('Error. Try again.')
  }
};

exports.login = async(req, res) => {
  try {
    const { email, password} = req.body;
    // check if user with that email exist
    let user = await User.findOne({email}).exec();
    // console.log('USER EXIST', user);
    if(!user) return res.status(400).send('User with that email not found');
    // compare password
    user.comparePassword(password, (err, match) => {
      console.log('COMPARE PASSWORD IN LOGIN ERR', err)
      if(!match || err) return res.status(400).send("Wrong password");
      // GENERATE A TOKEN THEN SENDS AS RESPONSE TO CLIENT
      let token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          stripe_account_id: user.stripe_account_id,
          stripe_seller: user.stripe_seller,
          stripeSession: user.stripeSession
        },
      });
    });
  } catch(err) {
    console.log('LOGIN ERROR', err)
    res.status(400).send('Signin faild');
  }
}