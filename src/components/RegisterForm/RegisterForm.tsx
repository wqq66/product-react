import { Link } from 'react-router-dom';
import { useFormValidation } from '../../hooks/useFormValidation';
import type { ValidationRule } from '../../hooks/useFormValidation';
import styles from './RegisterForm.module.css';

interface RegisterValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerRules: Record<keyof RegisterValues, ValidationRule[]> = {
  username: [
    { required: true },
    { minLength: 3 },
    { maxLength: 30 },
  ],
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
  confirmPassword: [
    { required: true },
    { matchField: 'password' },
  ],
};

function RegisterForm() {
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation<RegisterValues>(
      { username: '', email: '', password: '', confirmPassword: '' },
      registerRules,
    );

  const onValidSubmit = (data: RegisterValues) => {
    console.log('Register submitted:', {
      username: data.username,
      email: data.email,
      password: data.password,
    });
    // TODO: Call API for registration
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate>
      <div className={styles.field}>
        <label htmlFor="register-username" className={styles.label}>
          Username
        </label>
        <input
          id="register-username"
          type="text"
          className={`${styles.input} ${touched.username && errors.username ? styles.inputError : ''}`}
          placeholder="Choose a username"
          autoComplete="username"
          value={values.username}
          onChange={handleChange('username')}
          onBlur={handleBlur('username')}
        />
        {touched.username && errors.username && (
          <p className={styles.error}>{errors.username}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="register-email" className={styles.label}>
          Email
        </label>
        <input
          id="register-email"
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
        <label htmlFor="register-password" className={styles.label}>
          Password
        </label>
        <input
          id="register-password"
          type="password"
          className={`${styles.input} ${touched.password && errors.password ? styles.inputError : ''}`}
          placeholder="Create a password (min. 6 characters)"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
        />
        {touched.password && errors.password && (
          <p className={styles.error}>{errors.password}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="register-confirm-password" className={styles.label}>
          Confirm Password
        </label>
        <input
          id="register-confirm-password"
          type="password"
          className={`${styles.input} ${touched.confirmPassword && errors.confirmPassword ? styles.inputError : ''}`}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange('confirmPassword')}
          onBlur={handleBlur('confirmPassword')}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <p className={styles.error}>{errors.confirmPassword}</p>
        )}
      </div>

      <button type="submit" className={styles.submitButton}>
        Create Account
      </button>

      <p className={styles.switchText}>
        Already have an account?{' '}
        <Link to="/login" className={styles.switchLink}>
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
