import {Request,Response, NextFunction } from "express";
import dotenv from"dotenv"
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"
dotenv.config()
export interface auhtReq extends Request{
    userId? : number
}

export async function auth(req:auhtReq ,res:Response ,next:NextFunction){
const token = req.headers["token"] as string
if(!token){
    res.json({
        msg: "token not found"
    })
}

const decode =  jwt.verify(token , process.env.JWT_SECRET as string) as JwtPayload

if(!decode){
    res.json({
        msg : "you are not authorised"
    })
}else{
    req.userId = decode.id
    next()
}
}

export function adminAuth(req:Request , res : Response , next : NextFunction){
const token = req.headers["token"] as  string;
if(!token){
    res.json({
        msg: "token not found"
    })
}

const decode =  jwt.verify(token , process.env.JWT_ADMIN_SECRET as string) as JwtPayload

if(!decode){
    res.json({
        msg : "you are not authorised"
    })
}else{
    next()
}
}