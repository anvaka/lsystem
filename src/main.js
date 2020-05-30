import Vue from 'vue'
import App from './App.vue'
import NoWebGL from './NoWebGL';
import {isWebGLEnabled} from 'w-gl';

Vue.config.productionTip = false

let canRender = isWebGLEnabled(document.querySelector('#canvas'));

new Vue({
  render: h => h(canRender ? App : NoWebGL),
}).$mount('#app')
