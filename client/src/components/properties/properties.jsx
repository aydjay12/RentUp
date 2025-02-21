import React, { useEffect, useState } from "react";
import Back from "../common/Back";
import RecentCard from "../home/recent/RecentCard";
import "../home/recent/recent.css";
import "./properties.css";
import img from "../images/about.jpg";
import Searchbar from "../../components/SearchBar/Searchbar";
import { PuffLoader } from "react-spinners";
import { useResidencyStore } from "../../store/useResidencyStore"; // Import Zustand store

const Properties = () => {
  const { residencies, fetchAllResidencies, loading } = useResidencyStore();
  const [filter, setFilter] = useState("");

  // Fetch properties when component mounts
  useEffect(() => {
    fetchAllResidencies();
  }, []);

  if (loading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  // Filter properties based on search input
  const filteredResidencies = residencies.filter((property) =>
    [property.title, property.city, property.country, property.address]
      .some((field) => field.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div>
      <section className="blog-out mb">
        <Back name="Properties" title="Properties - Our Properties" cover={img} />
      </section>
      <div className="flexColCenter paddings properties-container">
        <Searchbar filter={filter} setFilter={setFilter} />
        <div className="paddings flexCenter properties">
          {filteredResidencies.length > 0 ? (
            filteredResidencies.map((card, i) => <RecentCard card={card} key={i} />)
          ) : (
            <p className="no-properties">No Properties Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
