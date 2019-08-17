import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import aws_exports from './aws-exports'
import 'vuetify/dist/vuetify.min.css'
import VueHead from 'vue-head'


Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(AmplifyPlugin, AmplifyModules)
Vue.use(VueHead, {
  separator: ' | '
})

Amplify.configure(aws_exports)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
