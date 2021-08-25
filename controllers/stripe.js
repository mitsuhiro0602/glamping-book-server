import User from '../models/user';
import Stripe from 'stripe';
import queryString from "query-string";

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