<template>
    <div class="chat-container">
        <div class="chat-legend">
           <div>
               Channel : {{channel}}
           </div>
           <div>
               Connection Status : false
           </div>
           <div>
               Username : {{username}}
           </div>
           <div>
               Chat Anonymous : false
           </div>
        </div>
        <div class="input-container">
            <input type="text"  v-model="message" placeholder="Type Something here .....">
        </div>
        <div class="btn-container">
            <div  @click="sendMessage" class="send-btn">
                Send
                <img class="send-icon" src="../assets/send.svg">
            </div>
        </div>
        <div class="chatWindow">
            <Message v-for="(chatMessage,index) in chatMessages" :key="index" v-bind:message="chatMessage"></Message>
        </div>
    </div>    
</template>
<script>
import {getChannelInfo} from '../service/chat';
import Message from '../components/Message.vue';
export default {
    name: 'chat',
    data(){
        return{
            ws: undefined,
            message: '',
            chatMessages : []
        }
    },
    props: ['channel','username','userId'],
    components : { Message },
    methods: {
        sendMessage: function() {
            console.log("sent");
            var message = this.message;
            var obj = {};
            obj["senderId"] = this.userId;
            obj["message"] = message;
            obj["channelName"] = this.channel;
            this.ws.send(JSON.stringify(obj));
        },
        establishWebSocket: function () {
               console.log("connecting....");
               var ws = new WebSocket("ws://192.168.43.179:3000/channel/"+this.userId+"/"+this.channel);
               this.ws = ws;
               var self = this;
               ws.onopen = function() {
                  console.log("Message is sent...");
               };
				
               ws.onmessage = function (evt) { 
                  var received_msg = evt.data;
                  self.chatMessages.push(received_msg);
                  console.log(received_msg);
                  console.log("Message is received..."+received_msg);
               };
				
               ws.onclose = function() {
                  console.log("Connection is closed..."); 
               };
         },
        
    },
    mounted() {
        window.onbeforeunload = function()
        {
            console.log("unloaded");
            return confirm("Confirm refresh");
        };
        window.mine = this;
        var params = {
            channel : this.channel
        }
        getChannelInfo(params).then((data)=>{
            this.$toast.success(data.message);
            this.establishWebSocket();
        },(err)=>{
            console.log(err);
            this.$router.push({ path: '/error-page'});
        });
    }
}
</script>
<style lang="scss" scoped>

.chat-container{
    margin:10px;
    .chat-legend{
        font-size: 18px;
        font-weight: bold;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
    }
    .input-container{
        margin:10px;
        input{
            width: 97%;
            height:30px;
            border-radius:5px;
            padding:5px;
            color: #6e6868;
            border:1px solid #cdcdcd;
        }
        input:focus{
            outline: none;
        }
    }
    .btn-container{
        display: flex;
        justify-content: center;
        width: inherit;
        .send-btn{
            padding:5px 20px 5px 20px;
            border-radius:5px;
            font-size: 18px;
            color:white;
            background-color: #4d57cd;
            font-weight: bold;
            .send-icon{
                position: relative;
                top: 3px;
                left: 3px;
            }
        }
    }
    .chatWindow{
        margin:10px;
    }
}
</style>