import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/projects');
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/projects', newProject);
      setModalOpen(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  if (loading) return <div className="text-gray-400 font-medium">Loading projects...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-100">Projects</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
        >
          + Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-gray-400 bg-white/5 backdrop-blur-md rounded-2xl border border-dashed border-gray-600/50">
            <p className="text-lg font-medium">No projects found.</p>
            <p className="text-sm mt-2 text-gray-500">Create a new project to get started with your team.</p>
          </div>
        ) : (
          projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="block group h-full">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-gray-600/30 p-6 sm:p-8 transition-all hover:bg-white/10 hover:border-gray-400/50 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.02] rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-500"></div>
                <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors">{project.name}</h3>
                <p className="mt-3 text-sm text-gray-400 flex-1 line-clamp-3 leading-relaxed">{project.description}</p>
                <div className="mt-6 pt-4 border-t border-gray-700/50 flex justify-between items-center text-xs font-medium text-gray-500 tracking-wide uppercase">
                  <span className="flex items-center space-x-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> <span>{project.tasks?.length || 0} tasks</span></span>
                  {project.admin && <span className="flex items-center space-x-1.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> <span className="truncate max-w-[100px]">{project.admin.name}</span></span>}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl max-w-md w-full p-6 sm:p-8 border border-gray-700 shadow-2xl relative overflow-hidden transform transition-all">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
            <h3 className="text-xl font-bold text-gray-100 mb-6 relative z-10 tracking-tight">Create New Project</h3>
            <form onSubmit={handleCreate} className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Name</label>
                <input required type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-sm" placeholder="Project Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Description</label>
                <textarea value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111] border border-gray-700 rounded-xl text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all text-sm" rows="3" placeholder="What is this project about?"></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gray-100 text-gray-900 rounded-xl text-sm font-bold hover:bg-white transition-all shadow-lg active:scale-95">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
