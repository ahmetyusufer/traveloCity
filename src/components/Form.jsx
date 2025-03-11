// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";
import { useUrlPosition } from "../hooks/useUrlPosition";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [emoji, setEmoji] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [geocodingError, setGeocodingError] = useState("");
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const navigate = useNavigate();
  const { createCity } = useCities();
  const { lat, lng } = useUrlPosition();

  useEffect(() => {
    if (!lat && !lng) {
      return;
    }
    async function fetchReverseData() {
      try {
        setIsGeoLoading(true);
        setGeocodingError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (data.city === "") {
          throw new Error(
            "that doens't seem to be a city, click somewehere else."
          );
        }
        setCityName(data.principalSubdivision);
        setEmoji(convertToEmoji(data.countryCode));
        setCountry(data.countryName);
      } catch (err) {
        setGeocodingError(err.message);
      } finally {
        setIsGeoLoading(false);
      }
    }
    fetchReverseData();
  }, [lat, lng]);

  function handleSubmit(e) {
    e.preventDefault();
  }

  if (geocodingError) {
    return <Message message={geocodingError} />;
  }

  if (isGeoLoading) {
    return <Spinner />;
  }

  if (!lat && !lng) {
    return <Message message={"Start by clicking somewhere on the map"} />;
  }

  function handleAddCity() {
    navigate("/app/cities");
    const newCity = {
      cityName,
      emoji,
      date,
      notes,
      country,
      position: { lat, lng },
    };

    createCity(newCity);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat={"dd/MM/yyyy"}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <BackButton />
        <Button type="primary" onClick={handleAddCity}>
          Add
        </Button>
      </div>
    </form>
  );
}

export default Form;
