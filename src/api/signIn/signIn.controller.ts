import { Router } from "express";
import { logOut, signIn } from "./signIn.service";

const signInRouter = Router()

signInRouter.post('/signIn', (req,res) => signIn(req,res));

signInRouter.post('/logOut',(req,res) => logOut(req,res));

export default signInRouter