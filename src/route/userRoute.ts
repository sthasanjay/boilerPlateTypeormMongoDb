import { userController } from "../controller/userLogic";
import { Router } from "express";

export function userRoute(): Router {
    const controller = new userController();
    const router = Router();

    router.post("/create", controller.create);
    router.get("/getAll", controller.getAll);

    return router;
}
