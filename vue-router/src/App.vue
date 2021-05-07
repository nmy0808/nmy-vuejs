<template>
  <div id="app">
    <router-link to='/coma'>模块a</router-link>
    <router-link to='/comb'>模块b</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    console.log(this.$router);
    console.log(this.$route);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
