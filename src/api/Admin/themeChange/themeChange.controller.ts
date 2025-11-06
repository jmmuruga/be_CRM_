import { Router } from "express";
import { addUpdateCustomizeTheme, getCustomizedTheme } from "./themeChange.service";


const customizeThemeRouter = Router();

customizeThemeRouter.post("/addUpdateTheme", (req, res) => addUpdateCustomizeTheme(req, res));

customizeThemeRouter.get("/getCustomizedTheme/:userId/:companyId", (req, res) => getCustomizedTheme(req, res));

export default customizeThemeRouter;
