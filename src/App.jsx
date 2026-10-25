import { useState } from 'react';
import {
  ShieldCheck, LayoutDashboard, Link2, Mail, LockKeyhole, Menu, X, Activity,
} from 'lucide-react';
import './index.css';

import { DashboardPage } from './pages/DashboardPage';
import { UrlAnalysisPage } from './pages/UrlAnalysisPage';
import { EmailAnalysisPage } from './pages/EmailAnalysisPage';
import { PasswordCheckerPage } from './pages/PasswordCheckerPage';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'url', label: 'URL Analysis', icon: Link2 },
  { id: 'email', label: 'Email Analysis', icon: Mail },
  { id: 'password', label: 'Password Checker', icon: LockKeyhole },
];

function getPageLabel(pageId) {
  return NAV_ITEMS.find((n) => n.id === pageId)?.label || 'Dashboard';
}

function renderPage(pageId, setPage) {
  switch (pageId) {
    case 'url': return <UrlAnalysisPage />;
    case 'email': return <EmailAnalysisPage />;
    case 'password': return <PasswordCheckerPage />;
    default: return <DashboardPage setPage={setPage} />;
  }
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navigate(pageId) {
    setPage(pageId);
    setSidebarOpen(false);
  }

  const pageLabel = getPageLabel(page);

  return (
    <div className="app-container">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <ShieldCheck size={27} />
          </div>
          <div className="brand-text">
            <h2>PhishGuard</h2>
            <span>PRO SECURITY</span>
          </div>
          <button
            className="sidebar-close"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Section */}
        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${page === item.id ? 'active' : ''}`}
                onClick={() => navigate(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {page === item.id && <span className="nav-active-indicator" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom card */}
        <div className="sidebar-bottom">
          <div className="sidebar-security-card">
            <div className="sidebar-security-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong>Security First</strong>
              <p>Investigate suspicious activity responsibly.</p>
            </div>
          </div>
          <div className="sidebar-footer">
            <div className="footer-status-icon">
              <Activity size={18} />
            </div>
            <div>
              <p>Backend status</p>
              <span>Security Workspace</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="breadcrumb">
              <span>PhishGuard Pro</span>
              <span className="breadcrumb-divider">/</span>
              <strong>{pageLabel}</strong>
            </div>
          </div>
          <div className="topbar-right">
            <span className="topbar-status-dot" />
            <span className="topbar-status-text">Security Workspace</span>
            <div className="topbar-avatar">
              <ShieldCheck size={18} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="main-content">
          {renderPage(page, navigate)}
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <span>PhishGuard Pro</span>
          <span>Cybersecurity Investigation Toolkit</span>
        </footer>
      </main>
    </div>
  );
}
