import CommonService from './CommonService';
import ApiService from './ApiService';

export default class FilesService extends CommonService {

  validate(domain) {
    var date = new Date(domain.dataProcessamento.replaceAll('-', '/'));
    date = date.toLocaleDateString().replaceAll('/', '');
    var data = {
      dataDeProcessamento: date,
      file : domain
    };
    if(domain !== undefined) {
      delete domain['dataProcessamento'];
      return ApiService.post(this.service_path + '/validate', data);
    }
    return null;
  }

  upload(file, config, codEmissor) {

    var formData = new FormData();

    formData.append('file', file);
    formData.append('codEmissor', codEmissor)

    return ApiService.post(this.service_path, formData, config);
  }
}