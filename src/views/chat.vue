<template>
    <div class="chat-container">
        <AddUser v-if="showAddUser" @setUserName="setUserName"></AddUser>
        <div class="upper-half">
            <div class="chat-legend">
            <div class="channel-name">
                Channel : {{channel}}
            </div>
            <div class="chat-connection"> 
                Connection Status :
                <div class="connection-status"> 
                        {{connectionStatus}}
                        <div class="green-ball" v-if="connectionStatus == 'CONNECTED'"></div>
                        <div class="red-ball" v-if="connectionStatus == 'NOT_CONNECTED'"></div>
                        <div class="blue-ball" v-if="connectionStatus == 'ESTABLISHING_CONNECTION'"></div>
                    </div>
            </div>
            <div  v-if="userName" class="user-name">
                Username : {{userName}}
            </div>
            <div class="chat-anonyous">
                <input type="checkbox" v-model="chatAnonymous"> Chat Anonymous
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
        </div>
        <div class="chatWindow">
            <div class="chat-box">
                <Message v-for="(chatMessage,index) in chatMessages" :key="index" v-bind:message="chatMessage"></Message>
            </div>
        </div>
    </div>    
</template>
<script>
import {getChannelInfo, connectionTermination} from '../service/chat';
import {joinChannel} from '../service/home';
import Message from '../components/Message.vue';
import AddUser from '../components/AddUser.vue';
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
            connectionStatus: 'NOT_CONNECTED',
            chatAnonymous: false,
            showAddUser: false
        }
    },
    props: ['channel','userId'],
    components : { Message, AddUser },
    methods: {
        sendMessage: function() {
            var message = this.message;
            if(message == ""){
                this.$toast.error("Type Something....");
                return;
            }
            var obj = {};
            obj["senderId"] = this.senderId;
            obj["message"] = message;
            obj["channelName"] = this.channelName;
            obj["isAnonymous"] = this.chatAnonymous;
            this.ws.send(JSON.stringify(obj));
            console.log("sent");
        },
        handleChatResponse: function(received_msg) {
            this.message = "";
            var obj = {}
            obj["message"] = received_msg["message"];
            obj["senderName"] = received_msg["sender_name"];
            this.chatMessages.push(obj);
            var chatWindowReference = document.getElementsByClassName("chatWindow")[0];
            setTimeout(function(){
                chatWindowReference.scrollTop = chatWindowReference.scrollHeight;
            },300); 
        },
        handleMemberStatus: function (received_msg) {
            if(received_msg["action"] == "remove"){
                this.$store.commit('DELETE_MEMBER',received_msg["userId"]);
            }else if(received_msg["action"] == "add"){
                if(this.senderId != received_msg["user"].userId){
                    this.$store.commit('ADD_MEMBER',received_msg["user"]);
                }
            }
        },
        establishWebSocket: function () {
               console.log("connecting....");
               var ws = new WebSocket("ws://192.168.0.106:3000/channel/"+this.senderId+"/"+this.channelName);
               this.ws = ws;
               var self = this;
               ws.onopen = function() {
                   this.connectionStatus = 'ESTABLISHING_CONNECTION';
               };
				
               ws.onmessage = function (evt) { 
                  var received_msg = evt.data;
                  received_msg = JSON.parse(received_msg);
                  if(received_msg["status"] != 200){
                      console.log(received_msg);
                      self.$toast.error(received_msg["message"]);
                      setTimeout(function(){
                        self.$router.push({ path: '/error-page'});
                      },2000);
                      return;
                  }
                  if(received_msg["message_type"]  == "Connection_Status"){
                      self.connectionStatus = "CONNECTED";
                      self.$store.dispatch('GET_MEMBERS',self.channelName);
                  }else if(received_msg["message_type"]  == "Chat_Message"){
                      self.handleChatResponse(received_msg);
                  }else if(received_msg["message_type"]  == "Member_Info"){
                      self.handleMemberStatus(received_msg);
                  }
                  console.log("Message is received..."+received_msg);
               };
				
               ws.onclose = function() {
                  console.log("Connection is closed..."); 
               };
        },
        join: function(){
            if(this.userName == "" || this.channelName == ""){
            return;
            }
        joinChannel(this.userName,this.channelName).then((data)=>{
            this.$toast.success(data.message);
            this.senderId = data.userId;
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
                self.establishWebSocket();
            },2000);
            },(err)=>{
                this.$toast.error(err.message);
            });
        },
        setUserName(username)
        {
            console.log(username);
            this.userName = username;
            this.showAddUser = false;
            this.join();
        },
        validation: function(){
            var params = {
                channel : this.channelName,
                softCreate : sessionStorage.getItem("user") ? true : false 
            }
            getChannelInfo(params).then((data)=>{
                console.log(data);
                if(this.userName){
                    if(sessionStorage.getItem("user")){ // handling page refresh case
                        this.join();
                    }else{
                        this.establishWebSocket();
                    }
                }else{
                    this.showAddUser = true;
                }
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
            sessionStorage.setItem("user",this.userName);
            window.mine = this;
            var self = this;
            window.onbeforeunload = function()
            {
                console.log("unloaded");
                confirm("Confirm refresh");
                connectionTermination(self.channelName, self.senderId);
            };
        },
        computeChatWindowHeight: function(){
            var chatWindowHeight = document.getElementsByClassName("chat-container")[0].scrollHeight - document.getElementsByClassName("upper-half")[0].scrollHeight - 75;
            document.getElementsByClassName("chatWindow")[0].style.height = chatWindowHeight + "px";
        }
    },
    mounted() {
        this.initData();
        this.validation();
        this.registerWindowListeners();
        this.computeChatWindowHeight();
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
        .channel-name{
            display: flex;
            align-items: center;
        }
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
                .blue-ball{
                    height: 15px;
                    width: 15px;
                    background-color: blue;
                    border-radius: 10px;
                    margin: 5px;
                    position: relative;
                }
            }
        }
        .user-name{
            display: flex;
            align-items: center;
        }
        .chat-anonyous{
            input{
                height: 15px;
                width: 15px;
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
        scroll-behavior: smooth;
        margin:10px;
        display: flex;
        justify-content: center;
        margin-top: 20px;
        overflow-y: scroll;
        .chat-box{
            width: 80%;
            @media (max-width: 450px) {
                width: 90%;
            }
        }
    }
}
</style>