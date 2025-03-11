import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";

function CityItem({ city }) {
  const { deleteCity } = useCities();

  const formatData = (date) => {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const { id, emoji, cityName, date, position } = city;
  return (
    <Link
      className={styles.cityItem}
      to={`${id}?lat=${position.lat}&lng=${position.lng}`}
    >
      <span className={styles.emoji}>{emoji}</span>
      <h3 className={styles.name}>{cityName}</h3>
      <time className={styles.time}>({formatData(date)})</time>
      <button
        className={styles.deleteBtn}
        onClick={(e) => {
          e.preventDefault();
          deleteCity(id);
        }}
      >
        &times;
      </button>
    </Link>
  );
}

export default CityItem;
