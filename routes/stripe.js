import express from 'express';

// controllers
import {
  CreateConnectAccount,
  getAccountStatus,
  getAccountBalance,
  payoutSetting
} from '../controllers/stripe'

// midlleware
import { requireSignin } from '../middlewares';

const router = express.Router();

router.post('/create-connect-account', requireSignin, CreateConnectAccount);
router.post('/get-account-status', requireSignin, getAccountStatus)
router.post('/get-account-balance', requireSignin, getAccountBalance)
router.post('/payout-setting', requireSignin, payoutSetting)

module.exports = router;

