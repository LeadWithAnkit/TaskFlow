require('dotenv').config();
const prisma = require('./src/utils/prisma');

async function test() {
  try {
    const tasks = await prisma.task.findMany({
      include: { assignees: true }
    });
    console.log("Tasks:", tasks);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
