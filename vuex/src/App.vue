<template>
  <div id="app">
    <Com1 />
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
