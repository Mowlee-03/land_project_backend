const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET: Fetch commission by postId
const getCommissionByPostId = async (req, res) => {
  const { postId } = req.params;
  try {
    const commission = await prisma.commission.findFirst({
      where: { postId: parseInt(postId) },
    });
    res.status(200).json({ success: true, data: commission });
  } catch (error) {
    console.error('Error fetching commission:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST: Create a new commission
const createCommission = async (req, res) => {
  const { postId, amount, notes } = req.body;
  try {
    const newCommission = await prisma.commission.create({
      data: {
        postId: parseInt(postId),
        amount: parseInt(amount),
        notes: notes || '',
      },
    });
    res.status(201).json({ success: true, data: newCommission });
  } catch (error) {
    console.error('Error creating commission:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PUT: Update existing commission
const updateCommission = async (req, res) => {
  const { id } = req.params;
  const { amount, notes } = req.body;
  try {
    const updated = await prisma.commission.update({
      where: { id: parseInt(id) },
      data: {
        amount: parseInt(amount),
        notes: notes || '',
      },
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating commission:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE: Delete commission
const deleteCommission = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.commission.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ success: true, message: 'Commission deleted' });
  } catch (error) {
    console.error('Error deleting commission:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getCommissionData = async (req, res) => {
  try {
    const commissions = await prisma.commission.findMany({
      include: {
        post: {
          select: {
            id: true,
            title: true,
            price: true,
            isSold: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match what the frontend expects
    const formattedCommissions = commissions.map(commission => ({
      id: commission.id,
      amount: commission.amount,
      notes: commission.notes,
      createdAt: commission.createdAt,
      post: {
        id: commission.post.id,
        title: commission.post.title,
        price: commission.post.price,
        isSold: commission.post.isSold
      }
    }));

    res.status(200).json({
      success: true,
      data: formattedCommissions
    });
  } catch (error) {
    console.error('Error fetching commission data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch commission data',
      error: error.message
    });
  }
};

module.exports={
    getCommissionByPostId,
    createCommission,
    updateCommission,
    deleteCommission,
    getCommissionData
}