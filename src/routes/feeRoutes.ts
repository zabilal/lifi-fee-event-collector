// src/routes/feeRoutes.ts
import express, { Request, Response } from 'express';
import { FeeEventModel } from '../model/feeEvent';
import {startScan, stopProcess} from "../service/eventService";

const router = express.Router();

router.post('/events', async (req: Request, res: Response) => {
    const data = req.body;
    try {
        if (!data.hasOwnProperty("action")){
            res.status(400).json({message: "An Action Property is required"});
            return;
        }
        if (data.action == "INIT"){
            startScan(data);
            res.json("Event scanning started");
            return;
        }
        stopProcess();
        res.json("Events Saved and Process Stopped");
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/events/:integrator', async (req: Request, res: Response) => {
    const { integrator } = req.params;
    try {
        const events = await FeeEventModel.find({ integrator });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
