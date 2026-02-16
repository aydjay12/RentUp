import { useEffect } from "react";
import { useResidencyStore } from "../../store/useResidencyStore";
import { PuffLoader } from "react-spinners";
import ResidencyCard from "./ResidencyCard";
import styles from "./PeopleAlsoBought.module.scss";

const PeopleAlsoBought = () => {
  const { recommendedResidencies, fetchRecommendations, loading } = useResidencyStore();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader color="#27ae60" aria-label="puff-loading" />
      </div>
    );
  }

  return (
    <div className={styles["people-also-bought"]}>
      <h3>People also bought</h3>
      <div className={styles["grid-container"]}>
        {recommendedResidencies.slice(0, 3).map((residency) => (
          <ResidencyCard key={residency._id} residency={residency} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
