import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
  (error) => {
    return Promise.reject(error);
});

export default axiosInstance;


// // Handle token refresh on 401 errors (optional but useful)
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       const refreshToken = localStorage.getItem('refresh_token');
//       if (refreshToken) {
//         try {
//           const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
//             refresh: refreshToken
//           });
//           localStorage.setItem('access_token', response.data.access);
//           originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
//           return axiosInstance(originalRequest);
//         } catch (err) {
//           localStorage.removeItem('access_token');
//           localStorage.removeItem('refresh_token');
//           window.location.href = '/login';
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );











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
