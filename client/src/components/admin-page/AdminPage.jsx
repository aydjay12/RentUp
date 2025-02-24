import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, PlusCircle, ShoppingBasket, Mail } from "lucide-react";
import AnalyticsTab from "./AnalyticsTab";
import CreateResidencyForm from "./CreateResidencyForm";
import Inbox from "./Inbox";
import ResidenciesList from "./ResidenciesList";
import styles from "./AdminPage.module.scss";
import { Burger, Menu } from "@mantine/core";

const tabs = [
  { id: "create", label: "Create Residency", icon: PlusCircle },
  { id: "residencies", label: "Residencies", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
  { id: "inbox", label: "Inbox", icon: Mail },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "create";
  });
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setOpened(false);
  };

  return (
    <div className={`${styles.container} min-h-screen relative`}>
      <div className={styles.header}>
        <motion.h1
          className={styles.h1}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Admin Dashboard
        </motion.h1>
        {/* Mobile Toggle Menu */}
        <div className={styles.mobileToggle}>
          <Menu
            opened={opened}
            onClose={() => setOpened(false)}
            width={200}
            position="bottom" // Center under the Burger
            offset={10} // ~3cm spacing
            withinPortal // Ensures dropdown renders in a portal for correct positioning
          >
            <Menu.Target>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size={24}
                color="#27ae60"
                aria-label="Toggle menu"
                className={styles.burger}
              />
            </Menu.Target>
            <Menu.Dropdown className={styles.menuDropdown}>
              {tabs.map((tab) => (
                <Menu.Item
                  key={tab.id}
                  leftSection={<tab.icon size={16} />}
                  onClick={() => handleTabSelect(tab.id)}
                  className={activeTab === tab.id ? styles.activeMenuItem : ""}
                >
                  {tab.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>

      {/* Tabs Navigation (Desktop Only) */}
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