import { Link } from 'react-router-dom';
import { useFormValidation } from '../../hooks/useFormValidation';
import type { ValidationRule } from '../../hooks/useFormValidation';
import styles from './LoginForm.module.css';

interface LoginValues {
  email: string;
  password: string;
}

const loginRules: Record<keyof LoginValues, ValidationRule[]> = {
  email: [
    { required: true },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      patternMessage: 'Please enter a valid email address',
    },
  ],
  password: [
    { required: true },
    { minLength: 6 },
  ],
};

function LoginForm() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation<LoginValues>(
      { email: '', password: '' },
      loginRules,
    );

  const onValidSubmit = (data: LoginValues) => {
    console.log('Login submitted:', data);
    // TODO: Call API for authentication
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="login-email" className={styles.label}>
          Email
        </label>
        <input
          id="login-email"
          type="email"
          className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ''}`}
          placeholder="you@example.com"
          autoComplete="email"
          value={values.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
        />
        {touched.email && errors.email && (
          <p className={styles.error}>{errors.email}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="login-password" className={styles.label}>
          Password
        </label>
        <input
          id="login-password"
          type="password"
          className={`${styles.input} ${touched.password && errors.password ? styles.inputError : ''}`}
          placeholder="Enter your password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
        />
        {touched.password && errors.password && (
          <p className={styles.error}>{errors.password}</p>
        )}
      </div>

      <button type="submit" className={styles.submitButton}>
        Sign In
      </button>

      <p className={styles.switchText}>
        Don't have an account?{' '}
        <Link to="/register" className={styles.switchLink}>
          Create one
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
