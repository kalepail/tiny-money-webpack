import Vue from 'vue/dist/vue.esm';
import VueResource from 'vue-resource';
import VueTouch from 'vue-touch';
import accounting from 'accounting';
import BigNumber from 'bignumber.js';
import Velocity from 'velocity-animate';
import _ from 'lodash';
import moment from 'moment';
import { hiddenPatch, hiddenGet } from './hidden';
import omit from '../utils/omit';
import App from '../../templates/app.html';
import Loading from '../../components/loading-svg.html';
import Plaid from './plaid';
import Ptr from './ptr';
import { $Root } from '../root/root';

Velocity.defaults.mobileHA = false;
Velocity.defaults.duration = 250;

Vue.use(VueTouch);
Vue.use(VueResource);

export const $App = {
  template: App,
  props: ['loggedIn', 'tmUser', 'tmToken'],
  data() {
    return {
      demo: window.location.host.indexOf('demo') !== -1,
      banks: JSON.parse(localStorage.getItem('BANKS')) || [],
      transactions: JSON.parse(localStorage.getItem('TRANSACTIONS')) || [],
      hidden: JSON.parse(localStorage.getItem('HIDDEN')) || [],
      user: JSON.parse(localStorage.getItem('USER')) || {},
      last: localStorage.getItem('LAST'),
      refreshing: false,
      scrolling: false,
      step: 0
    }
  },
  components: {
    'loading-svg': {
      template: Loading
    }
  },
  http: {
    root: 'https://tiny.money/v1/',
    headers: {
      Accept: 'application/json'
    }
  },
  created() {
    this.$options.http.headers.Authorization = `Bearer ${this.tmToken}`;

    Plaid(this);

    this.parseTransactions();
    
    if (
      !moment(this.last).add(1, 'minute').isAfter() || 
      this.transactions.length === 0
    ) {
      localStorage.setItem('LAST', moment().toDate());
      this.refresh();
    }
  },
  mounted() {
    Ptr(this);
  },
  watch: {

  },
  computed: {
    sortedTransactions() {
      return _.chain(this.transactions)
        .filter((t) => {
          return !t.hidden;
        })
        .orderBy([
          'pending',
          'hidden', 
          'date',
          (t) => {return Math.abs(t.amount)}, 
          'name'
        ], [
          'desc', 
          'asc', 
          'desc', 
          'desc',
          'desc'
        ])
        .value();
    },
    sortedTransactionsHidden() {
      return _.chain(this.transactions)
        .filter((t) => {
          return t.hidden;
        })
        .orderBy([
          'pending',
          'hidden', 
          'date',
          (t) => {return Math.abs(t.amount)}, 
          'name'
        ], [
          'desc', 
          'asc', 
          'desc', 
          'desc',
          'desc'
        ])
        .value();
    },
    sortedBanks() {
      return _.orderBy(this.banks, [
        (b) => {return Math.abs(b.net)},
        'name'
      ], [
        'desc',
        'desc'
      ]);
    }
  },
  filters: {
    money(raw, invert = false) {
      if (!raw)
        return '$0.00';

      if (invert)
        raw = -raw;

      const clean = new BigNumber(String(raw)).abs().toFixed(2);

      if (!invert || raw >= 0)
        return accounting.formatMoney(clean);

      else
        return accounting.formatMoney(clean, '-$');
    }
  },
  methods: {
    getTransactions(callback) {
      const lte = moment().endOf('month');
      const gte = this.demo ? moment('2016-03-01') : moment().subtract(1, 'month');

      this.$http.get(`${this.tmUser}/transactions`, {
        params: {
          step: this.step,
          pending: false,
          limit: 100,
          lte: lte.format('YYYY-MM-DD'),
          gte: gte.format('YYYY-MM-DD')
        }
      }).then((res) => {
        this.parseTransactions(res.data.transactions, gte);

        if (res.data.meta.pagination.has_more) {
          this.step++;
          this.getTransactions(callback);
        } else {
          this.step = 0;

          if (callback)
            callback();
        }
      }).catch((err) => {
        console.error(err);
        this.logout();

        if (callback)
          callback();
      });
    },
    parseTransactions(transactions, gte) {
      transactions = transactions || this.transactions;
      gte = gte || this.demo ? moment('2016-03-01') : moment().subtract(1, 'month');

      this.transactions = _
        .chain(this.transactions)
        .concat(transactions)
        .uniqBy('_id')
        .filter((t) => {
          return gte.isBefore(t.date)
        })
        .each((t) => {
          const date = moment(t.date);
          const bank = _.find(this.banks, {_id: t.bank_id});
          
          t.info = '';
          t.klass = [];
          t.day = date.date();
          t.month = date.format('MMM');

          if (t.pending)
            t.klass.push('pending');

          if (t.amount >= 0) {
            t.klass.push('negative');
          } else {
            t.klass.push('positive');
          }

          if (bank.name)
            t.info += `${bank.name} `;

          if (t.mask)
            t.info += `${t.mask} `;

          if (_.includes(this.hidden, t._id)) {
            Vue.set(t, 'hidden', true);
          } else {
            Vue.set(t, 'hidden', false);
          }
        })
        .value();

      const clone = _.cloneDeep(this.transactions);
      let clean = omit(clone, ['target', 'action', 'hidden']);

      localStorage.setItem('TRANSACTIONS', JSON.stringify(clean));
    },
    panStartTransaction(e, t) {
      if (Math.abs(e.overallVelocityY) >= Math.abs(e.overallVelocityX))
        return this.scrolling = true;

      if (e.target.classList.contains('transaction')) {
        t.target = e.target;
      } else {
        t.target = e.target.offsetParent;
      }
      
      t.action = t.target.lastChild;
      t.target.classList.remove('animate');
    },
    panTransaction(e, t) {
      if (this.scrolling)
        return;

      if (e.deltaX >= 0) {
        t.target.classList.add('left');
        t.target.classList.remove('right');
      } else {
        t.target.classList.add('right');
        t.target.classList.remove('left');
      }

      if (Math.abs(e.deltaX) >= 60) {
        t.action.classList.add('active');
      } else {
        t.action.classList.remove('active');
      }

      t.target.style.transform = `translateX(${e.deltaX}px)`;
    },
    panEndTransaction(e, t) {
      if (!this.scrolling) {

        // If we're pass the threshold, hide or show
        if (Math.abs(e.deltaX) >= 60) {
          let offset = t.target.offsetWidth;

          if (e.deltaX >= 0) {
            offset = e.deltaX - offset;
            this.animateTransaction(1, t, offset);
          } else {
            offset = e.deltaX + offset;
            this.animateTransaction(0, t, offset);
          }

          t.action.classList.remove('active');
        } 
        
        // Otherwise just reset back to zero
        else {
          Velocity(t.target, {
            right: e.deltaX
          }, {
            complete: () => {
              t.target.style.transform = '';
              t.target.style.right = '';
            }
          });
        }
      }

      this.scrolling = false;
    },

    animateTransaction(direction, t, offset) {
      Velocity(t.target, {
        height: 0,
        right: offset
      }).then(() => {
        if (t.hidden) {
          this.hidden = _.without(this.hidden, t._id);
          Vue.set(t, 'hidden', false);
        } else {
          this.hidden.push(t._id);
          Vue.set(t, 'hidden', true);
        }

        t.target.style.right = '';
        t.target.style.transform = '';
        t.target.style.overflow = 'hidden';

        return hiddenPatch(this);
      }).then(() => {
        t.target.height = t.target.clientHeight;
        t.target.style.height = '0px';

        Velocity(t.target, {
          height: t.target.height
        }, {
          complete: () => {
            t.target.style.height = '';
            t.target.style.overflow = '';
          }
        });
      });
    },

    enterTransaction(target) {
      target.height = target.clientHeight;
      target.style.height = '0px';
      
      setTimeout(() => {
        Velocity(target, {
          height: target.height
        });
      }, 250);
    },

    getBanks(callback) {
      this.$http.get(`${this.tmUser}/banks`)
        .then((res) => {
          this.banks = res.data.banks;
          localStorage.setItem('BANKS', JSON.stringify(this.banks));

          if (callback)
            callback();
        })
        .catch((err) => {
          console.error(err);
          this.logout();

          if (callback)
            callback();
        });
    },
      
    getUser(callback) {
      this.$http.get(`users/${this.tmUser}`)
        .then((res) => {
          this.user = res.data.user;
          localStorage.setItem('USER', JSON.stringify(res.data.user));

          if (callback)
            callback();
        })
        .catch((err) => {
          console.error(err);
          this.logout();

          if (callback)
            callback();
        });
    },

    refresh() {
      return new Promise(resolve => {
        if (this.refreshing) {
          return resolve();
        } else {
          this.refreshing = true;
        }

        this.getUser(() => {
          this.getBanks(() => {
            hiddenGet(this, () => {
              this.getTransactions(() => {
                this.refreshing = false;
                resolve();
              });
            });
          });
        });
      });
    },

    accountKlass(a) {
      const balances = a.type === 'depository' ? -a.balances.current : a.balances.current;
      return balances >= 0 ? 'negative' : 'positive'
    },

    resetStorage() {
      this.banks = [];
      this.transactions = [];
      this.hidden = [];
      this.user = {};
      this.last = null;

      localStorage.removeItem('BANKS');
      localStorage.removeItem('TRANSACTIONS');
      localStorage.removeItem('HIDDEN');
      localStorage.removeItem('USER');
      localStorage.removeItem('LAST');
      
      this.refresh();
    },

    logout() {
      localStorage.removeItem('BANKS');
      localStorage.removeItem('TRANSACTIONS');
      localStorage.removeItem('HIDDEN');
      localStorage.removeItem('USER');
      localStorage.removeItem('LAST');

      localStorage.removeItem('tm_user');
      localStorage.removeItem('tm_token');
      $Root.tm_user = null;
      $Root.tm_token = null;
    }
  }
}