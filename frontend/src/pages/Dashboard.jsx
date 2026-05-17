import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/dashboard/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-gray-400 font-medium">Loading dashboard...</div>;
  if (!stats) return <div className="text-red-400 font-medium">Failed to load dashboard.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-100">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-gray-600/30 p-8 flex flex-col items-center justify-center transition-all hover:bg-white/10 hover:border-gray-500/50">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Tasks</span>
          <span className="mt-3 text-5xl font-black text-gray-100">{stats.total}</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-gray-600/30 p-8 flex flex-col items-center justify-center transition-all hover:bg-white/10 hover:border-indigo-500/50">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">To Do</span>
          <span className="mt-3 text-5xl font-black text-indigo-400">{stats.todo}</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-gray-600/30 p-8 flex flex-col items-center justify-center transition-all hover:bg-white/10 hover:border-amber-500/50">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">In Progress</span>
          <span className="mt-3 text-5xl font-black text-amber-400">{stats.inProgress}</span>
        </div>
        <div className="bg-emerald-900/20 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-500/30 p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all hover:bg-emerald-900/40 hover:border-emerald-500/60">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Completed</span>
          <span className="mt-3 text-5xl font-black text-emerald-400">{stats.done}</span>
        </div>
      </div>

      {stats.overdue > 0 && (
        <div className="mt-8 bg-red-950/40 backdrop-blur-md border border-red-800/50 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
          <div className="flex ml-4">
            <div>
              <h3 className="text-sm font-bold tracking-wide text-red-400 uppercase">Attention Required</h3>
              <div className="mt-1.5 text-sm font-medium text-red-200/80">
                You have <span className="font-bold text-white">{stats.overdue}</span> overdue {stats.overdue === 1 ? 'task' : 'tasks'}. Please review your task list immediately.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
