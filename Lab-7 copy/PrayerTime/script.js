export default class DataFetch {
  constructor(targetElementId) {
    this.city = "Dhaka"; // Fixed city
    this.country = "Bangladesh"; // Fixed country
    this.targetElementId = targetElementId;
    this.baseUrl = "http://api.aladhan.com/v1/timingsByCity";
    this.nextPrayerInterval = null; // Store interval for countdown
    this.initializeClock(); // Initialize the real-time clock
  }

  // Get the current date in YYYY-MM-DD format
  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Get the current time in 12-hour format (HH:MM:SS AM/PM)
  getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 (midnight) to 12
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  }

  // Convert a 24-hour time string (HH:mm) to a Date object
  parseTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    return now;
  }

  // Calculate time left until the next prayer
  getTimeUntil(nextPrayerTime) {
    const now = new Date();
    const diffMs = nextPrayerTime - now;
    if (diffMs <= 0) return "Now";
    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  // Initialize a clock that updates every second
  initializeClock() {
    const clockElement = document.createElement("p");
    clockElement.id = "realTimeClock";
    document.body.prepend(clockElement);

    setInterval(() => {
      const clock = document.getElementById("realTimeClock");
      if (clock) {
        clock.innerText = `Current Time: ${this.getCurrentTime()}`;
      }
    }, 1000);
  }

  async fetchData() {
    try {
      const date = this.getCurrentDate();
      const url = `${this.baseUrl}?city=${this.city}&country=${this.country}`;
      const response = await fetch(url);

      const data = await response.ok
        ? await response.json()
        : { error: `Error: ${response.status}` };

      this.updateDOM(data);
    } catch {
      this.updateDOM({ error: "Failed to fetch data" });
    }
  }

  updateDOM(data) {
    const target = document.getElementById(this.targetElementId);

    // Clear any previous interval for the countdown
    if (this.nextPrayerInterval) {
      clearInterval(this.nextPrayerInterval);
    }

    // Handle errors
    if (data.error) {
      target.innerHTML = `<p>${data.error}</p>`;
      return;
    }

    // Handle valid data
    if (data.data && data.data.timings) {
      const timings = data.data.timings;
      const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
      const sunriseTime = timings["Sunrise"];
      const sunsetTime = timings["Sunset"];
      const prayerTimes = prayerNames.map((name) => ({
        name,
        time: this.parseTime(timings[name]),
        time12Hour: this.convertTo12Hour(timings[name]),
      }));

      // Find the next prayer
      const now = new Date();
      const nextPrayer = prayerTimes.find((p) => p.time > now) || prayerTimes[0];

      // Set up real-time countdown for the next prayer
      const countdownElement = document.createElement("p");
      countdownElement.id = "countdownTimer";
      target.appendChild(countdownElement);

      this.nextPrayerInterval = setInterval(() => {
        const timeUntil = this.getTimeUntil(nextPrayer.time);
        countdownElement.innerText = `Time Until Next Prayer (${nextPrayer.name}): ${timeUntil}`;
        if (timeUntil === "Now") {
          clearInterval(this.nextPrayerInterval); // Stop countdown when the prayer starts
          this.fetchData(); // Refresh data
        }
      }, 1000);

      // Display prayer timings
      target.innerHTML = `
        <h3>Prayer Timings for Dhaka, Bangladesh</h3>
        <p>Date: ${this.getCurrentDate()} (${this.getCurrentTime()})</p>
        <ul>
          ${prayerTimes
            .map(
              (p) =>
                `<li><strong>${p.name}:</strong> ${p.time12Hour}</li>`
            )
            .join("")}
            <li><strong>Sunrise:</strong> ${this.convertTo12Hour(sunriseTime)}</li>
          <li><strong>Sunset:</strong> ${this.convertTo12Hour(sunsetTime)}</li>
        </ul>
        <h4>Next Prayer:</h4>
        <p>${nextPrayer.name} at ${nextPrayer.time12Hour}</p>
      `;
      target.appendChild(countdownElement); // Add the countdown below prayer times
    } else {
      target.innerHTML = `<p>No valid data found</p>`;
    }
  }

  // Convert a 24-hour time string (HH:mm) to 12-hour format with AM/PM
  convertTo12Hour(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const convertedHours = hours % 12 || 12;
    return `${convertedHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
  }
}

// Usage Example
const targetElementId = "dataDisplay"; // Replace with the ID of the element where data will be displayed
const fetcher = new DataFetch(targetElementId);

// Automatically fetch data on page load
fetcher.fetchData();

// Optionally, set up a button to refresh data manually
document
  .getElementById("fetchButton")
  .addEventListener("click", () => fetcher.fetchData());
