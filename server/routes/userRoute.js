import express from 'express';
import { bookVisit, cancelBooking, createUser, forgotPassword, getAllBookings, getAllFavourites, loginUser, toFav, verifyOTPAndResetPassword } from '../controllers/userCntrl.js';
import jwtCheck from '../config/auth0Config.js';

const router = express.Router()

router.post("/register", jwtCheck, createUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP", verifyOTPAndResetPassword);
router.post("/bookVisit/:id", jwtCheck, bookVisit)
router.post("/allBookings", getAllBookings)
router.post("/removeBooking/:id", jwtCheck, cancelBooking)
router.post("/toFav/:rid", jwtCheck, toFav)
router.post("/allFav", jwtCheck, getAllFavourites)

export {router as userRoute}