import { Router } from "express";
import { addUpdateCustomizeTheme, getCustomizedTheme } from "./themeChange.service";
import { auth } from "../../../shared/helper";


const customizeThemeRouter = Router();

customizeThemeRouter.post("/addUpdateTheme", auth ,(req, res) => addUpdateCustomizeTheme(req, res));

customizeThemeRouter.get("/getCustomizedTheme/:userId/:companyId", auth ,(req, res) => getCustomizedTheme(req, res));

export default customizeThemeRouter;
