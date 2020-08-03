import axios from 'axios';

axios.interceptors.response.use(null, (error) => {
  const expectedErrors =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedErrors) {
    console.log('Logging the error: ', error);
    alert('An expected error occured..');
  }

  // passing control to try catch block
  return Promise.reject(error);
});

function setJwt(jwt) {
  // setting jwt in the header of the response, if there is one
  axios.defaults.headers.common['x-auth-token'] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
