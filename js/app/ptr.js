import Vue from 'vue/dist/vue.esm';
import Hammer from 'hammerjs';
import Ptr from '../../components/ptr.html';

export default function($Vue) {
  new Vue({
    el: 'ptr',
    template: Ptr,
    data() {
      return {
        ptr: new PullToRefresh()
      }
    },
    mounted() {
      this.ptr.init({
        body: '.app',
        ptr: '.ptr',
        callback: $Vue.refresh
      });
    }
  });
}

export function PullToRefresh() {
  this.init = (settings) => {
    this.element = document.querySelector(settings.body);
    this.ptr = document.querySelector(settings.ptr);
    this.callback = settings.callback;

    this.h = new Hammer(this.element, {
      touchAction: 'auto',
    });
    
    this.h.get('pan').set({ 
      direction: Hammer.DIRECTION_VERTICAL
    });
    
    this.h.on('pan', () => {
      if (this.loading)
        return;

      const scrollTop = document.body.scrollTop;

      if (scrollTop < 0) {
        this.ptr.style.height = `${-scrollTop / 2}px`;
    
        if (scrollTop < -32) {
          this.ptr.classList.add('ptr-ready');
          this.ptr.classList.remove('ptr-pulling');
        } else if (scrollTop > -32) {
          this.ptr.classList.add('ptr-pulling');
          this.ptr.classList.remove('ptr-ready');
        }
      }
    });
    
    this.h.on('panstart', () => {
      if (this.loading)
        return;

      this.ptr.classList.remove('ptr-done');
    });
    
    this.h.on('panend', () => {
      if (this.loading)
        return;

      this.ptr.classList.add('ptr-done');
      this.ptr.classList.remove('ptr-ready');
    
      if (document.body.scrollTop <= -32) {
        this.loading = true;
        this.ptr.classList.add('ptr-loading');

        this.callback().then(() => {
          this.loading = false;
          this.ptr.classList.remove('ptr-loading');
          this.ptr.style.height = '';
          return;
        });
      } else {
        this.ptr.style.height = '';
        
        setTimeout(() => {
          this.ptr.classList.remove('ptr-pulling');
        }, 250);
      }
    });
  }
}