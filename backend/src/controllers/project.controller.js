const asyncHandler = require('express-async-handler');
const prisma = require('../utils/prisma');

const getProjects = asyncHandler(async (req, res) => {
  // Admin sees projects they administer, members see projects they are part of
  let projects;
  if (req.user.role === 'ADMIN') {
    projects = await prisma.project.findMany({
      where: { adminId: req.user.id },
      include: { members: { select: { id: true, name: true, email: true } }, tasks: true }
    });
  } else {
    projects = await prisma.project.findMany({
      where: { members: { some: { id: req.user.id } } },
      include: { admin: { select: { name: true } }, tasks: true }
    });
  }
  res.json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      members: { select: { id: true, name: true, email: true } },
      tasks: { include: { assignedTo: { select: { name: true } } } },
      admin: { select: { id: true, name: true } }
    }
  });

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Ensure access
  if (req.user.role !== 'ADMIN' && !project.members.find(m => m.id === req.user.id)) {
    res.status(403);
    throw new Error('Not authorized to view this project');
  }

  res.json(project);
});

const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  
  const project = await prisma.project.create({
    data: {
      name,
      description,
      adminId: req.user.id,
      members: { connect: { id: req.user.id } } // Admin is implicitly a member
    },
  });
  res.status(201).json(project);
});

const updateProjectMembers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    res.status(403);
    throw new Error('Only admins can manage members');
  }

  const { memberIds } = req.body; // array of user IDs
  
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: {
      members: {
        set: memberIds.map(id => ({ id }))
      }
    },
    include: { members: { select: { id: true, name: true, email: true } } }
  });

  res.json(project);
});

module.exports = { getProjects, getProjectById, createProject, updateProjectMembers };
