import React from "react";
import Heading from "../../common/Heading";
import "./recent.css";
import RecentCard from "./RecentCard";
import useProperties from "../../../hooks/useProperties";
import { PuffLoader } from "react-spinners";

const Recent = () => {
  const { data, isError, isLoading } = useProperties();

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
    <>
      <section className="recent">
        <div className="container">
          <Heading
            title="Recent Property Listed"
            subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
          />
          <div className="recent-container">
            {data.slice(0, 6).map((card, i) => (
              <RecentCard key={i} card={card} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Recent;
