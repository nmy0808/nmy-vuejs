<template>
  <div class="wrapper">
    <div>gutters: {{$store.getters.calcNum}}</div>
    {{ $store.state.num }}
    <button>+</button>
    <button>-</button>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.wrapper {
  width: 200px;
  height: 100px;
}
</style>