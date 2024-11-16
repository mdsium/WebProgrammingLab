export default class DataFetch {
    constructor(url, targetElementId) {
      this.url = url;
      this.targetElementId = targetElementId;
    }
    async fetchData() {
      try {
        const response = await fetch(this.url);
        const data = await response.ok ? await response.json() : { error: `Error: ${response.status}` };
        this.updateDOM(data);
      } catch {
        this.updateDOM({ error: 'Failed to fetch data' }); 
      }
    }
    updateDOM(data) {
      const target = document.getElementById(this.targetElementId);
      target.innerHTML = data.error ? data.error : `<ul>${data.map(item => `<li>User Id: ${item.userId} ||  ID: ${item.id} || Title: ${item.title} </li>`).join('')}</ul>`;
    //   ${JSON.stringify(item)}
    }
  }