<template>
  <div class="wrapper">
    {{ $store.state.num }}
    <button @click="onIncrease">+</button>
    <button @click="onDecrease">-</button>
  </div>
</template>

<script>
export default {
  methods: {
    onIncrease() {
      this.$store.commit("increase", 1);
    },
    onDecrease() {
      this.$store.commit("decrease", 1);
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 200px;
  height: 200px;
}
</style>