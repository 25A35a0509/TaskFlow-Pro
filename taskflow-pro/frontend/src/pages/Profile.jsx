import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Mail, Save, Shield, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { getInitials, formatDate } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      bio: user?.bio || '',
    },
  });

  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.updateProfile(data);
      updateUser(res.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      const res = await authService.updateProfile({ password: data.password });
      updateUser(res.user);
      toast.success('Password updated successfully');
      resetPwd();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Profile summary card */}
      <div className="card p-6 lg:col-span-1">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-white shadow-glow">
            {getInitials(user?.name)}
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>

          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary capitalize">
            <Shield size={12} />
            {user?.role}
          </span>

          <div className="mt-6 w-full border-t border-slate-100 dark:border-dark-border pt-4 text-left">
            <p className="text-xs font-medium uppercase text-slate-400">Member Since</p>
            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Forms */}
      <div className="space-y-6 lg:col-span-2">
        <div className="card p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-text">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  className="input-field pl-10"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label-text">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" disabled value={user?.email} className="input-field pl-10 opacity-60 cursor-not-allowed" />
              </div>
              <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
            </div>

            <div>
              <label className="label-text">Bio</label>
              <textarea
                rows={3}
                placeholder="Tell us a bit about yourself..."
                className="input-field resize-none"
                {...register('bio', { maxLength: 250 })}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Change Password</h3>
          <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="label-text">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className="input-field pl-10"
                  {...registerPwd('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Must be at least 6 characters' },
                  })}
                />
              </div>
              {pwdErrors.password && (
                <p className="mt-1 text-xs text-red-500">{pwdErrors.password.message}</p>
              )}
            </div>
            <button type="submit" className="btn-primary">
              <Lock size={16} /> Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
