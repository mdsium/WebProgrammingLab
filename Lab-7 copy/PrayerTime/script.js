export default class DataFetch {
    constructor(targetElementId) {
      this.city = "Dhaka"; // Fixed city
      this.country = "Bangladesh"; // Fixed country
      this.targetElementId = targetElementId;
      this.baseUrl = "http://api.aladhan.com/v1/timingsByCity";
      this.fajrDurationElement = null; // Placeholder for the duration element
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
  
    // Convert a 24-hour time string (HH:mm) to 12-hour format with AM/PM
    convertTo12Hour(time) {
      const [hours, minutes] = time.split(":").map(Number);
      const ampm = hours >= 12 ? "PM" : "AM";
      const convertedHours = hours % 12 || 12;
      return `${convertedHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
    }
  
    // Convert a time string (HH:mm) to total minutes since midnight
    timeToMinutes(time) {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }
  
    // Calculate the duration since Fajr
    calculateFajrDuration(fajrTime) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const fajrMinutes = this.timeToMinutes(fajrTime);
      const duration = currentMinutes - fajrMinutes;
  
      // Handle the case where Fajr hasn't occurred yet
      if (duration < 0) {
        return "Fajr not yet occurred";
      }
  
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours} hours, ${minutes} minutes`;
    }
  
    // Update the Fajr duration dynamically
    updateFajrDuration(fajrTime) {
      if (!this.fajrDurationElement) {
        this.fajrDurationElement = document.createElement("p");
        this.fajrDurationElement.id = "fajrDuration";
        document.body.appendChild(this.fajrDurationElement);
      }
  
      setInterval(() => {
        const duration = this.calculateFajrDuration(fajrTime);
        this.fajrDurationElement.innerText = `Time since Fajr: ${duration}`;
      }, 1000);
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
        const url = `${this.baseUrl}/${date}?city=${this.city}&country=${this.country}`;
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
  
      // Handle errors
      if (data.error) {
        target.innerHTML = `<p>${data.error}</p>`;
        return;
      }
  
      // Handle valid data
      if (data.data && data.data.timings) {
        const timings = data.data.timings;
        target.innerHTML = `
          <h3>Prayer Timings for Dhaka, Bangladesh</h3>
          <p>Date: ${this.getCurrentDate()} (${this.getCurrentTime()})</p>
          <ul>
            ${Object.entries(timings)
              .map(
                ([key, value]) =>
                  `<li><strong>${key}:</strong> ${this.convertTo12Hour(value)}</li>`
              )
              .join("")}
          </ul>`;
  
        // Start updating Fajr duration dynamically
        this.updateFajrDuration(timings.Fajr);
      } else {
        target.innerHTML = `<p>No valid data found</p>`;
      }
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
  