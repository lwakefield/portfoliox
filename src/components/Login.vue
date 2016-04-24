<template>
    <div class="form-wrapper">
        <form @submit.stop.prevent="doSignup" v-if="state === 'signup'">
            <h1> Signup </h1>
            <input type="email" v-model="signup.email" placeholder="john@email.com" required>
            <input type="email" v-model="signup.emailConfirm" placeholder="john@email.com" required>
            <input type="password" v-model="signup.password" placeholder="correcthorsebatterystaple" required>
            <input type="password" v-model="signup.passwordConfirm" placeholder="correcthorsebatterystaple" required>
            <button> Signup </button>
        </form>
        <form @submit.stop.prevent="doLogin" v-if="state === 'login'">
            <h1> Login </h1>
            <input type="email" v-model="login.email" placeholder="john@email.com" required>
            <input type="password" v-model="login.password" placeholder="correcthorsebatterystaple" required>
            <button> Login </button>
        </form>
    </div>
</template>

<script>
import Firebase from 'firebase'
export default {
  data () {
    return {
      loaded: false,
      state: '',
      signup: {
        email: '',
        emailConfirm: '',
        password: '',
        passwordConfirm: ''
      },
      login: {
        email: '',
        password: ''
      }
    }
  },
  firebase: {
    users: new Firebase('https://portfoliox.firebaseio.com/users')
  },
  methods: {
    doSignup () {
      this.$firebaseRefs.root.createUser({
        email: this.signup.email,
        password: this.signup.password
      }).then(data => {
        this.$firebaseRefs.users.child(data.uid).set('')
        this.$firebaseRefs.root.authWithPassword({
          email: this.signup.email,
          password: this.signup.password
        })
      })
    },
    doLogin () {
      this.$firebaseRefs.root.authWithPassword({
        email: this.login.email,
        password: this.login.password
      })
    }
  },
  ready () {
    this.$firebaseRefs.users.once('value', snap => {
      this.loaded = true
      if (snap.val()) this.state = 'login'
      else this.state = 'signup'
    })
    this.$firebaseRefs.root.onAuth(auth => {
      if (auth) this.$route.router.go('/')
    })
  }
}
</script>

<style scoped>
    .form-wrapper {
        min-width: 100vw;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    form {
        display: flex;
        flex-flow: column;
        width: 16rem;
        padding: 1rem;
        border: 2px solid #f7f7f9;
    }
    input {
        padding: 0.25rem;
    }
    h1 {
        text-align: center;
    }
    input, button {
        margin: 0.5rem 0;
        background: none;
        border: 2px solid #f7f7f9;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
    }
</style>
