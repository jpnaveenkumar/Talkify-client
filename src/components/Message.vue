<template>
  <div class="message-holder">
    <div class="message-container">
      <div v-if="message['senderId']" class="logo-container">
        <UserLogo v-bind:color="member.color" v-bind:name="member.name"></UserLogo>
      </div>
      <div>
        <div class="sender-legend">
          <div class="sender-name">
            {{message.senderName}}
          </div>
          <div class="timer">
            {{time}}
          </div>
          <div  class="private" v-if="message.isPrivate">
            (private)
          </div>
        </div>
        <div class="message-body">
          {{message.message}}
        </div>
      </div>
    </div>
  </div>  
</template>
<script>
import UserLogo from './UserLogo';
export default {
  name : 'Message',
  components : {UserLogo},
  data(){
    return {
      time : '',
      member: {
        color: null,
        name: null
      }
    }
  },
  props : ['message'],
  mounted(){
    this.setCurrentTime();
    if(this.message["senderId"]){
      var member = this.$store.getters.memberById(this.message["senderId"]);
      this.member.color = member.color;
      this.member.name = member.nickName;
    }
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
.message-holder{
  .message-container{
      padding: 5px;
      font-size: 15px;
      background-color: white;
      margin-top: 10px;
      box-shadow: 1px 1px 1px 1px #cdcdcd;
      border-radius: 3px;
      display: flex;
    .logo-container{
      padding: 10px;
    }
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
      .private{
        color: red;
        margin: 6px;
        font-family: cursive;
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
      word-break: break-word;
    }
  }
}
.message-container:hover{
  background-color: #cdcdcd29;
}

</style>