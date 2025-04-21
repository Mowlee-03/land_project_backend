const {PrismaClient}=require("@prisma/client")
const prisma=new PrismaClient()
const bcrypt=require("bcryptjs")
const {generateToken,setAuthTokenCookie,verifyToken}=require("../utils/utility")


const registerAdmin = async (req, res) => {
    try {
        const existingAdmin = await prisma.admin.findFirst();
        if (existingAdmin) {
            return res.status(403).json({ message: "Admin already exists. Creation of multiple admins is not allowed." });
        }
        let { username, email, password } = req.body;
        let salt = bcrypt.genSaltSync(10);
        let hashPassword = bcrypt.hashSync(password, salt);
        let regiterdata = await prisma.admin.create({
            data: {
                username: username,
                email: email,
                password: hashPassword,
                is_admin:true,
            },
        });

        if (regiterdata) {
            let token =generateToken({
                id:regiterdata.id,
            })

            let updatetoken = await prisma.admin.update({
                where: { id: regiterdata.id },
                data: { token: token },
            });
            res.json({
                status: 200,
                message: "Registered successfully",
                data: updatetoken, 
            });
        }
    } catch (error) {
        console.error(error);
        res.json({
            status: 500,
            message: error.message,
        });
    }
};
 
const loginAdmin=async (req,res)=>{
    try {
        const {email,password}=req.body
       const admin=await prisma.admin.findUnique({
        where:{email:email}
       })
       if (!admin) {
        return res.status(404).json({
            status:404,
            message:"Enter email correctly"
        })
       }
        const validatePassword=await bcrypt.compare(password,admin.password)
        if (!validatePassword) {
            return res.status(401).json({
                status:401,
                message:"Invalid Password"
            })
       }
       const Token =generateToken({id:admin.id,email:admin.email,name:admin.username,is_admin:admin.is_admin})
       setAuthTokenCookie(res,Token)

       const updateToken=await prisma.admin.update({
        where:{id:admin.id},
        data:{
            token:Token
        }
       })
       if (updateToken) {
        return res.status(200).json({
            message:"Login Successfull",
            authToken:Token
        })
       }
    } catch (error) {
        res.status(500).json({
            status:500,
            message:error.message
          })
    }
}

const logoutadmin=async (req,res) => {
    try {
        const {adminId}=req.params
        // Clear the authentication token cookie
        res.clearCookie("authToken");
        // Optional: Invalidate the token in the database
        await prisma.admin.update({
            where: { id: parseInt(adminId) },
            data: { token: null }
        });

        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            message: "An error occurred during logout."
        });
    }
}

const addCategory=async (req,res) => {
    try {
        const {adminId}=req.params
        const {name,description,image}=req.body
        
        const token = req.cookies.authToken;
        console.log("Extracted token",token);
        if (!token) {
        return res.status(401).json({
            status: 401,
            message: "Authentication required",
        });
        }
        const decode=verifyToken(token)
        console.log("Decoded Token:",decode);
        if (!decode.is_admin) {
        return res.status(403).json({
            status: 403,
            message: "You are not authorized to perform this action",
        })
        }
        const admin=await prisma.admin.findUnique({
            where:{id:parseInt(adminId)}
        })

        if (!admin) {
            return res.status(404).json({
                status:404,message:"Admin Not Found"
            })
        }
        await prisma.category.create({
            data:{
                name:name,
                discription:description,
                image:image,
                adminId:parseInt(adminId)
            }
        })
        res.status(200).json({
            status:200,
            message:"Category Added Successfully"
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            message:error.message
        })
    }
}

const addDistrict=async (req,res) => {
    try {
        const {adminId}=req.params
        const {name}=req.body

        console.log(name,adminId);
        
        const token = req.cookies.authToken;
        console.log("Extracted token",token);
        if (!token) {
        return res.status(401).json({
            status: 401,
            message: "Authentication required",
        });
        }
        const decode=verifyToken(token)
        console.log("Decoded Token:",decode);
        if (!decode.is_admin) {
        return res.status(403).json({
            status: 403,
            message: "You are not authorized to perform this action",
        })
        }
        const admin=await prisma.admin.findUnique({
            where:{id:parseInt(adminId)}
        })

        if (!admin) {
            return res.status(404).json({
                status:404,message:"Admin Not Found"
            })
        }
        await prisma.district.create({
            data:{
                name:name,
                adminId:parseInt(adminId)
            }
        })
        res.status(200).json({
            status:200,
            message:"District Added Successfully"
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            message:error.message
        })
    }
}

const getDistict=async (req,res) => {
    try {
        
        const categoryname=await prisma.district.findMany({
            select:{name:true}
        })
        res.status(200).json({
            status:200,
            message:"Success",
            data:categoryname
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            message:error.message
        })
    }
  }
  
  
  const  getCategory=async (req,res) => {
    try {
        const categoryname=await prisma.category.findMany({
            select:{
              name:true,
              discription:true,
              image:true
            }
        })
        res.status(200).json({
            status:200,
            message:"Success",
            data:categoryname
        })
    } catch (error) {
        res.status(500).json({
            status:500,
            message:error.message
        })
    }
  }
  
  const getcategorycountProperties=async (req,res) => {
    try {
        const response=await prisma.category.findMany({
            select:{
                id:true,
                name:true,
                discription:true,
                image:true,
                
                _count: {
                    select: {
                      posts: true,
                    },
                }
            },
            
        })

        res.status(200).json({
            status:200,
            message:"fetching success",
            data:response
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            message:"An internal server error",
            error:error.message
        })
    }
  }
  const getDistrictcountProperties=async (req,res) => {
    try {
        const response=await prisma.district.findMany({
            select:{
                id:true,
                name:true,   
                _count: {
                    select: {
                      posts: true,
                    },
                }
            },
            
        })

        res.status(200).json({
            status:200,
            message:"fetching success",
            data:response
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            message:"An internal server error",
            error:error.message
        })
    }
  }
  const getPropertiescount=async (req,res) => {
    try {
        const response=await prisma.post.findMany({
            select:{
                id:true,
                createdAt:true,
                isSold:true
    }})

        res.status(200).json({
            status:200,
            message:"fetching success",
            data:response
        })
    } catch (error) {
        return res.status(500).json({
            status:500,
            message:"An internal server error",
            error:error.message
        })
    }
  }

module.exports={
    registerAdmin,
    loginAdmin,
    logoutadmin,
    addCategory,
    addDistrict,
    getCategory,
    getDistict,
    getcategorycountProperties,
    getDistrictcountProperties,
    getPropertiescount
    
}