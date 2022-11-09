import axios from 'axios';

//axios call api
const api = axios.create({
    baseURL: 'http://10.0.2.2:3333',
});

export default api; 
