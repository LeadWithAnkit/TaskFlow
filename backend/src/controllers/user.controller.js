const asyncHandler = require('express-async-handler');
const prisma = require('../utils/prisma');

const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json(users);
});

module.exports = { getUsers };
