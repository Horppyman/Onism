import { Router } from "express";
import accommodationRoutes from "./accommodationRoutes";

const router = Router();

router.use("/accommodations", accommodationRoutes);

router.use((err, req, res, next) => {
  if (err.name === "jsonWebTokenError") {
    return res.status(400).json({
      status: 400,
      errors: "Server can't handle the request",
    });
  }

  return next(err);
});

export default router;
