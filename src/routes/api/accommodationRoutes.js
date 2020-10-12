import express from "express";
import Accommodation from '../../controllers/accommodationController'
import method from '../../utils/method'

const router = express();

router
  .route('/')
  .get(verify, Accommodation.getAccommodations)
  .post(
    verify,
    Access.isAllowedUser,
    accommodationValidation.validateAccommodation,
    Accommodation.createAccommodation
  )
  .all(method);


export default router;