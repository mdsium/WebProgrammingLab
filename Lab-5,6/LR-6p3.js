import DataFetcher from './dataFetch.js';
    const fetcher = new DataFetcher('https://jsonplaceholder.typicode.com/posts', 'dataDisplay');
    document.getElementById('fetchButton').addEventListener('click', () => fetcher.fetchData());