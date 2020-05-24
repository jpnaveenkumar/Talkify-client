<template>
  <div class="home">
    <div class="home-container">
      <div class="home-box">
        <div class="product-label">
          <h1>Talkify</h1>
        </div>
        <div class="username-container">
          <input type="text" placeholder="Enter Your Name" v-model="userName">
        </div>
        <div class="channel-container">
          <input type="text" placeholder="Channel name" v-model="channelName">
        </div>
        <div class="button-container">
            <div class="create-button btn-hover" @click="create">
                CREATE CHANNEL
            </div>
            <div class="or-text">
                OR
            </div>
            <div class="join-button btn-hover" @click="join">
                JOIN CHANNEL
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {createChannel, joinChannel} from '../service/home';
export default {
  data(){
      return {
          userName : '',
          channelName: '',
      };
  },
  methods: {
      create: function(){
        if(this.userName == "" || this.channelName == ""){
          this.$toast.error("Kindly Enter Username or Password");
          return;
        }
          createChannel(this.userName,this.channelName).then((data)=>{
            this.$toast.success(data.message);
            var self = this;
              setTimeout(function(){
                self.$router.push({ 
                name: 'chatWithAllParams', 
                params: { 
                  channel: self.channelName,
                  userId: data.userId
                },
                query: {
                  username: self.userName
                }
              });
            },2000);
          },(err)=>{
              this.$toast.error(err.message);
          });
      },
      join: function(){
        if(this.userName == "" || this.channelName == ""){
          this.$toast.error("Kindly Enter Username or Password");
          return;
        }
        joinChannel(this.userName,this.channelName).then((data)=>{
          this.$toast.success(data.message);
          var self = this;
          setTimeout(function(){
            self.$router.push({ 
              name: 'chatWithAllParams', 
              params: { 
                channel: self.channelName,
                userId: data.userId
              },
              query: {
                username: self.userName
              }
            });
          },2000);
        },(err)=>{
            this.$toast.error(err.message);
        });
      }
  },
  mounted(){
    window.mine1 = this;
  }
}
</script>
<style lang="scss" scoped>
input:focus{
  outline: none;
}
input{
  width: 100%;
  height: 30px;
  border-radius: 10px;
  border: 1px solid #cdcdcd;
  padding:5px;
  color: #868383;
  font-size: 16px;
  text-align: center;
}
.home{
  height:100vh;
  user-select: none;
  background: #B2FEFA;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #0ED2F7, #B2FEFA);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #0ED2F7, #B2FEFA); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  .home-container{
    display:flex;
    justify-content: center;
    align-items: center;
    color:white;
    height: inherit;
    .home-box{
        position: relative;
        top:-20px;
        .product-label{
        font-family: 'Ma Shan Zheng', cursive;
        font-size: 40px;
        letter-spacing: 7px;
        text-align: center;
        }
        .username-container{
        margin:10px;
        }
        .channel-container{
        margin:20px 10px 10px 10px;
        }
        .button-container{
            display: flex;
            margin:20px;
            @media (max-width: 450px) {
                flex-direction: column;
            }
            .create-button{
                margin: 5px;
                padding: 10px;
                border: 1px solid white;
                font-family: cursive;
                font-weight: bold;
                text-align: center;
                transition: all 1s;
            }
            .or-text{
                display: flex;
                align-items: center;
                padding: 5px;
                justify-content: center;
            }
            .join-button{
                margin: 5px;
                border: 1px solid white;
                padding: 10px;
                font-family: cursive;
                text-align: center;
                font-weight: bold;
                transition: all .5s;
            }
            .btn-hover:hover{
                background-color: #0ED2F7;
                border:0px;
                box-shadow: 1px 1px 5px 2px #40b7ef;
            }
        }
    }
  }
}
</style>