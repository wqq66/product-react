import Layout from '../../components/Layout/Layout';
import LoginForm from '../../components/LoginForm/LoginForm';

function LoginPage() {
  return (
    <Layout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </Layout>
  );
}

export default LoginPage;
