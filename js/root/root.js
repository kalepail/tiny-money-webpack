import Vue from 'vue/dist/vue.esm';
import { $App } from '../app/app';
import { $Access } from '../access/access';
import Root from '../../templates/root.html';

export const $Root = new Vue({
  el: 'root',
  template: Root,
  data: {
    tm_user: localStorage.getItem('tm_user'),
    tm_token: localStorage.getItem('tm_token')
  },
  computed: {
    logged_in() {
      return this.tm_user && this.tm_token;
    },
    view() {
      return this.logged_in ? 'app' : 'access';
    }
  },
  components: {
    app: $App,
    access: $Access
  }
});