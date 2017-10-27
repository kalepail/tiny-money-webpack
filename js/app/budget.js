import Budget from '../../components/budget.html';
import Velocity from 'velocity-animate';
import { moneyFilter } from '../utils/filters';
// import { hiddenPatch } from './hidden';
import _ from 'lodash';
// import Calendar from '../utils/calendar';
// import $ from 'jquery';
// import moment from 'moment';

Velocity.defaults.mobileHA = false;
Velocity.defaults.duration = 250;

export const $Budget = {
  template: Budget,
  props: ['budget'],
  data() {
    return {
      target: false,
      targets: [{
        id: 0,
        name: 'Eating Out',
        active: true
      }, {
        id: 1,
        name: 'Rent',
        active: true
      }, {
        id: 2,
        name: 'European Vacation',
        active: true
      }],
      filter: '',
      mirror: false
    }
  },
  created() {
    console.log(this.budget.t);

    this.target = {
      // type: 'spend',
      interval: 'month',
      name: 'Apartment Rent',
      amount: 850,
      count: 1
    }
  },
  mounted() {
    // new Calendar({
    //   element: $('.daterange--single'),
    //   current_date: moment().add(6, 'months'),
    //   format: {input: 'YYYY-MM-DD'}
    // });
  },
  watch: {
    filter() {
      this.targets = _
      .chain(this.targets)
      .map((target) => {
        target.active = sanitizeString(target.name).indexOf(sanitizeString(this.filter)) !== -1;
        return target;
      })
      .value();

      const active = _.filter(this.targets, (target) => target.active);

      if (
        active.length === 1 &&
        sanitizeString(active[0].name) === sanitizeString(this.filter)
      ) this.mirror = true;

      else 
        this.mirror = false;
    }
  },
  filters: {
    money: moneyFilter
  },
  methods: {
    createTarget() {
      this.target = {
        // type: 'spend',
        name: this.filter,
        amount: Math.abs(this.budget.t.amount),
        count: 1,
        interval: 'month'
      }
    },

    goback() {
      this.target = false;
    },

    cancel(event) {
      if (this.$el === event.target) {
        const t = this.budget.t;
        const e = this.budget.e;

        this.$parent.budget = false;

        if (!t || !e)
          return

        Velocity(t.target, {
          right: e.deltaX
        }, {
          complete() {
            t.target.style.transform = '';
            t.target.style.right = '';
          }
        });
      }
    },

    save() {
      const t = this.budget.t;
      const o = this.budget.o;

      this.$parent.budget = false;

      if (!t || !o)
        return

      Velocity(t.target, {
        height: 0,
        right: o
      }).then(() => {
        // if (t.hidden) {
        //   this.hidden = _.without(this.hidden, t._id);
        //   Vue.set(t, 'hidden', false);
        // } else {
        //   this.hidden.push(t._id);
        //   Vue.set(t, 'hidden', true);
        // }

        t.target.style.right = '';
        t.target.style.transform = '';
        t.target.style.overflow = 'hidden';

        // return hiddenPatch(this);
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

    plurize(value) {
      return value + (this.target && this.target.count > 1 ? 's' : '');
    }
  }
}

export function sanitizeString(str) {
  return str.replace(/\s/gi, '-').toLowerCase();
}