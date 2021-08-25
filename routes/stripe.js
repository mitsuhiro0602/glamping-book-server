import express from 'express';

// controllers
import {CreateConnectAccount} from '../controllers/stripe'

// midlleware
import { requireSignin } from '../middlewares';

const router = express.Router();

router.post('/create-connect-account', requireSignin, CreateConnectAccount);
module.exports = router;