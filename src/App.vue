<template>
  <div>
    <a class="logout" href="#" @click.stop.prevent="logout" v-if="auth">Logout</a>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    logout () {
      this.$firebaseRefs.root.unauth()
    }
  }
}
</script>

<style>
  @import url(https://fonts.googleapis.com/css?family=Arimo);
  html, body {
    font-family: 'Arimo', sans-serif;
    font-size: 18px;
    margin: 0;
    padding: 0;
    background-color: #373a3c;
    color: #f7f7f9;
  }
  a {
    color: #f7f7f9;
    text-decoration: none;
  }
  * {
    box-sizing: border-box;
  }
</style>

<style scoped>
  .logout {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
