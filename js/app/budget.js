import Budget from '../../components/budget.html';
import Velocity from 'velocity-animate';
import _ from 'lodash';

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
      filter: ''
    }
  },
  created() {

  },
  watch: {
    // budget() {
    //   console.log(this.budget.t);
    // },
    filter() {
      this.targets = _
      .chain(this.targets)
      .map((target) => {
        target.active = sanitizeString(target.name).indexOf(sanitizeString(this.filter)) !== -1;
        return target;
      })
      .value();
    }
  },
  methods: {
    createTarget() {
      this.target = {};
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
    }
  }
}

export function sanitizeString(str) {
  return str.toLowerCase();
}