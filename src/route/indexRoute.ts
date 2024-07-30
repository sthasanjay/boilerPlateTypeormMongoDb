import { Router } from "express";
import { userRoute } from "./userRoute";

export function controllerRouter(): Router {
    const apiRouter = Router();

    apiRouter.use("/user", userRoute());
    return apiRouter;
}
