import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicGiftView } from './pages/public/PublicGiftView';
import { ExportRenderView } from './pages/public/ExportRenderView';
import { KnowledgeBaseView } from './pages/public/KnowledgeBaseView';
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { ProjectEditor } from './pages/admin/ProjectEditor';

import { LandingView } from './pages/public/landing/LandingView';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingView />} />

        {/* Public Gift Route */}
        <Route path="/r/:slug" element={<PublicGiftView />} />
        <Route path="/export-render/:slug" element={<ExportRenderView />} />
        
        {/* Knowledge Base Route */}
        <Route path="/notebooklm" element={<KnowledgeBaseView />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editor/:id"
          element={
            <ProtectedRoute>
              <ProjectEditor />
            </ProtectedRoute>
          }
        />

        {/* Default Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
