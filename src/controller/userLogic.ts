// import { validateBodyInput } from "../helpers/controller/index";
import { UserDao } from "../dao/userDao";
import { NextFunction, Request, Response } from "express";
import { UserCreate } from "./dataClass/userDataClass";
import { validateBodyInput } from "../helpers/controller";
import * as fs from "fs";
import * as path from "path";

export class userController {
    userDao = new UserDao();
    /**
   @desc Create State
   @route POST /api/user/create
   @access private
   **/

    create = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<any> => {
        const { validatedData: validBody, errors } = await validateBodyInput(
            req,
            UserCreate,
        );
        if (errors) return res.status(400).json(errors);

        const results = await this.userDao.create(validBody);
        console.log("re,", req.body);
        res.status(200).json({
            status: "Success",
            data: results,
        });
    };

    getAll = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<any> => {
        const userInfo = await this.userDao.findAll();
        res.status(200).json({
            status: "Success",
            data: userInfo,
        });
    };
}
