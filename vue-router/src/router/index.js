import Vue from 'vue';
import NueRoute from './NueRouter'
import ComA from '@/components/ComA.vue'
import ComB from '@/components/ComB.vue'
Vue.use(NueRoute);
const routes = [
  { path: '/coma', component: ComA },
  { path: '/comb', component: ComB }
];
const router = new NueRoute({
  mode: 'history',
  routes
})
export default router;
