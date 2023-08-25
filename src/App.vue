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
    if(lang == 'en'){
      this.$i18n.locale = 'en';
    }else if(lang == 'tw'){
      this.$i18n.locale = 'tw';
    }else{
      this.$i18n.locale = 'zh';
      localStorage.setItem('lang', 'zh')
    }
  }
}
</script>


<style>

</style>
