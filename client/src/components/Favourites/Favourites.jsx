import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/Searchbar";
import { PuffLoader } from "react-spinners";
import "../properties/properties.css";
import { useAuthStore } from "../../store/authStore";
import { useResidencyStore } from "../../store/useResidencyStore";
import RecentCard from "../home/recent/RecentCard";
import { motion } from "framer-motion";
import Back from "../common/Back";
import img from "../images/favourites.jpg";

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const Favourites = () => {
  const { favourites, getAllFav } = useAuthStore();
  const { residencies, fetchAllResidencies, loading } = useResidencyStore();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getAllFav(); // Fetch user's favorites
    fetchAllResidencies(); // Fetch all residencies
  }, []);

  if (loading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  const favoriteResidencies = residencies.filter((property) =>
    (favourites || []).includes(property._id)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className="blog-out mb">
        <Back
          name="Favourite Properties"
          title="Your Favourite Properties"
          cover={img}
        />
      </section>
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />
        <motion.div className="paddings flexCenter properties">
          {favoriteResidencies.length > 0 ? (
            favoriteResidencies
              .filter((property) =>
                [
                  property.title,
                  property.city,
                  property.country,
                  property.address,
                ].some((field) =>
                  field.toLowerCase().includes(filter.toLowerCase())
                )
              )
              .map((card, i) => (
                <motion.div
                  key={card._id}
                  variants={listVariants}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                >
                  <RecentCard card={card} />
                </motion.div>
              ))
          ) : (
            <motion.div
              className="no-favourites"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: "1rem",
                color: "#2d3954",
                marginBottom: "4rem",
                fontWeight: "600",
              }}
            >
              No residency has been added to Favourites
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Favourites;
