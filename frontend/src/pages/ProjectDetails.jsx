import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', assignedToId: '' });

  const fetchProject = async () => {
    try {
      const res = await axios.get(`/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tasks', { ...newTask, projectId: id });
      setNewTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', assignedToId: '' });
      fetchProject();
    } catch (error) {
      console.error(error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/tasks/${taskId}`, { status });
      fetchProject();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-gray-500">Loading project...</div>;
  if (!project) return <div className="text-red-500">Project not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
          <p className="mt-2 text-gray-500">{project.description}</p>
        </div>
        <button onClick={() => setNewTaskModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 shadow-sm">
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Tasks</h3>
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {project.tasks?.length === 0 ? (
                <li className="p-6 text-center text-gray-500">No tasks in this project.</li>
              ) : (
                project.tasks?.map(task => (
                  <li key={task.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{task.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">Assigned to: {task.assignedTo?.name || 'Unassigned'}</p>
                    </div>
                    <select 
                      value={task.status} 
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      disabled={user.role !== 'ADMIN' && task.assignedToId !== user.id}
                      className="text-xs border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Members</h3>
          <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-4">
            <ul className="space-y-3">
              {project.members?.map(member => (
                <li key={member.id} className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {newTaskModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select value={newTask.assignedToId} onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                  <option value="">Unassigned</option>
                  {project.members?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setNewTaskModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
