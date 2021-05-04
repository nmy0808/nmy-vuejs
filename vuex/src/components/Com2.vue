<template>
  <div class="wrapper">
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
  height: 200px;
}
</style>