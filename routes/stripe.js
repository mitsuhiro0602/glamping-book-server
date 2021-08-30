const express = require('express');

// controllers
const {
  CreateConnectAccount,
  getAccountStatus,
  getAccountBalance,
  payoutSetting,
  stripeSessionId,
  stripeSuccess
} = require('../controllers/stripe')

// midlleware
const { requireSignin } = require('../middlewares');

const router = express.Router();

router.post('/create-connect-account', requireSignin, CreateConnectAccount);
router.post('/get-account-status', requireSignin, getAccountStatus)
router.post('/get-account-balance', requireSignin, getAccountBalance)
router.post('/payout-setting', requireSignin, payoutSetting)
router.post('/stripe-session-id/', requireSignin, stripeSessionId)

// order
router.post('/stripe-success', requireSignin, stripeSuccess);

module.exports = router;

