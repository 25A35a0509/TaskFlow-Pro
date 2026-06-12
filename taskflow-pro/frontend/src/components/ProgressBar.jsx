import { motion } from 'framer-motion';

const ProgressBar = ({ value, max = 100, color = 'bg-primary', label, showPercentage = true }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
          {showPercentage && (
            <span className="font-semibold text-slate-900 dark:text-white">{percentage}%</span>
          )}
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
