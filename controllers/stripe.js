import User from '../models/user';
import Stripe from 'stripe';
import queryString from "query-string";
import Glamping from "../models/glamping";
import Order from '../models/order';

const stripe = Stripe(process.env.STRIPE_SECRET)

export const CreateConnectAccount = async(req, res) => {
  const user = await User.findById(req.user._id).exec();

  if(!user.stripe_account_id) {
    const account = await stripe.accounts.create({
      type: "express",
    });
    console.log("ACCOUNT ===>", account);
    user.stripe_account_id = account.id
    user.save();
  }

  let accountLinks = await stripe.accountLinks.create({
    account: user.stripe_account_id,
    refresh_url: process.env.STRIPE_REDIRECT_URL,
    return_url: process.env.STRIPE_REDIRECT_URL,
    type: 'account_onboarding',
  });

  accountLinks = Object.assign(accountLinks, {
    "stripe_user[email": user.email || undefined,
  });
  let link = `${accountLinks.url}?${queryString.stringify(accountLinks)}`
  console.log("LOGIN LINK", link)
  res.send(link);
}

const updateDelayDays = async(accountId) => {
  const account = await stripe.accounts.update(accountId, {
    settings: {
      payouts: {
        schedule: {
          delay_days: 7,
        },
      },
    },
  });
  return account;
}

export const getAccountStatus = async(req, res) => {
  // console.log('GET ACCOUNT STATUS')
  const user = await User.findById(req.user._id).exec();
  const account = await stripe.account.retrieve(user.stripe_account_id)
  // console.log('USER ACCOUNT RETRIEVE', account);

  const updatedAccount = await updateDelayDays(account.id);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      stripe_seller: updatedAccount,
    },
    { new: true }
  )
  .select('-password')
  .exec();
  res.json(updatedUser);
};

export const getAccountBalance = async(req, res ) => {
  const user = await User.findById(req.user._id).exec();

  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });
    console.log("BALANCE ===>", balance);
    res.json(balance);
  } catch(err) {
    console.log(err);
  }
};

export const payoutSetting = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_seller.id, 
      {
        redirect_url: process.env.STRIPE_SETTING_REDIRECT_URL
      }
    )
    console.log('LOGIN LINK FOR PAYOUT SETTING', loginLink)
    res.json(loginLink)
  } catch(err) {
    console.log('STRIPE PAYOUT SETTING',err)
  }
}

export const stripeSessionId = async(req, res) => {
  console.log('you hit stripe session id ', req.body.glampingId);

  const { glampingId } = req.body
  const item = await Glamping.findById(glampingId).populate('postedBy').exec();
  const fee = (item.price * 20) / 100;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        name: item.title,
        amount: item.price,
        currency: 'jpy',
        quantity: 1,
      },
    ],

    payment_intent_data: {
      application_fee_amount: fee,
      transfer_data: {
        destination: item.postedBy.stripe_account_id,
      },
    },
    success_url: `${process.env.STRIPE_SUCCESS_URL}/${item._id}`,
    cancel_url: process.env.STRIPE_CANCEL_URL,

  });

  await User.findByIdAndUpdate(req.user._id, {stripeSession: session}).exec()
  res.send({
    sessionId: session.id,
  })
};

export const stripeSuccess = async(req, res) => {
  try {

    const { glampingId } = req.body
  
    const user = await User.findById(req.user._id).exec()

    if(!user.stripeSession) return;

    const session = await stripe.checkout.sessions.retrieve(user.stripeSession.id);
    if(session.payment_status === 'paid') {
      const orderExist = await Order.findOne({'session.id': session.id }).exec();
      if(orderExist) {
        res.json({ success: true });
      } else {
        let newOrder = await new Order({
          glamping: glampingId,
          session,
          orderedBy: user._id
        }).save();
        await User.findByIdAndUpdate(user._id, {
          $set: {stripeSession: {}},
        });
        res.json({ success: true });
      }
    }
  } catch(err) {
    console.log('STRIPE SUCCESS ERR', err);
  }
};

