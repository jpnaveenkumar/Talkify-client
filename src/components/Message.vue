<template>
  <div>
    <div class="message-container">
      {{message}}
    </div>
  </div>  
</template>
<script>
export default {
  name : 'Message',
  props : ['message']
}
</script>
<style lang="scss" scoped>
.message-container{
  padding: 5px;
  font-size: 15px;
}
</style>