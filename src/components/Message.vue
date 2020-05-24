<template>
  <div>
    <div class="message-container">
      <div class="sender-legend">
        <div class="sender-name">
          {{message.senderName}}
        </div>
        <div class="timer">
          {{time}}
        </div>
      </div>
      <div class="message-body">
        {{message.message}}
      </div>
    </div>
  </div>  
</template>
<script>
export default {
  name : 'Message',
  data(){
    return {
      time : ''
    }
  },
  props : ['message'],
  mounted(){
    this.setCurrentTime();
  },
  methods : {
    setCurrentTime : function(){
      var hours = new Date().getHours();
      var minutes = new Date().getMinutes();
      this.time = hours + " : " + minutes + (hours < 13 ? ' am' : ' pm');
    }
  }
}
</script>
<style lang="scss" scoped>
.message-container{
  padding: 5px;
    font-size: 15px;
    background-color: white;
    margin-top: 10px;
    box-shadow: 1px 1px 1px 1px #cdcdcd;
    border-radius: 3px;
  .sender-legend{
    display: flex;
    .sender-name{
      font-size: 17px;
      font-weight: bold;
      margin:5px;
      font-family: sans-serif;
    }
    .timer{
      color: #cdcdcd;
      font-size: 12px;
      margin:5px;
      margin-left: 10px;
      margin-top: 10px;
      font-family: sans-serif;
    }
  }
  .message-body{
    margin: 5px;
    font-family: sans-serif;
    width: fit-content;
    padding: 5px;
    padding-left: 10px;
    padding-right: 15px;
    border: 2px solid #cdcdcd;
    border-bottom-right-radius: 20px !important;
    border-radius: 5px;
  }
}
.message-container:hover{
  background-color: #cdcdcd29;
}
</style>