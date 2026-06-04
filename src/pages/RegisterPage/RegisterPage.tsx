import Layout from '../../components/Layout/Layout';
import RegisterForm from '../../components/RegisterForm/RegisterForm';

function RegisterPage() {
  return (
    <Layout
      title="Create an account"
      subtitle="Get started with a free account"
    >
      <RegisterForm />
    </Layout>
  );
}

export default RegisterPage;
