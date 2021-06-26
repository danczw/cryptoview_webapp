<template>
  <div class="home">
    <Treemap/>
  </div>
</template>

<script>
// @ is an alias to /src
import Treemap from '@/components/Treemap.vue'

export default {
  name: 'Home',

  components: {
    Treemap
  }
}
</script>

<style scoped lang="scss">
@import "./src/styles/variables.scss";

</style>