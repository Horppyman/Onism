import express from "express";
import Accommodation from "../../controllers/accommodationController";
import Review from "../../controllers/reviewController";
import method from "../../utils/method";
import accommodationValidation from "../../validation/accommodationValidation";
import feedbackValidation from "../../validation/feedbackValidation";

const router = express();

router
  .route("/")
  .get(Accommodation.getAccommodations)
  .post(
    accommodationValidation.validateAccommodation,
    Accommodation.createAccommodation
  )
  .all(method);

router
  .route("/rooms")
  .post(accommodationValidation.validateRoomData, Accommodation.createRoom)
  .all(method);

router
  .route("most-travelled-destination")
  .get(Accommodation.getMostTravelledDestination);

router
  .route("/:id")
  .get(
    accommodationValidation.validateGetOneAccommodation,
    Accommodation.getAccommodationById
  )
  .all(method);

router
  .route("/:id/like")
  .patch(
    accommodationValidation.validateGetOneAccommodation,
    Accommodation.likeOrUnlike
  )
  .all(method);

router
  .route("/:id/feedback")
  .post(feedbackValidation.validateFeedbackData, Review.addedFeedback)
  .all(method);

export default router;
