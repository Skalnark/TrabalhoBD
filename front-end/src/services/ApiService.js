import axios from 'axios';
import { environment } from 'environments/environments.js';
import { getAuth } from './AuthService';

const ApiService = axios.create({
  baseURL: environment.hostName + ':' + environment.port
});

ApiService.interceptors.request.use(async config => {
  const auth = getAuth();

  return auth;
});

export default ApiService;
