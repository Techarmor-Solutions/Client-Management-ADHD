import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { AppShell } from './components/layout/AppShell';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

function App() {
  const { session, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center">
        <LoadingSpinner message="Loading…" />
      </div>
    );
  }

  if (!session) {
    return <LoginPage onSignIn={signIn} />;
  }

  return <AppShell onSignOut={signOut} />;
}

export default App;
