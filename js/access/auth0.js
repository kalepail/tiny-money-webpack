import Axios from 'axios';
import { $Root } from '../root/root';
import moment from 'moment-timezone';

const axios = Axios.create({
  baseURL: 'https://micro.tiny.money',
  // baseURL: 'http://localhost:3000',
  headers: {'Content-Type': 'application/json'}
});

const auth0 = window.auth0;
const webAuth = new auth0.WebAuth({
  domain: 'tinymoney.auth0.com',
  clientID: 'w2VvkbepeScixJhX92OkQNyEZ85AZ1L9'
});

export function accessUser(self) {
  webAuth.parseHash(location.hash, (err, authResult) => {
    if (err) {
      self.loading = false;
      console.error('client.parseHash', err);
    } 
    
    else if (authResult) {
      webAuth.client.userInfo(authResult.accessToken, (err, user) => {
        if (err) {
          self.loading = false;
          console.error('client.userInfo', err);
        }

        else {
          getUser(user.sub)
        }
      });

      history.pushState({}, document.title, location.pathname);
    }
    
    else {
      self.loading = false;
    }
  });
}

export function getUser(auth0_id) {
  axios.post('/access', {
    auth0_id: auth0_id,
    timezone: moment.tz.guess()
  })
  .then((res) => {
    self.loading = false;
    $Root.tm_user = res.data.tinymoney_id;
    $Root.tm_token = res.data.tinymoney_token;
    localStorage.setItem('tm_user', $Root.tm_user);
    localStorage.setItem('tm_token', $Root.tm_token);
  })
  .catch((err) => {
    self.loading = false;
    console.error('client.accessUser', err);
  });
}