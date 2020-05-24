<template>
    <div class="chat-container">
        <div class="chat-legend">
           <div>
               Channel : {{channel}}
           </div>
           <div class="chat-connection"> 
               Connection Status :
               <div class="connection-status"> 
                    {{connectionStatus}}
                    <div class="green-ball" v-if="connectionStatus == 'CONNECTED'"></div>
                    <div class="red-ball" v-if="connectionStatus == 'NOT_CONNECTED'"></div>
                </div>
           </div>
           <div>
               Username : {{userName}}
           </div>
           <div>
               Chat Anonymous : false
           </div>
        </div>
        <div class="input-container">
            <textarea type="text" spellcheck="false" v-model="message" placeholder="Type Something here ....."></textarea>
        </div>
        <div class="btn-container">
            <div  @click="sendMessage" class="send-btn">
                Send
                <img class="send-icon" src="../assets/send.svg">
            </div>
        </div>
        <div class="chatWindow">
            <div class="chat-box">
                <Message v-for="(chatMessage,index) in chatMessages" :key="index" v-bind:message="chatMessage"></Message>
            </div>
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
            chatMessages : [],
            senderId: '',
            channelName: '',
            userName: '',
            connectionStatus: 'NOT_CONNECTED'
        }
    },
    props: ['channel','userId'],
    components : { Message },
    methods: {
        sendMessage: function() {
            console.log("sent");
            var message = this.message;
            if(message == ""){
                return;
            }
            var obj = {};
            obj["senderId"] = this.senderId;
            obj["message"] = message;
            obj["channelName"] = this.channelName;
            this.ws.send(JSON.stringify(obj));
        },
        handleChatResponse: function(received_msg) {
            this.message = "";
            var obj = {}
            obj["message"] = received_msg["message"];
            obj["senderName"] = received_msg["sender_name"];
            this.chatMessages.push(obj);
        },
        establishWebSocket: function () {
               console.log("connecting....");
               var ws = new WebSocket("ws://localhost:3000/channel/"+this.senderId+"/"+this.channelName);
               this.ws = ws;
               var self = this;
               ws.onopen = function() {
                   this.connectionStatus = 'ESTABLISHING_CONNECTION';
               };
				
               ws.onmessage = function (evt) { 
                  var received_msg = evt.data;
                  received_msg = JSON.parse(received_msg);
                  if(received_msg["status"] != 200){
                      this.$toast.error(received_msg["message"]);
                      return;
                  }
                  if(received_msg["message_type"]  == "Connection_Status"){
                      self.connectionStatus = "CONNECTED";
                  }else if(received_msg["message_type"]  == "Chat_Message"){
                      self.handleChatResponse(received_msg);
                  }
                  console.log("Message is received..."+received_msg);
               };
				
               ws.onclose = function() {
                  console.log("Connection is closed..."); 
               };
        },
        validation: function(){
            var params = {
                channel : this.channelName
            }
            getChannelInfo(params).then((data)=>{
                console.log(data);
                this.establishWebSocket();
            },(err)=>{
                console.log(err);
                this.$router.push({ path: '/error-page'});
            });
        },
        initData: function(){
            this.channelName = this.channel;
            this.userName = this.$route.query.username;
            this.senderId = this.userId;
        },
        registerWindowListeners: function(){
            window.mine = this;
            window.onbeforeunload = function()
            {
                console.log("unloaded");
                return confirm("Confirm refresh");
            };
        }
    },
    mounted() {
        this.initData();
        this.validation();
        this.registerWindowListeners();
    }
}
</script>
<style lang="scss" scoped>

.chat-container{
    padding: 10px;
    min-height: 97vh;
    background-color: #cdcdcd29;
    .chat-legend{
        font-size: 15px;
        font-family: sans-serif;
        font-weight: bold;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        margin-top:10px;
        margin-bottom: 15px;
        .chat-connection{
            display: flex;
            align-items: center;
            .connection-status{
                display:flex;
                align-items: center;
                flex-direction: row-reverse;
                .green-ball{
                    height: 15px;
                    width: 15px;
                    background-color: rgb(85, 243, 85);
                    border-radius: 10px;
                    margin: 5px;
                    position: relative;
                }
                .red-ball{
                    height: 15px;
                    width: 15px;
                    background-color: red;
                    border-radius: 10px;
                    margin: 5px;
                    position: relative;
                }
            }
        }
    }
    .input-container{
        margin:10px;
        textarea{
            white-space: pre-wrap;
            width: 97%;
            height:30px;
            border-radius:5px;
            padding:5px;
            color: #6e6868;
            border:1px solid #cdcdcd;
            min-height: 30px;
            max-height: 100px;
            min-width: 50%;
            max-width: 97%;
            padding-left: 14px;
            padding-top: 14px;
            font-family: sans-serif;
            font-size: 16px;
            font-weight: bold;
        }
        textarea:focus{
            outline: none;
        }
    }
    .btn-container{
        display: flex;
        justify-content: center;
        width: inherit;
        margin-top:20px;
        height: 30px;
        .send-btn{
            padding:5px 20px 5px 20px;
            border-radius:5px;
            font-size: 18px;
            color:white;
            background-color: #4d57cd;
            font-weight: bold;
            height: 30px;
            display: flex;
            align-items: center;
            cursor: pointer;
            .send-icon{
                position: relative;
                left: 5px;
            }
        }
    }
    .chatWindow{
        margin:10px;
        display: flex;
        justify-content: center;
        margin-top: 20px;
        .chat-box{
            width: 80%;
            @media (max-width: 450px) {
                width: 90%;
            }
        }
    }
}
</style>