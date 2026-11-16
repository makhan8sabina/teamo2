(function () {
  "use strict";

  const cards = document.getElementById("weather-cards");
  const statusBox = document.getElementById("weather-status");
  if (!cards || !statusBox) return;

  const URL = "https://api.open-meteo.com/v1/forecast" +
    "?latitude=51.17&longitude=71.45" +
    "&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
    "&timezone=Asia%2FAlmaty&forecast_days=7";

  function describe(code) {
    if (code === 0) return ["☀️", "Clear sky"];
    if (code <= 2) return ["🌤️", "Partly cloudy"];
    if (code === 3) return ["☁️", "Overcast"];
    if (code === 45 || code === 48) return ["🌫️", "Fog"];
    if (code >= 51 && code <= 57) return ["🌦️", "Drizzle"];
    if (code >= 61 && code <= 67) return ["🌧️", "Rain"];
    if (code >= 71 && code <= 77) return ["🌨️", "Snow"];
    if (code >= 80 && code <= 82) return ["🌦️", "Rain showers"];
    if (code === 85 || code === 86) return ["🌨️", "Snow showers"];
    if (code >= 95) return ["⛈️", "Thunderstorm"];
    return ["🌡️", "Unknown"];
  }

  function verdict(code, max, rain) {
    if (code >= 95) return { text: "Thunderstorm: stay off the pitch", level: "danger" };
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
      return { text: "Snow: wear warm boots", level: "info" };
    }
    if (rain >= 60 || (code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return { text: "Rain likely: bring a jacket", level: "warning" };
    }
    if (max >= 30) return { text: "Hot: bring water", level: "warning" };
    if (max <= -10) return { text: "Freezing: dress in layers", level: "info" };
    return { text: "Good football weather", level: "success" };
  }

  function showLoading() {
    statusBox.innerHTML =
      '<div class="d-flex align-items-center gap-2" role="status">' +
      '<span class="spinner-border spinner-border-sm text-primary" aria-hidden="true"></span>' +
      "<span>Loading forecast…</span></div>";
  }

  function showError(message) {
    statusBox.innerHTML = "";
    const alert = document.createElement("div");
    alert.className = "alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-2";
    alert.setAttribute("role", "alert");

    const text = document.createElement("span");
    text.textContent = message;

    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn btn-sm btn-outline-danger";
    retry.textContent = "Try again";
    retry.addEventListener("click", loadWeather);

    alert.appendChild(text);
    alert.appendChild(retry);
    statusBox.appendChild(alert);
  }

  function render(daily) {
    cards.innerHTML = "";

    daily.time.forEach(function (isoDate, i) {
      const info = describe(daily.weathercode[i]);
      const max = Math.round(daily.temperature_2m_max[i]);
      const min = Math.round(daily.temperature_2m_min[i]);
      const rain = daily.precipitation_probability_max[i] || 0;
      const tip = verdict(daily.weathercode[i], max, rain);
      const date = new Date(isoDate + "T12:00:00");

      const col = document.createElement("div");
      col.className = "col-6 col-md-3 col-lg";

      const card = document.createElement("div");
      card.className = "card weather-card h-100 text-center";

      const body = document.createElement("div");
      body.className = "card-body p-3";

      function line(tag, className, text) {
        const el = document.createElement(tag);
        el.className = className;
        el.textContent = text;
        body.appendChild(el);
      }

      line("p", "fw-bold mb-0", date.toLocaleDateString("en-GB", { weekday: "short" }));
      line("p", "small text-body-secondary mb-1", date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }));
      line("p", "weather-icon mb-1", info[0]);
      line("p", "small mb-1", info[1]);
      line("p", "fw-semibold mb-1", max + "° / " + min + "°");
      line("p", "small mb-2", "Rain chance: " + rain + "%");
      line("span", "badge text-bg-" + tip.level + " text-wrap", tip.text);

      card.appendChild(body);
      col.appendChild(card);
      cards.appendChild(col);
    });
  }

  async function loadWeather() {
    cards.innerHTML = "";
    showLoading();

    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, 8000);

    try {
      const response = await fetch(URL, { signal: controller.signal });
      if (!response.ok) throw new Error("Server responded with " + response.status);

      const data = await response.json();
      if (!data.daily || !data.daily.time) throw new Error("Unexpected response format");

      render(data.daily);
      statusBox.innerHTML = "";
    } catch (err) {
      showError(err.name === "AbortError"
        ? "The weather service took too long to respond."
        : "Could not load the forecast. Check your connection and try again.");
    } finally {
      clearTimeout(timer);
    }
  }

  loadWeather();
})();