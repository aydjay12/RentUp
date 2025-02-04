import React, { useContext, useState } from "react";
import SearchBar from "../../components/SearchBar/Searchbar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import "../Properties/Properties.css";
import UserDetailContext from "../../context/UserDetailContext";
import RecentCard from "../home/recent/RecentCard";
import { motion } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const Favourites = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const {
    userDetails: { favourites },
  } = useContext(UserDetailContext);

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />
        <motion.div className="paddings flexCenter properties">
          {data
            .filter((property) => (favourites || []).includes(property.id))
            .filter((property) =>
              [property.title, property.city, property.country, property.address]
                .some((field) => field.toLowerCase().includes(filter.toLowerCase()))
            )
            .map((card, i) => (
              <motion.div key={card.id} variants={listVariants} custom={i} initial="hidden" animate="visible">
                <RecentCard card={card} />
              </motion.div>
            ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Favourites;
