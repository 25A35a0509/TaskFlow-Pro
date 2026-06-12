import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, BarChart3, Bell } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-surface dark:bg-dark">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse-slow" />
        </div>

        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-glass">
            <Zap size={20} />
          </div>
          <span className="text-xl font-extrabold">TaskFlow Pro</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 space-y-6"
        >
          <h1 className="text-4xl font-extrabold leading-tight">
            Organize your work. <br /> Amplify your team.
          </h1>
          <p className="max-w-md text-white/80">
            TaskFlow Pro brings real-time collaboration, smart analytics, and beautiful design
            together in one productivity platform.
          </p>

          <div className="space-y-3 pt-4">
            {[
              { icon: CheckCircle2, text: 'Smart task management with priorities & categories' },
              { icon: BarChart3, text: 'Live analytics dashboard with productivity insights' },
              { icon: Bell, text: 'Real-time notifications & activity tracking' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-glass px-4 py-3">
                <f.icon size={18} />
                <span className="text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative z-10 text-sm text-white/60">
          © {new Date().getFullYear()} TaskFlow Pro. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Zap className="text-white" size={20} />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
            TaskFlow Pro
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
