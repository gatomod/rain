import axios from 'axios';
import config from '../../client.json';

export default axios.create({
	baseURL: config.server + '/api'
});
