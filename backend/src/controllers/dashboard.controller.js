const asyncHandler = require('express-async-handler');
const prisma = require('../utils/prisma');

const getDashboardStats = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role !== 'ADMIN') {
    filter.OR = [
      { assignedToId: req.user.id },
      { assignedToId: null, projectId: null },
      { assignedToId: null, project: { members: { some: { id: req.user.id } } } }
    ];
  }
  const totalTasks = await prisma.task.count({ where: filter });

  const statusCounts = await prisma.task.groupBy({
    by: ['status'],
    where: filter,
    _count: { status: true }
  });

  const now = new Date();
  const overdueTasks = await prisma.task.count({
    where: {
      ...filter,
      dueDate: { lt: now },
      status: { not: 'DONE' }
    }
  });

  const stats = {
    total: totalTasks,
    todo: statusCounts.find(s => s.status === 'TODO')?._count.status || 0,
    inProgress: statusCounts.find(s => s.status === 'IN_PROGRESS')?._count.status || 0,
    done: statusCounts.find(s => s.status === 'DONE')?._count.status || 0,
    overdue: overdueTasks
  };

  res.json(stats);
});

module.exports = { getDashboardStats };
