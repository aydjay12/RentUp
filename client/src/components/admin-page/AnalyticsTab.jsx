import { motion } from "framer-motion";
import { useEffect } from "react";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./AnalyticsTab.module.scss";
import { useAnalyticsStore } from "../../store/useAnalyticsStore";
import { PuffLoader } from "react-spinners";

const AnalyticsTab = () => {
  const { analyticsData, dailySalesData, loading, error, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-container">
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-loading-container" style={{ flexDirection: 'column', padding: '3rem' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" style={{ margin: '0 auto 1.5rem' }}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 style={{ fontFamily: "'Merriweather', serif", fontSize: '1.8rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: 600 }}>Failed to Load</h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-light)', marginBottom: '2rem', textAlign: 'center' }}>{error || 'Unable to fetch analytics data.'}</p>
        <button className="admin-confirm-button" onClick={() => fetchAnalytics()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.grid}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
        />
        <AnalyticsCard
          title="Total Residencies"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
      </motion.div>

      <motion.div
        className={styles.chartContainer}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className={styles.chartTitle}>Business Performance</h2>
        <div className={styles.responsiveWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                yAxisId="left"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value >= 1000 ? `${value / 1000}k` : value}`}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#27ae60"
                strokeWidth={4}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Sales"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#1f3e72"
                strokeWidth={4}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon }) => (
  <motion.div
    className={styles.analyticsCard}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <div className={styles.analyticsCardHeader}>
      <div className={styles.analyticsCardInfo}>
        <p className={styles.analyticsCardTitle}>{title}</p>
        <h3 className={styles.analyticsCardValue}>{value}</h3>
      </div>
      <div className={styles.analyticsCardIcon}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);