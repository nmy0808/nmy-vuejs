<template>
  <div id="app">
    <h3>同步</h3>
    <Com1 />
    <hr />
    <h3>异步</h3>
    <Com2 />
  </div>
</template>

<script>
import Com1 from "./components/Com1.vue";
import Com2 from "./components/Com2.vue";

export default {
  name: "App",
  components: {
    Com1,
    Com2,
  },
};
</script>

<style>
body {
  padding-top: 4em;
  display: flex;
  justify-content: center;
}
</style>
