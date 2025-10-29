"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const middleware_1 = require("./middleware");
const util_1 = require("./util");
const cors_1 = __importDefault(require("cors"));
const qrcode_1 = __importDefault(require("qrcode"));
dotenv_1.default.config();
const Client = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/signup", async (req, res) => {
    const usn = req.body.usn;
    const password = req.body.password;
    const hashPwd = await bcrypt_1.default.hash(password, 5);
    const isUser = await Client.users.findFirst({
        where: {
            usn: usn
        }
    });
    if (isUser != null) {
        res.json({
            msg: "User already exist "
        });
        return;
    }
    const response = await Client.users.create({
        data: {
            usn: usn,
            password: hashPwd
        }
    });
    if (!response) {
        res.json({
            msg: "cannot signup"
        });
    }
    res.json({
        msg: "Signup suscessfull"
    });
});
app.post("/login", async (req, res) => {
    const usn = req.body.usn;
    const password = req.body.password;
    const response = await Client.users.findFirst({
        where: {
            usn: usn
        }
    });
    if (!response) {
        res.json({
            msg: "Sgnup first"
        });
        return;
    }
    const hashPassword = response.password;
    const isPwdTru = await bcrypt_1.default.compare(password, hashPassword);
    if (!isPwdTru) {
        res.json({
            msg: "incorrect credintials"
        });
    }
    else {
        let token = "";
        token = jsonwebtoken_1.default.sign({
            id: response.id,
            role: response.role
        }, process.env.JWT_SECRET);
        res.json({
            token: token
        });
    }
});
app.post("/details", middleware_1.auth, async (req, res) => {
    const userId = req.userId;
    const { name, phoneNo, roomNo } = req.body;
    if (!userId) {
        return res.json({
            msg: "user not found"
        });
    }
    try {
        const response = await Client.details.create({
            data: {
                name: name,
                phoneNo: phoneNo,
                roomNo: roomNo,
                usersId: userId
            }
        });
        if (!response) {
            res.json({
                msg: "cannot update your detaiails"
            });
        }
        else {
            return res.json({
                msg: "Added your details successfully"
            });
        }
    }
    catch (e) {
        res.json({
            msg: "your details already exist"
        });
    }
});
app.get("/details", middleware_1.auth, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.json({
            msg: "userID not found"
        });
        return;
    }
    const response = await Client.details.findFirst({
        where: {
            usersId: userId
        }
    });
    const name = response?.name;
    const phoneNo = response?.phoneNo;
    const roomNo = response?.roomNo;
    res.json({
        name: name,
        phoneNo: phoneNo,
        roomNo: roomNo
    });
});
app.post("/outing", middleware_1.auth, async (req, res) => {
    const userId = req.userId;
    const getTimeNow = (0, util_1.getTime)();
    if (!userId) {
        res.json({
            msg: "user not found"
        });
        return;
    }
    const isUser = await Client.inOutDetails.findFirst({
        where: {
            userId: userId
        }
    });
    if (!isUser) {
        const response = await Client.inOutDetails.create({
            data: {
                userId: userId,
                OutTime: getTimeNow,
                isOut: true,
                InTime: null
            }
        });
        res.json({
            msg: "user is outside campus"
        });
    }
    else {
        const isUserOut = isUser.isOut;
        if (isUserOut) {
            const response = await Client.inOutDetails.update({
                where: {
                    userId: userId
                }, data: {
                    isOut: false,
                    InTime: getTimeNow
                }
            });
            res.json({
                msg: "user is inside campus"
            });
        }
        else if (!isUserOut) {
            const response = await Client.inOutDetails.update({
                where: { userId: userId }, data: {
                    isOut: true,
                    OutTime: getTimeNow,
                    InTime: null
                }
            });
            res.json({
                msg: "user went out"
            });
        }
    }
});
app.get("/outStudents", middleware_1.adminAuth, async (req, res) => {
    const outStds = await Client.inOutDetails.findMany({
        where: {
            isOut: true
        }
    });
    if (outStds.length === 0) {
        res.json({
            msg: "no student is out"
        });
        return;
    }
    const details = await Promise.all(outStds.map(async (val) => {
        return await Client.details.findFirst({
            where: {
                usersId: val.userId
            }
        });
    }));
    res.json({
        msg: details
    });
});
app.post("/adminLogin", async (req, res) => {
    const usn = req.body.usn;
    const password = req.body.password;
    const response = await Client.users.findFirst({
        where: {
            usn: usn,
            role: "admin"
        }
    });
    if (!response) {
        res.json({
            msg: "You are not admin"
        });
        return;
    }
    const DbPassword = response.password;
    let isPwdTru;
    if (DbPassword === password) {
        isPwdTru = true;
    }
    if (!isPwdTru) {
        res.json({
            msg: "incorrect credintials"
        });
    }
    else {
        let token = "";
        token = jsonwebtoken_1.default.sign({
            id: response.id,
            role: response.role
        }, process.env.JWT_ADMIN_SECRET);
        res.json({
            token: token
        });
    }
});
app.post("/generateQR", middleware_1.adminAuth, async (req, res) => {
    const data = "http://localhost:3000/outing";
    if (!data) {
        return res.status(400).json({ error: "Please provide 'data' in request body" });
    }
    try {
        // Generate a data URL (base64 PNG image)
        const qrImageUrl = await qrcode_1.default.toDataURL(data, { width: 300, margin: 2 });
        // Send the base64 image
        res.json({ qrImageUrl });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate QR code" });
    }
});
// Optional route for testing
app.listen(3000, "0.0.0.0");
//# sourceMappingURL=index.js.map