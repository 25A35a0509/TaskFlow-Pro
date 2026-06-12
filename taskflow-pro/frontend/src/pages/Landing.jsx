import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, BarChart3, Bell, Users, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  {
    icon: CheckCircle2,
    title: 'Smart Task Management',
    desc: 'Create, organize, and prioritize tasks with categories, due dates, and priority levels.',
  },
  {
    icon: BarChart3,
    title: 'Powerful Analytics',
    desc: 'Visualize your productivity with real-time charts, progress bars, and completion stats.',
  },
  {
    icon: Bell,
    title: 'Real-time Notifications',
    desc: 'Stay in sync with live updates powered by Socket.io across your entire team.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    desc: 'Admin and user roles with secure JWT authentication and protected routes.',
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-surface dark:bg-dark">
      {/* Nav */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow">
            <Zap className="text-white" size={18} />
          </div>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            TaskFlow <span className="text-primary">Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles size={14} />
            Real-time collaboration, reimagined
          </span>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-6xl">
            Manage tasks like a <span className="text-primary">pro</span>,{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              not a chore
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            TaskFlow Pro combines beautiful design with powerful productivity tools — task
            management, analytics, and live notifications, all in one place.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3 text-base">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card p-6 hover:shadow-glow transition-shadow"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <f.icon className="text-white" size={20} />
              </div>
              <h3 className="mb-2 font-bold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <div className="card relative overflow-hidden p-12 bg-gradient-to-br from-primary via-secondary to-accent">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to boost your productivity?
          </h2>
          <p className="mt-3 text-white/80">
            Join now and start organizing your work the smart way.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105"
          >
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-100 dark:border-dark-border py-8 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} TaskFlow Pro. Built with React, Node.js & MongoDB.
      </footer>
    </div>
  );
};

export default Landing;
