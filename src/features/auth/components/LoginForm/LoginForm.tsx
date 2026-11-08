import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ROUTES } from '@/shared/config/routes';
import { loginSchema, type LoginFormValues } from '@/features/auth/validation/loginSchema';

interface LoginFormProps {
  onSubmit: (credentials: LoginFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = React.memo(({ onSubmit, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const fillDemo = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
      <div className="auth-demo-pills">
        <span className="auth-demo-label"><Sparkles size={13} /><span>Quick Demo:</span></span>
        <button type="button" className="auth-demo-btn doctor" onClick={() => fillDemo('doctor@jeevayurniketan.com', 'doctor123')}>Doctor Access</button>
        <button type="button" className="auth-demo-btn patient" onClick={() => fillDemo('patient@jeevayurniketan.com', 'patient123')}>Patient Access</button>
      </div>

      <div className="auth-form__group">
        <label htmlFor="loginEmail">Email Address</label>
        <div className={`auth-form__input-wrap ${errors.email ? 'has-error' : ''}`}>
          <Mail size={18} className="auth-form__icon" />
          <input id="loginEmail" type="email" autoComplete="email" placeholder="doctor@jeevayurniketan.com" {...register('email')} />
        </div>
        {errors.email && <span className="auth-form__field-error">{errors.email.message}</span>}
      </div>

      <div className="auth-form__group">
        <div className="auth-form__label-row">
          <label htmlFor="loginPassword">Password</label>
          <Link to={ROUTES.FORGOT_PASSWORD} className="auth-form__link">Forgot password?</Link>
        </div>
        <div className={`auth-form__input-wrap ${errors.password ? 'has-error' : ''}`}>
          <Lock size={18} className="auth-form__icon" />
          <input id="loginPassword" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" {...register('password')} />
          <button type="button" className="auth-form__eye-btn" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {errors.password && <span className="auth-form__field-error">{errors.password.message}</span>}
      </div>

      <div className="auth-form__checkbox">
        <label><input type="checkbox" {...register('rememberMe')} /><span>Remember me for 30 days</span></label>
      </div>

      <Button type="submit" variant="primary" disabled={isLoading} className="auth-form__submit">
        {isLoading ? 'Signing in...' : <><LogIn size={18} /><span>Sign In to Sanctuary</span></>}
      </Button>
    </form>
  );
});

LoginForm.displayName = 'LoginForm';
