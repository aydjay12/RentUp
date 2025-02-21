import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, PlusCircle, ShoppingBasket, Mail } from "lucide-react";
import AnalyticsTab from "./AnalyticsTab";
import CreateResidencyForm from "./CreateResidencyForm";
import Inbox from "./Inbox";
import ResidenciesList from "./ResidenciesList";
import styles from "./AdminPage.module.scss";

const tabs = [
  { id: "create", label: "Create", icon: PlusCircle },
  { id: "residencies", label: "Residencies", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
  { id: "inbox", label: "Inbox", icon: Mail },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "create"; // Load from localStorage or default to "create"
  });

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className={`${styles.container} min-h-screen relative`}>
      <motion.h1
        className={styles.h1}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Admin Dashboard
      </motion.h1>

      {/* Tabs Navigation */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className={styles.icon} />
            {tab.label}
          </div>
        ))}
      </div>

      {/* Tabs Content */}
      <div className={styles.tabContent}>
        <AnimatePresence mode="wait">
          {activeTab === "create" && (
            <motion.div key="create" {...tabMotion}>
              <CreateResidencyForm />
            </motion.div>
          )}
          {activeTab === "residencies" && (
            <motion.div key="residencies" {...tabMotion}>
              <ResidenciesList />
            </motion.div>
          )}
          {activeTab === "analytics" && (
            <motion.div key="analytics" {...tabMotion}>
              <AnalyticsTab />
            </motion.div>
          )}
          {activeTab === "inbox" && (
            <motion.div key="inbox" {...tabMotion}>
              <Inbox />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Animation Config
const tabMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 },
};

export default AdminPage;
