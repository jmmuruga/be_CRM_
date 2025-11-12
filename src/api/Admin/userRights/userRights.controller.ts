import { Router } from "express";
import { auth } from "../../../shared/helper";
import { addUpdateUserRights, getUserRights } from "./userRights.service";

const userRightsRouter = Router();

userRightsRouter.post("/addUpdateUserRights", auth, (req, res) => addUpdateUserRights(req, res));

userRightsRouter.get("/getUserRights/:userTypeId/:companyId", auth, (req, res) => getUserRights(req, res));

export default userRightsRouter;


