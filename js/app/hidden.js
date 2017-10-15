import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'https://micro.tiny.money',
  // baseURL: 'http://localhost:3000',
  headers: {'Content-Type': 'application/json'}
});

export function hiddenPatch($Vue, callback) {
  localStorage.setItem('HIDDEN', JSON.stringify($Vue.hidden));
  
  axios.patch(`/${$Vue.tmUser}/hidden`, {
    hidden: $Vue.hidden
  }, {
    before: (request) => {
      if (axios.previousPatch)
        axios.previousPatch.abort();

      axios.previousPatch = request;
    }
  })
  .then(() => {

    if (callback)
      callback();
  })
  .catch((err) => {
    console.error(err);
  });
}

export function hiddenGet($Vue, callback) {
  axios.get(`/${$Vue.tmUser}/hidden`, {
    before: (request) => {
      if (axios.previousGet)
        axios.previousGet.abort();

      axios.previousGet = request;
    }
  })
  .then((res) => {
    $Vue.hidden = res.data.hidden;
    localStorage.setItem('HIDDEN', JSON.stringify(res.data.hidden));

    if (callback)
      callback();
  })
  .catch((err) => {
    console.error(err);
  });
}