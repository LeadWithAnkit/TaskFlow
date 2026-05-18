import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login'); // login, signup
  const [roleMode, setRoleMode] = useState('user'); // user, admin
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingAction(true);
    try {
      if (activeTab === 'login') {
        await login(formData.email, formData.password);
        navigate('/');
      } else if (activeTab === 'signup' && roleMode === 'user') {
        await register(formData.name, formData.email, formData.password);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#0A0A0A] text-gray-100 flex flex-col relative overflow-y-auto overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.35] mix-blend-screen pointer-events-none"
        style={{ backgroundImage: "url('/bg_network.png')" }}
      ></div>

      {/* Gradient overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between w-full px-6 sm:px-8 lg:px-16 pt-6 sm:pt-8 pb-4 shrink-0">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
          <span className="text-sm font-bold tracking-[0.2em] text-gray-200 uppercase">TaskFlow</span>
        </div>

        <div className="hidden sm:flex items-center space-x-4 md:space-x-8 text-sm font-medium text-gray-400">
          <button onClick={() => { setActiveTab('login'); setError(''); }} className={`transition-colors tracking-wide ${activeTab === 'login' ? 'text-white font-semibold' : 'hover:text-gray-200'}`}>Login</button>
          {roleMode === 'user' && (
            <button onClick={() => { setActiveTab('signup'); setError(''); }} className={`px-5 py-2 rounded-full border transition-all tracking-wide ${activeTab === 'signup' ? 'border-gray-400 text-white font-semibold bg-white/5' : 'border-gray-800 hover:border-gray-500 text-gray-300'}`}>Signup</button>
          )}
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 w-full relative z-10 flex flex-col lg:flex-row items-center justify-center">

        {/* Left side content */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 py-8 lg:py-0 shrink-0">
          <div className="w-full max-w-[550px] mx-auto lg:mx-0">
            <h1 className="text-4xl lg:text-5xl xl:text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-6 sm:mb-8 text-transparent bg-clip-text bg-gradient-to-br from-gray-100 via-gray-300 to-gray-600">
              Unified Workflow <br className="hidden sm:block" />
              for Ambitious Teams.
            </h1>

            <p className="text-lg xl:text-xl text-gray-400 mb-8 sm:mb-12 leading-relaxed font-light">
              Assign & Finish work without confusion. From planning to execution, a single platform to align and deliver.
            </p>

            <div className="border-l-2 border-gray-800 pl-6 sm:pl-8 space-y-6 mt-4">
              <div>
                <div className="text-lg lg:text-xl font-bold text-gray-200 uppercase tracking-widest">Integrated</div>
                <div className="text-sm text-gray-500 font-medium mt-1">Seamless Collaboration</div>
              </div>
              <div>
                <div className="text-lg lg:text-xl font-bold text-gray-200 uppercase tracking-widest">Global</div>
                <div className="text-sm text-gray-500 font-medium mt-1">Remote Teams</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:pr-16 shrink-0 mb-8 lg:mb-0">
          <div className="w-full max-w-[400px] bg-gradient-to-br from-gray-200 to-gray-400 p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-gray-500/20 relative">

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-60 pointer-events-none rounded-3xl"></div>

            <div className="relative z-10">
              {/* Role Switcher */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-300/60 p-1 rounded-xl inline-flex shadow-inner">
                  <button
                    type="button"
                    onClick={() => { setRoleMode('user'); setError(''); }}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${roleMode === 'user' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    User
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRoleMode('admin'); setActiveTab('login'); setError(''); }}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${roleMode === 'admin' ? 'bg-gray-100 text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-[1.75rem] font-extrabold text-gray-900 tracking-tight">
                  {activeTab === 'login' ? 'Sign in' : 'Create Account'}
                </h2>
                <p className="mt-2 text-sm text-gray-600 font-medium">
                  {roleMode === 'admin' ? 'Admin Portal Access' : 'Enter your credentials to continue'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="p-3 text-sm text-red-700 bg-red-100/80 border border-red-200 rounded-lg text-center font-medium">{error}</div>}

                {activeTab === 'signup' && roleMode === 'user' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 tracking-widest uppercase">Name</label>
                    <input name="name" type="text" required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 shadow-sm transition-all text-sm"
                      placeholder="John Doe" value={formData.name} onChange={handleChange} />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 tracking-widest uppercase">Email</label>
                  <input name="email" type="email" required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 shadow-sm transition-all text-sm"
                    placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 tracking-widest uppercase">Password</label>
                  <input name="password" type="password" required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800 shadow-sm transition-all text-sm"
                    placeholder="••••••••" value={formData.password} onChange={handleChange} />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={loadingAction}
                    className="w-full py-3.5 px-4 bg-[#1E1E20] hover:bg-[#111112] text-white rounded-xl font-semibold shadow-lg shadow-gray-900/20 transition-all transform active:scale-[0.98] border border-gray-900 disabled:opacity-70 flex items-center justify-center tracking-wide text-base">
                    {loadingAction ? 'Processing...' : (activeTab === 'login' ? 'Sign in →' : 'Sign up →')}
                  </button>
                </div>
              </form>

              {roleMode === 'user' && (
                <div className="mt-8 text-center text-sm text-gray-600 font-medium">
                  {activeTab === 'login' ? (
                    <p>Don't have an account? <button onClick={() => { setActiveTab('signup'); setError(''); }} className="text-gray-900 font-bold hover:text-gray-600 transition-colors ml-1">Sign up</button></p>
                  ) : (
                    <p>Already have an account? <button onClick={() => { setActiveTab('login'); setError(''); }} className="text-gray-900 font-bold hover:text-gray-600 transition-colors ml-1">Sign in</button></p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
