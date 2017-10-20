import { accessUser, getUser } from './auth0';
import Access from '../../templates/access.html';
import Loading from '../../components/loading-svg.html';
import logo from '../../images/logo.png';

const Auth0LockPasswordless = window.Auth0LockPasswordless;

const lock = new Auth0LockPasswordless(
  'w2VvkbepeScixJhX92OkQNyEZ85AZ1L9', 
  'tinymoney.auth0.com'
);

export const $Access = {
  template: Access,
  props: ['loggedIn', 'tmUser', 'tmToken'],
  data() {
    return {
      loading: true,
      demo: window.location.host.indexOf('demo') !== -1
    }
  },
  components: {
    'loading-svg': {
      template: Loading
    }
  },
  created() {
    if (this.demo) {
      getUser('email|59df91757cd31262970eb8b7');
    } else {
      accessUser(this);
    }
  },
  methods: {
    connect() {
      lock.magiclink({
        autoclose: true,
        focusInput: true,
        icon: logo,
        primaryColor: '#3274ff',
        dict: {
          title: 'Tiny Money'
        }
      });
    }
  }
}