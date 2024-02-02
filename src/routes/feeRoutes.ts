import { Router, Request, Response } from "express";
import { FeeEventModel } from "../model/feeEvent";

const router = Router();

router.get("/events/:integrator", async (req: Request, res: Response) => {
  const integrator = req.params.integrator;

  try {
    const events = await FeeEventModel.find({ integrator }).exec();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
