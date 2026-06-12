import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, suffix = '', trend }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-5 hover:shadow-glow transition-shadow"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {value}
          {suffix}
        </h3>
        {trend && (
          <span className="text-xs font-semibold text-emerald-500">{trend}</span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
