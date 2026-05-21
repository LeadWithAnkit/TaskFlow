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
      <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-200/60 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
          <p className="mt-2 text-sm text-gray-500">{project.description}</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setNewTaskModal(true)} className="px-4 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-white rounded-xl text-sm font-bold hover:opacity-95 shadow-md shadow-[#C5A059]/10 transition-all active:scale-95">
            Add Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Tasks</h3>
          <div className="bg-white shadow-sm border border-gray-200/60 rounded-xl overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {project.tasks?.length === 0 ? (
                <li className="p-6 text-center text-gray-500">No tasks in this project.</li>
              ) : (
                project.tasks?.map(task => (
                  <li key={task.id} className="p-4 hover:bg-gray-50/55 flex justify-between items-center transition-colors">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-850">{task.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">Assigned to: <span className="text-[#9A7831] font-semibold">{task.assignedTo?.name || 'Unassigned'}</span></p>
                      <div className="flex space-x-3 mt-1.5 text-[10px] text-gray-400">
                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        {task.status === 'DONE' && (
                          <span className="text-green-600 font-semibold">Completed: {new Date(task.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        disabled={user.role !== 'ADMIN' && task.assignedToId !== user.id}
                        className="text-xs bg-white border border-gray-200 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-gray-800 cursor-pointer"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                      </select>
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors bg-gray-50 hover:bg-red-50"
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
            <h3 className="text-lg font-bold text-gray-800">Members</h3>
            {user?.role === 'ADMIN' && (
              <button onClick={openManageMembers} className="text-sm text-[#9A7831] hover:text-[#B89047] font-semibold transition-colors">
                Manage
              </button>
            )}
          </div>
          <div className="bg-white shadow-sm border border-gray-200/60 rounded-xl p-4">
            <ul className="space-y-3">
              {project.members?.map(member => (
                <li key={member.id} className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-[#DFBA73]/15 flex items-center justify-center text-[#9A7831] font-bold text-xs">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-805">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {newTaskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#DFBA73]/5 to-transparent pointer-events-none"></div>
            <h3 className="text-xl font-bold text-gray-805 mb-5 relative z-10">New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-widest">Title</label>
                <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white text-gray-800 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm focus:outline-none" placeholder="Task summary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-widest">Description</label>
                <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white text-gray-800 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm focus:outline-none" rows="3" placeholder="Task details" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-widest">Assign To</label>
                <select value={newTask.assignedToId} onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white text-gray-850 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm cursor-pointer">
                  <option value="">Unassigned</option>
                  {project.members?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setNewTaskModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-white rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] shadow-md transition-all">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {manageMembersModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#DFBA73]/5 to-transparent pointer-events-none"></div>
            <h3 className="text-xl font-bold text-gray-805 mb-5 relative z-10">Manage Project Members</h3>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-4 relative z-10">
              {allUsers.map(u => (
                <label key={u.id} className="flex items-center space-x-3 p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-gray-200/50">
                  <input 
                    type="checkbox" 
                    checked={selectedMemberIds.includes(u.id)}
                    onChange={() => toggleMemberSelection(u.id)}
                    className="rounded text-[#9A7831] focus:ring-[#D4AF37] h-4 w-4"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100 relative z-10">
              <button type="button" onClick={() => setManageMembersModal(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
              <button onClick={handleSaveMembers} className="px-6 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-white rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] shadow-md transition-all">Save Members</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
