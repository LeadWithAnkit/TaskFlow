import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });
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

  useEffect(() => {
    fetchTasks();
  }, []);

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
      setNewTask({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task', error);
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
      case 'HIGH': return 'text-red-400 bg-red-900/30 border-red-500/30';
      case 'MEDIUM': return 'text-amber-400 bg-amber-900/30 border-amber-500/30';
      case 'LOW': return 'text-emerald-400 bg-emerald-900/30 border-emerald-500/30';
      default: return 'text-gray-400 bg-gray-800/50 border-gray-600/30';
    }
  };

  const columns = [
    { id: 'TODO', title: 'To Do', color: 'bg-indigo-500/10 border-indigo-500/20' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-amber-500/10 border-amber-500/20' },
    { id: 'DONE', title: 'Done', color: 'bg-emerald-500/10 border-emerald-500/20' }
  ];

  if (loading) return <div className="text-gray-400 font-medium">Loading tasks...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-100">My Tasks</h2>
        {user?.role === 'ADMIN' && (
          <button onClick={() => { setNewTask({...newTask, status: 'TODO'}); setModalOpen(true); }} className="px-5 py-2.5 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95">
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
            className={`flex flex-col rounded-2xl border bg-black/40 backdrop-blur-md p-4 transition-all ${column.color}`}
          >
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300">{column.title}</h3>
              <span className="bg-white/10 text-xs font-bold px-2.5 py-1 rounded-full text-gray-400">
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
                  className="bg-[#1A1A1A] rounded-xl border border-gray-700/50 p-4 cursor-grab active:cursor-grabbing hover:border-gray-500/50 hover:shadow-lg transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-100 mb-1 leading-snug">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-800/50 mt-auto">
                    <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider truncate max-w-[120px]">
                      {task.project?.name || 'General'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {user?.role === 'ADMIN' && (
              <button onClick={() => { setNewTask({...newTask, status: column.id}); setModalOpen(true); }} className="mt-3 w-full py-2.5 flex justify-center items-center rounded-xl text-xs font-bold text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors uppercase tracking-widest border border-transparent hover:border-gray-700/50">
                + Add Card
              </button>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && user?.role === 'ADMIN' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl max-w-md w-full p-6 sm:p-8 border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-100 mb-6 tracking-tight">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Title</label>
                <input required type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all text-sm" placeholder="Task Title" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Description</label>
                <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all text-sm" rows="3" placeholder="Task Details..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Status</label>
                  <select value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}
                    className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm">
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold hover:bg-white transition-all shadow-lg active:scale-95">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
