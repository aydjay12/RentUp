import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, PlusCircle, ShoppingBasket, Mail, Home, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AnalyticsTab from "./AnalyticsTab";
import CreateResidencyForm from "./CreateResidencyForm";
import Inbox from "./Inbox";
import ResidenciesList from "./ResidenciesList";
import Logo from "../pics/logo-light.png";
import "../../styles/admin-page.css";

const tabs = [
  { id: "create", label: "Create Residency", icon: PlusCircle, description: "Add new property listings to your database" },
  { id: "residencies", label: "Residencies", icon: ShoppingBasket, description: "Manage and monitor all active property listings" },
  { id: "analytics", label: "Analytics", icon: BarChart, description: "View insights and performance metrics" },
  { id: "inbox", label: "Inbox", icon: Mail, description: "Communicate with potential buyers and tenants" },
];

const AdminPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || "create";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!tab) {
      navigate("/admin-dashboard/create", { replace: true });
    }
  }, [tab, navigate]);

  const handleTabSelect = (tabId) => {
    navigate(`/admin-dashboard/${tabId}`);
    setSidebarOpen(false);
  };

  const handleBackToUser = () => {
    navigate("/");
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="admin-page-container">
      {/* Mobile Header - Shows Title & Subtitle */}
      <div className="admin-mobile-header">
        <div className="admin-mobile-header-content">
          <h2 className="admin-mobile-title">{currentTab?.label}</h2>
          <span className="admin-mobile-subtitle">{currentTab?.description}</span>
        </div>
      </div>

      {/* Sidebar Overlay - Now z-indexed to cover header if needed */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Toggle Button - Right/Left Arrow Icon - Hidden on Desktop via CSS */}
        <button
          className="admin-sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        <div className="admin-sidebar-header">
          <img src={Logo} alt="RentUp Logo" className="admin-logo-img" />
          <div className="admin-sidebar-subtitle">Cloud Administration</div>
        </div>

        <nav className="admin-sidebar-nav">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabSelect(tab.id)}
            >
              <tab.icon className="admin-nav-icon" />
              <span className="admin-nav-label">{tab.label}</span>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-back-to-user-btn"
            onClick={handleBackToUser}
          >
            <Home size={18} />
            <span>Customer Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {/* Desktop Header */}
        <header className="admin-content-header">
          <div className="admin-header-title-area">
            <h1 className="admin-content-title">{currentTab?.label}</h1>
            <span className="admin-header-subtitle">{currentTab?.description}</span>
          </div>
          <div className="admin-header-actions"></div>
        </header>

        <div className="admin-content-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="admin-tab-container"
            >
              {activeTab === "create" && <CreateResidencyForm />}
              {activeTab === "residencies" && <ResidenciesList />}
              {activeTab === "analytics" && <AnalyticsTab />}
              {activeTab === "inbox" && <Inbox />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;