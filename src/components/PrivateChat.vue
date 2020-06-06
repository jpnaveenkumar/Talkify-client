<template>
    <div class="chat-private-container">
        <div class="chat-private-box">
            <div class="closeChat" @click="closeChat">
                <img height="20px" src="../assets/close.png">
            </div>
            <div class="private-chat">
                <div v-if="receiverInfo" class="receiver-legend">
                    <UserLogo v-bind:color="receiverInfo.color" v-bind:name="receiverInfo.nickName" ></UserLogo>
                    <p class="receiver">{{receiverInfo.userName}}</p>
                </div>
                <div class="Message">
                    <textarea type="text" spellcheck="false" v-model="message" placeholder="Send Message Privately ....."></textarea>
                </div>
                <div class="button-container">
                    <div @click="sendPrivateMessage" class="send-button btn-hover">
                        Send Message
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UserLogo from './UserLogo';
export default {
    name: 'PrivateChat',
    data(){
        return {
            message : '',
            receiverInfo : undefined
        }
    },
    props : [ 'receiverId' ],
    components : {UserLogo},
    mounted (){
        this.receiverInfo = this.$store.getters.memberById(this.receiverId);
    },
    methods: {
        sendPrivateMessage: function(){
            if(this.message == ""){
                this.$toast.error("Type Something...");
                return;
            }
            this.$emit('send',this.receiverId,this.message);
        },
        closeChat: function()
        {
            this.$emit('close');
        }
    }
}
</script>
<style lang="scss" scoped>
.chat-private-container{
    height: 100vh;
    width: 100%;
    background-color: #cdcdcda3;
    z-index: 2;
    position: absolute;
    top: -3px;
    left: -3px;
    display: flex;
    align-items: center;
    justify-content: center;
    .chat-private-box{
        display: flex;
        position: relative;
        background-color: white;
        padding: 30px;
        padding-top: 50px;
        padding-left: 50px;
        padding-right: 55px;
        border-radius: 10px;
        box-shadow: 1px 1px 10px 10px #c3c1c1;
        width: 50%;
        height: fit-content;
        .closeChat{
            position: absolute;
            top: 10px;
            right: 15px;
        }
        .private-chat{
            width: 100%;
            .receiver-legend{
                display: flex;
            }
            .receiver{
                font-weight: bold;
                margin-left:10px;
                font-family: cursive;
            }
            .Message{
                margin-top: 20px;
            }
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
                min-width: 80%;
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
            .button-container{
                margin:20px;
                .send-button{
                    margin: 5px;
                    padding: 10px;
                    font-family: cursive;
                    font-weight: bold;
                    text-align: center;
                    transition: all .5s;
                    color:white;
                    border-radius: 3px;
                    background-color: #0ED2F7;
                    cursor: pointer;
                }
                .btn-hover:hover{
                    background-color: #0ED2F7;
                    border:0px;
                    box-shadow: 1px 1px 2px 1px #40b7ef;
                }
            }
        }
    }
}
</style>