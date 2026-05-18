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
  const [manageMembersModal, setManageMembersModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
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

  const fetchUsers = async () => {
    if (user?.role !== 'ADMIN') return;
    try {
      const res = await axios.get('/users');
      setAllUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    fetchUsers();
  }, [user]);

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

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/tasks/${taskId}`);
        fetchProject();
      } catch (error) {
        console.error('Failed to delete task', error);
      }
    }
  };

  const openManageMembers = () => {
    setSelectedMemberIds(project.members.map(m => m.id));
    setManageMembersModal(true);
  };

  const handleSaveMembers = async () => {
    try {
      await axios.put(`/projects/${id}/members`, { memberIds: selectedMemberIds });
      setManageMembersModal(false);
      fetchProject();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMemberSelection = (userId) => {
    setSelectedMemberIds(prev => 
      prev.includes(userId) ? prev.filter(mid => mid !== userId) : [...prev, userId]
    );
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
        {user?.role === 'ADMIN' && (
          <button onClick={() => setNewTaskModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 shadow-sm">
            Add Task
          </button>
        )}
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
                      <div className="flex space-x-3 mt-1.5 text-[10px] text-gray-400">
                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        {task.status === 'DONE' && (
                          <span className="text-green-600 font-medium">Completed: {new Date(task.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
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
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Task"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Members</h3>
            {user?.role === 'ADMIN' && (
              <button onClick={openManageMembers} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Manage
              </button>
            )}
          </div>
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
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select value={newTask.assignedToId} onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                  <option value="">Unassigned</option>
                  {project.members?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setNewTaskModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 shadow-sm">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {manageMembersModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Manage Project Members</h3>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {allUsers.map(u => (
                <label key={u.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedMemberIds.includes(u.id)}
                    onChange={() => toggleMemberSelection(u.id)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button type="button" onClick={() => setManageMembersModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Cancel</button>
              <button onClick={handleSaveMembers} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 shadow-sm">Save Members</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
