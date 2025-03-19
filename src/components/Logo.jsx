import styles from "./Logo.module.css";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/">
      <h1 className={styles.logo}>TraveloCity</h1>
    </Link>
  );
}

export default Logo;
