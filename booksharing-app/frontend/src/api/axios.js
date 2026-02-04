import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

// concept to understand

// function create(config) {
//   // Takes the config you passed
//   // Creates a new object that has all axios methods (get, post, put, delete)
//   // But with your custom defaults applied
  
//   const newInstance = {
//     // Your custom config
//     baseURL: config.baseURL,
//     timeout: config.timeout,
//     headers: config.headers,
    
//     // Methods you can use
//     get: function(url, options) {
//       // Uses baseURL + url
//       // Applies your headers
//       // Returns a promise
//     },
    
//     post: function(url, data, options) {
//       // Same thing but for POST
//     },
    
//     // ... more methods
//   };
  
//   return newInstance;
// }

// // So when you do this:
// const axiosInstance = axios.create({ baseURL: '...' });

// // It's like doing:
// const axiosInstance = create({ baseURL: '...' });
