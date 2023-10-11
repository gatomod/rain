import axios from 'axios';

export default axios.create({
	baseURL: window.location.host + '/api'
});
