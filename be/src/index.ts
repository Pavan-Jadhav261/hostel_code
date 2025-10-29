import express, { Response } from "express"
import bcypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"
import dotenv from"dotenv"
import { adminAuth, auhtReq, auth } from "./middleware";
import { getTime } from "./util";
import cors from "cors"
import QRCode from "qrcode";

dotenv.config()


const Client = new PrismaClient()

const app = express();

app.use(express.json())

app.use(cors())


app.post("/ping",(req,res)=>{
    res.json({
        msg : "ping"
    })
})

app.post("/signup",async(req,res)=>{
    const usn = req.body.usn
    const password  = req.body.password
    const hashPwd = await bcypt.hash(password , 5)
    

    const isUser = await Client.users.findFirst({
        where:{
            usn : usn
        }
    })
    if(isUser != null){
        res.json({
    msg :"User already exist "
      })
        return;
      }


    const response = await  Client.users.create({
        data:{
            usn : usn,
            password : hashPwd
        }
    })
    if(!response){
        res.json({
            msg : "cannot signup"
        })
    }
    res.json({
        msg : "Signup suscessfull"
    })
})

app.post("/login",async(req,res)=>{
    const usn = req.body.usn
    const password = req.body.password

    const response = await Client.users.findFirst({
        where:{
            usn : usn
        }
    })

    if(!response){
        res.json({
            msg : "Sgnup first"
        })
        return;
    }
    const hashPassword = response.password

    const isPwdTru = await bcypt.compare(password,hashPassword)

    if(!isPwdTru){
        res.json({
            msg : "incorrect credintials"
        })
    }else{
        let token = "";
        token = jwt.sign({
            id : response.id,
            role : response.role
        },process.env.JWT_SECRET  as string)

        res.json({
            token : token
        })
    }
})


app.post("/details" , auth , async(req : auhtReq,res : Response)=>{
    const userId  = req.userId
    const {name ,phoneNo ,roomNo } = req.body

    if(!userId){
       return res.json({
            msg :  "user not found"
        })
        
    }
try{
    const response = await Client.details.create({
        data:{
            name : name,
            phoneNo : phoneNo,
            roomNo : roomNo,
            usersId : userId
        }
    })

    if(!response){
        res.json({
            msg : "cannot update your detaiails"
        })
    }else  {
        return res.json({
            msg : "Added your details successfully"
        })
    }
}
catch(e){
    res.json({
        msg : "your details already exist"
    })
}
})

app.get("/details" , auth , async(req:auhtReq,res:Response)=>{
const userId = req.userId
if(!userId) {
    res.json({
        msg : "userID not found"
    })
    return;
}
const response = await Client.details.findFirst({
    where:{
        usersId : userId
    }
})
const name = response?.name
const phoneNo  = response?.phoneNo
const roomNo = response?.roomNo
res.json({
    name : name,
    phoneNo: phoneNo,
    roomNo: roomNo
})
})

app.post("/outing", auth , async (req : auhtReq,res : Response)=>{
    const userId = req.userId
    const getTimeNow = getTime();

if(!userId) {
    res.json({
        msg : "user not found"
    })
    return;
}

const isUser = await Client.inOutDetails.findFirst({
    where : {
        userId : userId
    }
})

if(!isUser){
    const response = await Client.inOutDetails.create({
        data:{
            userId  : userId, 
            OutTime : getTimeNow,
            isOut:true,
            InTime : null
        }
    })
    res.json({
        msg  : "user is outside campus"
    })
}

else{
    const isUserOut = isUser.isOut
    if(isUserOut){
        const response  = await Client.inOutDetails.update({
            where : {
                userId : userId
            },data:{
                isOut:false,
                InTime : getTimeNow
            }
        })
        res.json({
            msg : "user is inside campus"
        })
    }else if(!isUserOut){
        const response = await Client.inOutDetails.update({
            where:{userId:userId},data:{
                isOut : true,
                OutTime  : getTimeNow,
                InTime: null
            }
        })
        res.json({
            msg : "user went out"
        })
    }

}
})

app.get("/outStudents" ,adminAuth, async(req,res)=>{

    const outStds = await Client.inOutDetails.findMany({
        where:{
            isOut : true
        }
    })
    if(outStds.length === 0) {res.json({
        msg  : "no student is out"
    })
     return;
    }
const details = await Promise.all( outStds.map(async (val)=>{
   return await Client.details.findFirst({
        where:{
            usersId : val.userId
        }
    })
    res.json({
        details : details
    })
})
)
   

    res.json({
        msg:details
    
    })
})

app.post("/adminLogin", async(req,res)=>{
    const usn = req.body.usn;
    const password  = req.body.password;
    

    const response = await Client.users.findFirst({
        where:{
            usn : usn,
            role : "admin"
        }
    })

    if(!response){
        res.json({
            msg : "You are not admin"
        })
        return;
    }
    const DbPassword = response.password
let isPwdTru
   if(DbPassword === password)
   {
     isPwdTru  = true
   }

    if(!isPwdTru){
        res.json({
            msg : "incorrect credintials"
        })
    }else{
        let token = "";
        token = jwt.sign({
            id : response.id,
            role : response.role
        },process.env.JWT_ADMIN_SECRET as string)

        res.json({
            token : token
        })
    }
} )

app.post("/generateQR",adminAuth, async (req, res) => {
  const data  = "http://localhost:3000/outing";

  if (!data) {
    return res.status(400).json({ error: "Please provide 'data' in request body" });
  }

  try {
    // Generate a data URL (base64 PNG image)
    const qrImageUrl = await QRCode.toDataURL(data, { width: 300, margin: 2 });

    // Send the base64 image
    res.json({ qrImageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});


app.listen(3000,"0.0.0.0")