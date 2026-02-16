import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/Searchbar";
import { PuffLoader } from "react-spinners";
import "../properties/properties.css";
import { useAuthStore } from "../../store/authStore";
import { useResidencyStore } from "../../store/useResidencyStore";
import RecentCard from "../home/recent/RecentCard";
import { motion, AnimatePresence } from "framer-motion";
import Back from "../common/Back";
import img from "../images/favourites.jpg";
import { Heart, AlertCircle } from "lucide-react";

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const Favourites = () => {
  const { favorites, getAllFav } = useAuthStore();
  const { residencies, fetchAllResidencies, loading, isError } = useResidencyStore();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getAllFav();
    fetchAllResidencies();
  }, []);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="wrapper flex-center" style={{ height: "85vh" }}>
        <PuffLoader color="#27ae60" size={80} aria-label="puff-loading" />
      </div>
    );
  }

  const favoriteResidencies = residencies.filter((property) =>
    (favorites || []).includes(property._id)
  );

  const filteredFavorites = favoriteResidencies.filter((property) =>
    [
      property.title,
      property.city,
      property.country,
      property.address,
    ].some((field) =>
      field?.toLowerCase().includes(filter.toLowerCase())
    )
  );

  return (
    <motion.div
      className="properties-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <section className="properties-hero">
        <Back
          name="Favourite Properties"
          title="Your Saved Properties"
          cover={img}
        />
      </section>

      <section className="properties-main section">
        <div className="container">
          <div className="properties-search-wrapper">
            <SearchBar filter={filter} setFilter={setFilter} />
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
            {isError ? (
              <motion.div
                className="no-results-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AlertCircle size={48} style={{ color: "#e74c3c", marginBottom: "1rem" }} />
                <p style={{ color: "#e74c3c" }}>
                  Error while fetching property data. Please try again later.
                </p>
              </motion.div>
            ) : filteredFavorites.length > 0 ? (
              <AnimatePresence mode='popLayout'>
                {filteredFavorites.map((card, i) => (
                  <motion.div
                    key={card._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  >
                    <RecentCard card={card} />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : favoriteResidencies.length === 0 ? (
              <motion.div
                className="no-results-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Heart size={48} className="nothing-icon" />
                <p>No properties have been added to your favourites yet.</p>
                <p style={{ fontSize: "0.95rem", marginTop: "0.5rem", opacity: 0.8 }}>
                  Start exploring and save properties you love!
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="no-results-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Heart size={48} className="nothing-icon" />
                <p>No favourite properties match your search criteria.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Favourites;
