<template>
    <div class="chat-container">
        <MemberMobile  v-if="showMembersContainer" @copyData="copyData" @openPrivateChat="openPrivateChat" v-bind:currentUser="senderId" v-bind:windowHeight="chatWindowHeight" @close="closeMembersContainer"></MemberMobile>
        <PrivateChat v-if="showPrivateChat" v-bind:receiverId="privateMessageReceiverId" @close="closePrivateChat" @send="sendPrivateMessage"></PrivateChat>
        <AddUser v-if="showAddUser" @setUserName="setUserName"></AddUser>
        <div  @click="openMembersContainer"  v-if="device != 'monitor'" class="floating-button">
            <img src="../assets/settings.png" height="30">
        </div>
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
        <div class="bottomHalf">
            <div class="chatWindow">
                <div class="chat-box">
                    <Message v-for="(chatMessage,index) in chatMessages" :key="index" v-bind:message="chatMessage"></Message>
                </div>
            </div>
            <div  v-if="device == 'monitor'" class="membersContainer">
                <p class="members"> Members </p>
                <div class="shareChannel">
                    <p>Share Channel</p>
                    <img  class="share" @click="copyData" src="../assets/share.png" height="25px"/>
                </div>
                <Members @openPrivateChat="openPrivateChat" v-bind:currentUser="senderId"></Members>
            </div>
        </div>
    </div>    
</template>
<script>
import {getChannelInfo, connectionTermination, privateMessage} from '../service/chat';
import {joinChannel} from '../service/home';
import PrivateChat from '../components/PrivateChat';
import Message from '../components/Message.vue';
import AddUser from '../components/AddUser.vue';
import Members from '../components/Members.vue';
import MemberMobile from '../components/MemberMobile.vue';
export default {
    name: 'chat',
    data(){
        return{
            showMembersContainer: false,
            chatWindowHeight: undefined,
            device:undefined,
            ws: undefined,
            message: '',
            chatMessages : [],
            senderId: '',
            channelName: '',
            userName: '',
            connectionStatus: 'NOT_CONNECTED',
            chatAnonymous: false,
            showAddUser: false,
            showPrivateChat: false,
            privateMessageReceiverId: undefined
        }
    },
    props: ['channel','userId'],
    components : { Message, AddUser, Members, PrivateChat, MemberMobile },
    methods: {
        openMembersContainer: function()
        {
            this.showMembersContainer = true;
        },
        closeMembersContainer: function()
        {
            this.showMembersContainer = false;
        },
        openPrivateChat: function(receiverId)
        {
            this.showPrivateChat = true;
            this.privateMessageReceiverId = receiverId;
        },
        closePrivateChat: function()
        {
           this.showPrivateChat = false; 
           this.privateMessageReceiverId = undefined;
        },
        sendPrivateMessage: function(receiverId,message){
            var obj = {};
            obj["senderId"] = this.senderId;
            obj["receiverId"] = receiverId;
            obj["message"] = message;
            obj["channelName"] = this.channelName;
            obj["isAnonymous"] = this.chatAnonymous;
            this.closePrivateChat();
            privateMessage(obj).then((data)=>{
                console.log(data);
                this.$toast.success("Message sent!!");
            },(err)=>{
                console.log(err);
                this.$toast.error("Something went wrong!!");
            });
            console.log(obj);
        },
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
            obj["senderId"] = received_msg["senderId"];
            obj["isPrivate"] = received_msg["isPrivate"];
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
               var ws = new WebSocket("ws://localhost:3000/channel/"+this.senderId+"/"+this.channelName);
               this.ws = ws;
               var self = this;
               ws.onopen = function() {
                    self.connectionStatus = 'ESTABLISHING_CONNECTION';
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
                  self.connectionStatus = 'NOT_CONNECTED';
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
            let localUser = sessionStorage.getItem("user");
            var params = {
                channel : this.channelName,
                softCreate : localUser ? true : false 
            }
            getChannelInfo(params).then((data)=>{
                console.log(data);
                if(this.userName){
                    if(localUser){ // handling page refresh case
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
            if(this.userName){
                sessionStorage.setItem("user",this.userName);
            }
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
            this.chatWindowHeight = document.getElementsByClassName("chat-container")[0].scrollHeight - document.getElementsByClassName("upper-half")[0].scrollHeight - 75;
            document.getElementsByClassName("chatWindow")[0].style.height = this.chatWindowHeight + "px";
            if(this.device == 'monitor'){
                var self = this;
                setTimeout(function(){
                    console.log(this.chatWindowHeight);
                    document.getElementsByClassName("membersContainer")[0].style.height = self.chatWindowHeight + "px";
                },500);
            }
        },
        copyData: function(){
            var shareURL = "http://localhost:8080/chat/"+this.channelName;
            this.$copyText(shareURL).then((data)=>{
                console.log(data);
                this.$toast.success("Chat URL copied to clipboard!!");
            },(err)=>{
                console.log("error",err);
            });
        },
        detectDevice()
        {
            if(document.body.offsetWidth <= 500){
                this.device = 'mobile';
            } else if( document.body.offsetWidth < 800){
                this.device = 'tablet'; 
            } else {
                this.device = 'monitor';
            }
        }
    },
    mounted() {
        this.detectDevice();
        this.initData();
        this.validation();
        this.registerWindowListeners();
        this.computeChatWindowHeight();
    }
}
</script>
<style lang="scss" scoped>

.chat-container{
    .floating-button{
        background-color: #4d57cd;
        position: absolute;
        bottom: 50px;
        right: 50px;
        border-radius: 30px;
        padding: 7px;
        padding-bottom: 3px;
        cursor: pointer;
    }
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
    .bottomHalf{
        display: flex;
        .chatWindow{
            scroll-behavior: smooth;
            margin:10px;
            display: flex;
            justify-content: center;
            margin-top: 20px;
            overflow-y: scroll;
            flex: 80%;
            .chat-box{
                width: 80%;
                @media (max-width: 450px) {
                    width: 90%;
                }
            }
        }
        .chatWindow::-webkit-scrollbar{
            display: none;
        }
        .membersContainer::-webkit-scrollbar{
            display: none;
        }
        .membersContainer{
            flex: 20%;
            overflow-y: scroll;
            .members{
                display: flex;
                justify-content: center;
                font-weight: bold;
                font-family: cursive;
            }
            .shareChannel{
                align-items: center;
                font-family: cursive;
                display: flex;
                justify-content: space-evenly;
                .share{
                    cursor: pointer;
                }
            }
        }
    }
}
</style>