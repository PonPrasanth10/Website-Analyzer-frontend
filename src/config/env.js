// Environment configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api'
  },
  production: {
    API_BASE_URL: 'https://website-analyzer-backend-vo9a.onrender.com/api'
  }
};

const env = import.meta.env.MODE || 'development';
export default config[env];