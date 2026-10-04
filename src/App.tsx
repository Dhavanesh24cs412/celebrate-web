import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './domains/auth/components/AuthProvider';
import { ProtectedRoute } from './domains/auth/components/ProtectedRoute';

import { Landing } from './domains/landing/pages/Landing';
import { Auth } from './domains/auth/pages/Auth';
import { AuthCallback } from './domains/auth/pages/AuthCallback';
import { ChooseRole } from './domains/onboarding/pages/ChooseRole';
import { ClientOnboarding } from './domains/onboarding/pages/ClientOnboarding';
import { PlannerOnboarding } from './domains/onboarding/pages/PlannerOnboarding';

import { ClientLayout } from './domains/client/components/ClientLayout';
import { ClientHome } from './domains/client/pages/ClientHome';
import { ClientEvents } from './domains/client/pages/ClientEvents';
import { EventWizard } from './domains/client/pages/EventWizard';
import { ClientEventDetails } from './domains/client/pages/ClientEventDetails';
import { ClientProposals } from './domains/client/pages/ClientProposals';
import { ClientProfile } from './domains/client/pages/ClientProfile';

import { PlannerHome } from './domains/planner/pages/PlannerHome';

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
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientHome />} />
            <Route path="events" element={<ClientEvents />} />
            <Route path="events/new" element={<EventWizard />} />
            <Route path="events/:eventId" element={<ClientEventDetails />} />
            <Route path="proposals" element={<ClientProposals />} />
            <Route path="profile" element={<ClientProfile />} />
          </Route>

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
