const { PrismaClient } = require("@prisma/client");
const { verifyToken } = require("../utils/utility");
const bucket = require("../auth/firebaseConfig");
const prisma = new PrismaClient();


const deleteImages = async (req, res) => {
  try {
    const { imageUrls } = req.body;


    // Validate input
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ status: 400, message: 'imageUrls must be a non-empty array' });
    }
    

    // Helper function to extract file path from Firebase Storage URL
    const getFilePathFromUrl = (url) => {
      try {
        const urlObj = new URL(url);
        // Extract the path after the bucket name
        const bucketPrefix = `/${bucket.name}/`;
        const pathStart = urlObj.pathname.indexOf(bucketPrefix) + bucketPrefix.length;
        const filePath = urlObj.pathname.substring(pathStart);
        if (!filePath) throw new Error('Invalid Firebase Storage URL');
        return decodeURIComponent(filePath);
      } catch (error) {
        throw new Error(`Failed to parse URL: ${error.message}`);
      }
    };

    // Delete images from Firebase Storage
    const deletionResults = await Promise.all(
      imageUrls.map(async (url) => {
        try {
          const filePath = getFilePathFromUrl(url);
          console.log('Deleting file:', filePath);
          await bucket.file(filePath).delete();
          return { url, status: 'success' };
        } catch (error) {
          return { url, status: 'failed', error: error.message };
        }
      })
    );

    const failedDeletions = deletionResults.filter((result) => result.status === 'failed');
    if (failedDeletions.length > 0) {
      return res.status(207).json({
        status: 207,
        message: 'Some images failed to delete',
        results: deletionResults,
      });
    }

    res.status(200).json({
      status: 200,
      message: 'All images deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting images:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to delete images',
      details: error.message,
    });
  }
};



const createPost = async (req, res) => {
  try {
    const { adminId } = req.params;
    const postData = req.body;

    // Validate required fields
    if (!postData.title || !postData.price || !postData.location || !postData.description) {
      return res.status(400).json({ status: 400, message: "All fields are required" });
    }

    // Authenticate the user
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ status: 401, message: "Authentication required" });
    }

    let decode;
    try {
      decode = verifyToken(token);
    } catch (err) {
      return res.status(403).json({ status: 403, message: "Invalid token" });
    }

    if (!decode.is_admin) {
      return res.status(403).json({ status: 403, message: "You are not authorized" });
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(adminId) },
    });

    if (!admin) {
      return res.status(404).json({ status: 404, message: "Admin not found" });
    }

    const post = await prisma.post.create({
      data: {
        title: postData.title,
        description: postData.description, // ✅ Fix: Ensure "discription" exists
        price: parseFloat(postData.price),
        image: postData.images, // ✅ Fix: Ensure image paths are stored
        location: postData.location,
        bedroom: parseInt(postData.bedroom) || 0,
        bathroom: parseInt(postData.bathroom) || 0,
        area:postData.area,
        type: postData.type,
        category_name: postData.category,
        district_name: postData.district,
        adminId: parseInt(adminId),
      },
    });

    res.status(201).json({
      status: 201,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: error.message });
  }
};




const viewAllpost=async (req,res) => {
  try {
    const viewdata=await prisma.post.findMany()
    if (!viewdata) {
      return res.status(404).json({
        status:404,
        message:"Not found"
      })
    }
    
    res.status(200).json({
      status:200,
      message:"success",
      data:viewdata
    })
  } catch (error) {
    
  }
}

const viewOnepost=async (req,res) => {
  try {
    const {postId}=req.params
    const post =await prisma.post.findUnique({
      where:{id:parseInt(postId)},
    })
    if (!post) {
      return res.status(404).json({
        status:404,
        message:"post not found"
      })
    }
    res.status(200).json({
      status:200,
      message:"success",
      data:post,
    })
  } catch (error) {
    res.status(500).json({
      status:500,
      message:error.message
    })
  }
}

const updatePost=async (req,res) => {
  try {
    let {postId}=req.params
    let updateData=req.body
    let token=req.cookies.authToken
    let decode=verifyToken(token)
    if (!decode.is_admin) {
      return res.status(403).json({
        status:403,
        message:"Unauthorized"
      })
    }
    const findpost=await prisma.post.findUnique({where:{id:parseInt(postId)}})
    if (!findpost) {
      return res.status(404).json({
        status:404,
        message:"Post not Found"
      })
    }
    const update=await prisma.post.update({
      where:{id:parseInt(postId)},
      data:updateData
    })
    res.status(200).json({
      status:200,
      message:"update success",
      data:update
    })
  } catch (error) {
    res.status(500).json({
      status:500,
      message:error.message
    })
  }
}

const deletePost=async (req,res) => {
  try {
    let {postId}=req.params
    let token=req.cookies.authToken
    let decode=verifyToken(token)
    if (!decode.is_admin) {
      return res.status(403).json({
        status:403,
        message:"Unauthorized"
      })
    }
    await prisma.post.delete({
      where:{id:parseInt(postId)}
    })
    res.status(200).json({
      status:200,
      message:"Post Delleted Successfully"
    })
  } catch (error) {
    res.status(500).json({
      status:500,
      message:error.message
    })
  }
}


const soldPropertytoggle=async (req,res) => {
  try {
    const {postId}=req.params
    let token=req.cookies.authToken
    let decode=verifyToken(token)
    if (!decode.is_admin) {
      return res.status(403).json({
        status:403,
        message:"Unauthorized"
      })
    }
    const property = await prisma.post.findUnique({
      where: { id: postId },
      select: { isSold: true }, // Only fetch isSold field
    })
  
    if (!property) {
      return res.status(404).json({
        status:404,
        message:"Not found"
      })
    }
    await prisma.post.update({
      where: { id: postId },
      data: { isSold: !property.isSold },
    })
    res.status(200).json({
      status:200,
      message:"Sold"
    })
  } catch (error) {
    res.status(500).json({
      status:500,
      message:error.message
    })
  }
}


const Propertycounts=async (req, res) => {
  try {
    // Fetch sold & available counts
    const counts = await prisma.post.groupBy({
      by: ['isSold'],
      _count: { id: true },
    })

    // Extract counts
    const soldCount = counts.find(c => c.isSold)?._count.id || 0
    const availableCount = counts.find(c => !c.isSold)?._count.id || 0

    // Fetch total properties count
    const totalCount = await prisma.post.count()

    res.status(200).json({ 
      status:200,
      data:{ 
        soldCount, 
        availableCount, 
        totalCount 
      }
     })

  } catch (error) {
    res.status(500).json({ 
      status:500,
      message: 'Failed to fetch property counts' 
    })
  }
}



module.exports = { 
    createPost ,
    viewAllpost,
    viewOnepost,
    updatePost,
    deletePost,
    soldPropertytoggle,
    Propertycounts,
    deleteImages
};
