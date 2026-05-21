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
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-200/60 p-8 flex flex-col items-center justify-center transition-all hover:border-[#DFBA73]/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.05)]">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Tasks</span>
          <span className="mt-3 text-5xl font-black text-gray-800">{stats.total}</span>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-200/60 p-8 flex flex-col items-center justify-center transition-all hover:border-[#B89047]/50 hover:shadow-[0_8px_30px_rgba(184,144,71,0.05)]">
          <span className="text-xs font-bold text-[#9A7831] uppercase tracking-widest">To Do</span>
          <span className="mt-3 text-5xl font-black text-[#9A7831]">{stats.todo}</span>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-200/60 p-8 flex flex-col items-center justify-center transition-all hover:border-[#DFBA73]/50 hover:shadow-[0_8px_30px_rgba(223,186,115,0.05)]">
          <span className="text-xs font-bold text-[#B89047] uppercase tracking-widest">In Progress</span>
          <span className="mt-3 text-5xl font-black text-[#B89047]">{stats.inProgress}</span>
        </div>
        <div className="bg-emerald-50/30 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-emerald-200/60 p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all hover:border-emerald-400/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.05)]">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Completed</span>
          <span className="mt-3 text-5xl font-black text-emerald-600">{stats.done}</span>
        </div>
      </div>

      {stats.overdue > 0 && (
        <div className="mt-8 bg-red-50/80 border border-red-200/80 p-5 rounded-2xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"></div>
          <div className="flex ml-4">
            <div>
              <h3 className="text-sm font-bold tracking-wide text-red-700 uppercase">Attention Required</h3>
              <div className="mt-1.5 text-sm font-medium text-red-800">
                You have <span className="font-bold text-red-950">{stats.overdue}</span> overdue {stats.overdue === 1 ? 'task' : 'tasks'}. Please review your task list immediately.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
