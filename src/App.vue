<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
  mounted() {
    let lang = localStorage.getItem('lang')
    if(lang == 'en_US'){
      this.$i18n.locale = 'en';
    }else {
      this.$i18n.locale = 'zh';
      this.locale = null;
    }
  }
}
</script>


<style>

</style>
