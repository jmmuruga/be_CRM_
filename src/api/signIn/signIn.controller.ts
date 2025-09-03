import { Router } from "express";
import { signIn } from "./signIn.service";

const signInRouter = Router()

signInRouter.post('/signIn' , (req,res) => signIn(req,res));

export default signInRouter