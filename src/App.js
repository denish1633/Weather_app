import React, { useEffect, useState } from "react";
import "./index.css";
const api = {
  key: "230b9238ec784ddcab9222428211611",
  base: "http://api.weatherapi.com/v1/current.json?",
};

const imageApi = {
  key: "DZtyEkCtDfJ0zy2SYMhbNsCR1srhGcqD_CgWss8VsUc",
  base: "https://api.unsplash.com/search/photos?",
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [photos, setPhotos] = useState([]);

  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}key=${api.key}&q=${query}&aqi=no`)
        .then((res) => res.json())
        .then((result) => {
          setWeather(result);
          setQuery("");
          if (result.error) {
            alert(result.error.message);
          } else {
            fetch(
              `${imageApi.base}query=${result.location.name}&client_id=${imageApi.key}`
            )
              .then((ans) => ans.json())
              .then((data) => {
                console.log(data);
                setPhotos(
                  data?.results[Math.floor(Math.random() * data.results.length)]
                    ?.urls?.raw
                );
              });

            console.log(result);
          }
        });
    }
  };

  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });
  }, [lat, long]);

  const currentLocation = (evt) => {
    fetch(`${api.base}key=${api.key}&q=${lat},${long}&aqi=no`)
      .then((res) => res.json())
      .then((result) => {
        setWeather(result);
        setQuery("");
        if (result.error) {
          alert(result.error.message);
        } else {
          fetch(
            `${imageApi.base}query=${result.location.name}&client_id=${imageApi.key}`
          )
            .then((ans) => ans.json())
            .then((data) => {
              console.log(data);
              setPhotos(
                data?.results[Math.floor(Math.random() * data.results.length)]
                  ?.urls?.raw
              );
            });

          console.log(result);
        }
      });
  };

  const dateBuilder = (d) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getYear();

    return `${day}, ${date} ${month} ${year}`;
  };
  const style = {
    backgroundImage: `url(${photos})`,
    height: "100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
     
  };

  return (
    <div className="app" style={style}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search Location"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />

          <button type="button" className="current" onClick={currentLocation}>
            Current
          </button>
        </div>

        {typeof weather.location != "undefined" ? (
          <div>
            <div className="location-box">
              <div className="location">
                {weather.location.name},{weather.location.country}
              </div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">
                <img
                  src={weather.current.condition.icon}
                  alt=""
                  className="weatherIcon"
                />
                {Math.round(weather.current.temp_c)}&#176;c
              </div>
              <div className="weather">{weather.current.condition.text}</div>
            </div>
          </div>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}

export default App;
