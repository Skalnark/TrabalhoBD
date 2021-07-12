import { environment } from "environments/environments.js";
import { getToken } from './AuthService';
import { EventSourcePolyfill } from 'event-source-polyfill';

var EventSourceService = (function () {
	var instance;

	function createInstance() {
		var eventSource = new EventSourcePolyfill(
			environment.hostName + ":" + environment.port + "/api/dashboard", {headers: {
				'Authorization': 'BEARER ' + getToken()
			}});
		return eventSource;
	}

	return {

		close: function() {
			if(instance) {
				instance.close();
				instance = undefined;
			}
		},

		getInstance: function () {
			if (!instance) {
				instance = createInstance();
			}
			return instance;
		},
	};
})();

export default EventSourceService;
