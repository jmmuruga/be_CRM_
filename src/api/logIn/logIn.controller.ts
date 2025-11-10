import { Router } from "express";
import { logIn, logOut } from "./logIn.service";

const logInRouter = Router()

logInRouter.post('/logIn', (req,res) => logIn(req,res));

logInRouter.post('/logOut',(req,res) => logOut(req,res));


export default logInRouter