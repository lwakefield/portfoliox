import Vue from 'vue'
import VueRouter from 'vue-router'
import Firebase from 'firebase'

Vue.use(VueRouter)
Vue.use(require('vuefire'))
Vue.mixin({
  data () {
    return {auth: undefined}
  },
  firebase: {
    root: new Firebase('https://portfoliox.firebaseio.com/')
  },
  created () {
    this.$firebaseRefs.root.onAuth(auth => { this.auth = auth })
  }
})

let router = new VueRouter({history: true})
router.map({
  '/login': {
    component: require('./components/Login')
  },
  '/': {
    component: require('./components/Home')
  }
})
router.start(require('./App'), '#app')
