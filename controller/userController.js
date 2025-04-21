const {PrismaClient}=require("@prisma/client")
const prisma=new PrismaClient()
const {hashPassword,verifyPasword, generateToken, setAuthTokenCookie}=require("../utils/utility")


const signup=async (req,res) => {
    try {
        let {username,phone_number,email,password}=req.body
        if (!email || !password || !username || !phone_number) {
            return res.status(400).json({
                status: 400,
                message: "All fields are required"
            });
        }
        const findemail=await prisma.user.findUnique({
            where:{email:email}
        })
        if (findemail) {
           return res.status(409).json({
                status:409,
                message:"Email already exists"
            })
        }
        let hashedPassword=hashPassword(password)
        const create=await prisma.user.create({
            data:{
                username:username,
                email:email,
                phone_number:phone_number,
                password:hashedPassword,
            }
        })
        res.status(200).json({
            status:200,
            message:"User Created Successfully"
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            message:error.message
        })
    } 
}


const signinuser=async (req,res) => {
    try {
        let {email,password}=req.body
        const finduser=await prisma.user.findUnique({
            where:{email:email}
        })
        if (!finduser) {
            return res.status(404).json({
                status:404,
                message:"user not found check the email"
            })
        }
        const isPasswordValid = await verifyPasword(password, finduser.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                status: 400,
                message: "Invalid password."
            });
        }

        let token =generateToken({id:finduser.id,email:finduser.email,username:finduser.username})
        setAuthTokenCookie(res,token)
        const updatetoken=await prisma.user.update({
            where:{id:finduser.id},
            data:{
                token:token
            }
        })
        res.status(200).json({
            status:200,
            message:"Login Successfully",
            token:token
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            message:error.message
        })
    }
}

const Get_All_User=async (req,res) => {
    try {
        const response=await prisma.user.findMany()
        res.status(200).json({
            status:200,
            message:"Fetching User Success",
            data:response
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            message:"An Error Accurred",
            error:error
        })
    }
}



module.exports={
    signup,
    signinuser,
    Get_All_User
}
