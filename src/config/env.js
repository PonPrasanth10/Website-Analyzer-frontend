// Environment configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api'
  },
  production: {
    API_BASE_URL: '/api' // Assumes frontend and backend are served from same domain
  }
};

const env = import.meta.env.MODE || 'development';
export default config[env];