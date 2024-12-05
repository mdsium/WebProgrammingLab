export default class MonthlyPrayerTimes {
  constructor(targetElementId) {
    this.city = "Dhaka"; // Fixed city
    this.country = "Bangladesh"; // Fixed country
    this.targetElementId = targetElementId;
    this.baseUrl = "http://api.aladhan.com/v1/calendarByCity"; // API for monthly data
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
  parseTime(time, date) {
    const [hours, minutes] = time.split(":").map(Number);
    const parsedDate = new Date(date);
    parsedDate.setHours(hours, minutes, 0, 0);
    return parsedDate;
  }

  // Convert a 24-hour time string to 12-hour format
  convertTo12Hour(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const convertedHours = hours % 12 || 12;
    return `${convertedHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
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

  async fetchMonthlyData() {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const url = `${this.baseUrl}?city=${this.city}&country=${this.country}&month=${month}&year=${year}`;

      const response = await fetch(url);

      const data = await response.ok
        ? await response.json()
        : { error: `Error: ${response.status}` };

      this.updateMonthlyDOM(data);
    } catch {
      this.updateMonthlyDOM({ error: "Failed to fetch data" });
    }
  }

  updateMonthlyDOM(data) {
    const target = document.getElementById(this.targetElementId);

    // Handle errors
    if (data.error) {
      target.innerHTML = `<p>${data.error}</p>`;
      return;
    }

    // Handle valid data
    if (data.data) {
      const currentDate = this.getCurrentDate();
      const now = new Date();
      const monthData = data.data;
      let nextPrayer = null;
      let nextPrayerTime = null;

      // Prepare table rows for each day
      const rows = monthData
        .map((day) => {
          const timings = day.timings;
          const date = day.date.readable;
          const prayerTimes = [
            "Fajr",
            "Dhuhr",
            "Asr",
            "Maghrib",
            "Isha",
          ].map((name) => ({
            name,
            time: this.parseTime(timings[name].split(" ")[0], date),
            time12Hour: this.convertTo12Hour(timings[name].split(" ")[0]),
          }));

          // Find the next prayer
          if (!nextPrayer) {
            for (const prayer of prayerTimes) {
              if (prayer.time > now) {
                nextPrayer = prayer.name;
                nextPrayerTime = prayer.time;
                break;
              }
            }
          }

          return `
            <tr>
              <td>${date}</td>
              ${prayerTimes
                .map((p) => `<td>${p.time12Hour}</td>`)
                .join("")}
            </tr>
          `;
        })
        .join("");

      // Start countdown for the next prayer
      const countdownElement = document.createElement("p");
      countdownElement.id = "countdownTimer";
      target.appendChild(countdownElement);

      if (nextPrayer && nextPrayerTime) {
        setInterval(() => {
          const timeUntil = this.getTimeUntil(nextPrayerTime);
          countdownElement.innerText = `Time Until Next Prayer (${nextPrayer}): ${timeUntil}`;
        }, 1000);
      } else {
        countdownElement.innerText = "No upcoming prayers today.";
      }

      // Display table with prayer timings
      target.innerHTML = `
        <h3>Monthly Prayer Timings for Dhaka, Bangladesh</h3>
        <p>Date: ${currentDate}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Fajr</th>
              <th>Dhuhr</th>
              <th>Asr</th>
              <th>Maghrib</th>
              <th>Isha</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
      target.appendChild(countdownElement); // Add countdown below the table
    } else {
      target.innerHTML = `<p>No valid data found</p>`;
    }
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
}

// Usage Example
const targetElementId = "dataDisplay"; // Replace with the ID of the element where data will be displayed
const fetcher = new MonthlyPrayerTimes(targetElementId);

// Automatically fetch data on page load
fetcher.fetchMonthlyData();

// Optionally, set up a button to refresh data manually
document
  .getElementById("fetchButton")
  .addEventListener("click", () => fetcher.fetchMonthlyData());
