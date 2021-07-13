import { environment } from '../environments/environments';
import ApiService from './ApiService';
import { getAuth } from './AuthService';

class CommonService {

  constructor(service_path) {
    this.service_path = service_path;
    this.host = environment.hostName;
    this.port = environment.port;
    this.url = service_path;
  }

  create(domain) {
    domain.id= null;
    return ApiService.post(this.url, domain);
  }

  update(domain) {
    return ApiService.patch(this.url + '/' + domain.id, domain);
  }

  updateAllWithouBody() {
    return ApiService.patch(this.url);
  }

  getAll() {
    return ApiService.get(this.url);
  }

  getWithParams(params) {
    return ApiService.get(this.url + "?" + params);
  }

  getById(id) {
    return ApiService.get(this.url + '/' + id);
  }

  delete(domain) {
    return ApiService.delete(this.url + '/' + domain.id);
  }

}

export default CommonService;
