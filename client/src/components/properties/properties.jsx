import React, { useState } from "react";
import Back from "../common/Back";
import RecentCard from "../home/recent/RecentCard";
import "../home/recent/recent.css";
import "./properties.css";
import img from "../images/about.jpg";
import Searchbar from "../../components/SearchBar/Searchbar";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";

const properties = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");

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
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#27ae60"
          aria-label="puff-loading"
        />
      </div>
    );
  }
  return (
    <div>
      <section className="blog-out mb">
        <Back
          name="Properties"
          title="Properties - Our Properties"
          cover={img}
        />
      </section>
      <div className="flexColCenter paddings properties-container">
        <Searchbar filter={filter} setFilter={setFilter} />
        <div className="paddings flexCenter properties">
          {data
            .filter(
              (property) =>
                property.title.toLowerCase().includes(filter.toLowerCase()) ||
                property.city.toLowerCase().includes(filter.toLowerCase()) ||
                property.country.toLowerCase().includes(filter.toLowerCase()) ||
                property.address.toLowerCase().includes(filter.toLowerCase())
            )
            .map((card, i) => (
              <RecentCard card={card} key={i} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default properties;
