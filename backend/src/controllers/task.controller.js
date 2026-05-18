const asyncHandler = require('express-async-handler');
const prisma = require('../utils/prisma');

const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  
  let filter = {};
  if (projectId) filter.projectId = projectId;
  
  // Assignment Requirement: Member can view assigned tasks, global unassigned tasks, or project unassigned tasks if they are in the project
  if (req.user.role !== 'ADMIN') {
    filter.OR = [
      { assignedToId: req.user.id },
      { assignedToId: null, projectId: null },
      { assignedToId: null, project: { members: { some: { id: req.user.id } } } }
    ];
  }
  
  const tasks = await prisma.task.findMany({
    where: filter,
    include: { project: { select: { name: true } }, assignedTo: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  });
  
  res.json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
  // Assignment Requirement: Admin manages tasks
  if (req.user.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Only admins can create tasks');
  }

  const { title, description, dueDate, priority, projectId, assignedToId } = req.body;
  
  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      projectId: projectId || null,
      assignedToId: assignedToId || null
    },
    include: { assignedTo: { select: { id: true, name: true, email: true } } }
  });
  
  res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const { status, title, description, priority, dueDate, assignedToId } = req.body;
  
  const task = await prisma.task.findUnique({ 
    where: { id: req.params.id },
    include: { assignedTo: true }
  });
  
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Assignment Requirement: Member can update assigned tasks only
  if (req.user.role !== 'ADMIN' && task.assignedToId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized. You can only update tasks assigned to you.');
  }

  const updatedTask = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      status, 
      title: req.user.role === 'ADMIN' ? title : undefined,
      description: req.user.role === 'ADMIN' ? description : undefined,
      priority: req.user.role === 'ADMIN' ? priority : undefined,
      dueDate: req.user.role === 'ADMIN' ? (dueDate ? new Date(dueDate) : undefined) : undefined,
      assignedToId: req.user.role === 'ADMIN' ? assignedToId : undefined
    },
    include: { assignedTo: { select: { id: true, name: true, email: true } } }
  });
  
  res.json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Only admins can delete tasks');
  }
  
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ message: 'Task removed' });
});

module.exports = { getTasks, createTask, updateTask, deleteTask };
