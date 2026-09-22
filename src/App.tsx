import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { AuthCallback } from './pages/AuthCallback';
import { ChooseRole } from './pages/ChooseRole';
import { ClientOnboarding } from './pages/onboarding/ClientOnboarding';
import { PlannerOnboarding } from './pages/onboarding/PlannerOnboarding';
import { ClientHome } from './pages/home/ClientHome';
import { PlannerHome } from './pages/home/PlannerHome';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes - Resolution Hubs */}
          <Route 
            path="/choose-role" 
            element={
              <ProtectedRoute>
                <ChooseRole />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Onboarding */}
          <Route 
            path="/onboarding/client" 
            element={
              <ProtectedRoute allowedRole="client">
                <ClientOnboarding />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/onboarding/planner" 
            element={
              <ProtectedRoute allowedRole="planner">
                <PlannerOnboarding />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Application Homes */}
          <Route 
            path="/client" 
            element={
              <ProtectedRoute allowedRole="client">
                <ClientHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/planner" 
            element={
              <ProtectedRoute allowedRole="planner">
                <PlannerHome />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
