import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MainLayout } from './components/Navigation/Navbar';
import { LoginPage } from './pages/LoginPage';
import { ClosingManagerPage } from './pages/ClosingManagerPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { AuditingPage } from './pages/AuditingPage';
import { FinancialReportsPage } from './pages/FinancialReportsPage';
import { StoresManagementPage } from './pages/StoresManagementPage';
import { StoreComparisonPage } from './pages/StoreComparisonPage';
import { StoresRankingPage } from './pages/StoresRankingPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Tela 1: Login Corporativo */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Telas Autenticadas com MainLayout Global */}
          <Route
            path="/fechamento"
            element={
              <MainLayout>
                <ClosingManagerPage />
              </MainLayout>
            }
          />
          <Route
            path="/monitoramento"
            element={
              <MainLayout>
                <LiveMonitoringPage />
              </MainLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <LiveMonitoringPage />
              </MainLayout>
            }
          />
          <Route
            path="/comparativo"
            element={
              <MainLayout>
                <StoreComparisonPage />
              </MainLayout>
            }
          />
          <Route
            path="/ranking"
            element={
              <MainLayout>
                <StoresRankingPage />
              </MainLayout>
            }
          />
          <Route
            path="/bi-executivo"
            element={
              <MainLayout>
                <StoreComparisonPage />
              </MainLayout>
            }
          />
          <Route
            path="/auditoria"
            element={
              <MainLayout>
                <AuditingPage />
              </MainLayout>
            }
          />
          <Route
            path="/relatorios"
            element={
              <MainLayout>
                <FinancialReportsPage />
              </MainLayout>
            }
          />
          <Route
            path="/lojas"
            element={
              <MainLayout>
                <StoresManagementPage />
              </MainLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <MainLayout>
                <AdminPage />
              </MainLayout>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <MainLayout>
                <AdminPage />
              </MainLayout>
            }
          />

          {/* Rota Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
