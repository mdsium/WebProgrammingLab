export default class DataFetch {
  constructor(url, targetElementId) {
    this.url = url;
    this.targetElementId = targetElementId;
  }

  async fetchData() {
    try {
      const response = await fetch(this.url);
      const data = await response.ok ? await response.json(): { error: `Error: ${response.status}` };
      this.updateDOM(data);
    } catch {
      this.updateDOM({ error: 'Failed to fetch data' });
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
    if (data.results) {
      target.innerHTML = `
        <ul>
          <li>Date: ${data.results.date}</li>
          <li>Sunrise: ${data.results.sunrise}</li>
          <li>Sunset: ${data.results.sunset}</li>
          <li>Sunset: ${data.results.timezone}</li>
        </ul>`;
    } else {
      target.innerHTML = `<p>No valid data found</p>`;
    }
  }
}
