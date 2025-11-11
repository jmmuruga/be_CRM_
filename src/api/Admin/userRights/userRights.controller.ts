import { Router } from "express";
import { auth } from "../../../shared/helper";
import { addUpdateUserRights } from "./userRights.service";

const userRightsRouter = Router();

userRightsRouter.post("/addUpdateUserRights", auth, (req, res) => addUpdateUserRights(req, res));

export default userRightsRouter;
