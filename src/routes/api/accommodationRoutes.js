import express from "express";
import Accommodation from "../../controllers/accommodationController";
import method from "../../utils/method";

const router = express();

router
  .route("/")
  .get(Accommodation.getAccommodations)
  .post(Accommodation.createAccommodation)
  .all(method);

router.route("/rooms")
.post(Accommodation.createRoom)
.all(method);

router
  .route("most-travelled-destination")
  .get(Accommodation.getMostTravelledDestination);

export default router;
