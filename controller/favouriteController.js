const {PrismaClient}=require("@prisma/client")
const prisma=new PrismaClient()


// Add a post to user's favourites
const addFavourite=async (req,res) =>{
    const { userId, postId } = req.body;
    
    try {
      // Check if the post already exists in the user's favourites
      const existingFavourite = await prisma.favourite.findFirst({
        where: {
          userId: userId,
          postId: postId,
        },
      });

      if (existingFavourite) {
        return res.status(400).json({ message: "Post is already in favourites." });
      }

      // Create a new favourite entry
      const favourite = await prisma.favourite.create({
        data: {
          userId: userId,
          postId: postId,
        },
      });

      res.status(201).json({ message: "Post added to favourites.", favourite });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  // Get all favourite posts of a user
  const getUserFavourites=async (req, res)=> {
    const { userId } = req.params;

    try {
      const favourites = await prisma.favourite.findMany({
        where: { userId: parseInt(userId) },
        include: {
          post: true, // Include post details
        },
      });

      res.status(200).json(favourites);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  // Remove a post from user's favourites
  const removeFavourite=async(req,res) =>{
    const { userId, postId } = req.body;
console.log(userId,postId);

    try {
      const favourite = await prisma.favourite.findFirst({
        where: {
          userId: userId,
          postId: postId,
        },
      });


      if (!favourite) {
        return res.status(404).json({ message: "Favourite not found." });
      }

      await prisma.favourite.delete({
        where: { id: favourite.id },
      });

      res.status(200).json({ message: "Post removed from favourites." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  }


  module.exports={
    addFavourite,
    getUserFavourites,
    removeFavourite
  }