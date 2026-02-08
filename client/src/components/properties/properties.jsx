import React, { useEffect, useState } from "react";
import Back from "../common/Back";
import RecentCard from "../home/recent/RecentCard";
import "../home/recent/recent.css";
import "./properties.css";
import img from "../images/properties.jpg";
import Searchbar from "../../components/SearchBar/Searchbar";
import { PuffLoader } from "react-spinners";
import { useResidencyStore } from "../../store/useResidencyStore";
import { motion } from "framer-motion";

const Properties = () => {
  const { residencies, fetchAllResidencies, loading } = useResidencyStore();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchAllResidencies();
  }, [fetchAllResidencies]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="wrapper flex-center" style={{ height: "85vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  const filteredResidencies = residencies.filter((property) =>
    [property.title, property.city, property.country, property.address]
      .some((field) => field?.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <motion.div
      className="properties-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <section className="properties-hero">
        <Back name="Our Properties" title="Explore Your New Home Today" cover={img} />
      </section>

      <section className="properties-main section">
        <div className="container">
          <div className="properties-search-wrapper">
            <Searchbar filter={filter} setFilter={setFilter} />
          </div>

          <motion.div
            className="properties-grid"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {filteredResidencies.length > 0 ? (
              filteredResidencies.map((card, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                >
                  <RecentCard card={card} />
                </motion.div>
              ))
            ) : (
              <div className="no-results-box">
                <p>No properties found matching your search criteria.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Properties;
