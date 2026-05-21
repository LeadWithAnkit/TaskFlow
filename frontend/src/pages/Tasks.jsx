import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', assignedToId: '' });
  const { user } = useContext(AuthContext);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
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
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [user]);

  const handleUpdateStatus = async (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await axios.put(`/tasks/${id}`, { status: newStatus });
    } catch (error) {
      console.error(error);
      fetchTasks();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tasks', newTask);
      setModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', assignedToId: '' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task', error);
      }
    }
  };

  const onDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      handleUpdateStatus(draggedTask.id, status);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-700 bg-red-50 border-red-200/60';
      case 'MEDIUM': return 'text-amber-800 bg-amber-50 border-amber-200/60';
      case 'LOW': return 'text-emerald-700 bg-emerald-50 border-emerald-200/60';
      default: return 'text-gray-600 bg-gray-100 border-gray-200/60';
    }
  };

  const columns = [
    { id: 'TODO', title: 'To Do', color: 'border-t-4 border-t-[#B89047]/60' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'border-t-4 border-t-[#DFBA73]' },
    { id: 'DONE', title: 'Done', color: 'border-t-4 border-t-emerald-500/70' }
  ];

  if (loading) return <div className="text-gray-400 font-medium">Loading tasks...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-800">My Tasks</h2>
        {user?.role === 'ADMIN' && (
          <button onClick={() => { setNewTask({...newTask, status: 'TODO'}); setModalOpen(true); }} className="px-5 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-white rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] shadow-md transition-all active:scale-95">
            + Add Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {columns.map(column => (
          <div 
            key={column.id}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, column.id)}
            className={`flex flex-col rounded-2xl border border-gray-200/80 bg-white p-4 transition-all ${column.color}`}
          >
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-700">{column.title}</h3>
              <span className="bg-gray-100 text-xs font-bold px-2.5 py-1 rounded-full text-gray-500">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-1">
              {tasks.filter(t => t.status === column.id).map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, task)}
                  onDragEnd={onDragEnd}
                  className="bg-[#FAF9F6] rounded-xl border border-gray-200/80 p-4 cursor-grab active:cursor-grabbing hover:border-[#DFBA73]/60 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {user?.role === 'ADMIN' && (
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-2 rounded bg-gray-100 hover:bg-red-50"
                        title="Delete Task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1 leading-snug">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-gray-450 uppercase tracking-wider truncate max-w-[120px]">
                        {task.project?.name || 'General'}
                      </span>
                      <span className="text-[10px] font-bold text-[#9A7831] mt-1 bg-[#DFBA73]/10 px-1.5 py-0.5 rounded">
                        {task.assignedTo ? `@${task.assignedTo.name}` : 'Everyone'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end text-[9px] text-gray-450 font-medium text-right">
                      <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      {task.status === 'DONE' && (
                        <span className="text-emerald-600 font-semibold mt-0.5">Done: {new Date(task.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {user?.role === 'ADMIN' && (
              <button onClick={() => { setNewTask({...newTask, status: column.id}); setModalOpen(true); }} className="mt-3 w-full py-2.5 flex justify-center items-center rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors uppercase tracking-widest border border-dashed border-gray-200/80">
                + Add Card
              </button>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && user?.role === 'ADMIN' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-gray-200 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#DFBA73]/5 to-transparent pointer-events-none"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 tracking-tight relative z-10">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Title</label>
                <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all text-sm" placeholder="Task Title" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Description</label>
                <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-850 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all text-sm" rows="3" placeholder="Task Details..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-850 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm cursor-pointer">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Status</label>
                  <select value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-850 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm cursor-pointer">
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">Assign To</label>
                <select value={newTask.assignedToId} onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-850 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm cursor-pointer">
                  <option value="">Unassigned (Visible to Everyone)</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-[#DFBA73] to-[#C5A059] text-white rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] shadow-md transition-all active:scale-95">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
