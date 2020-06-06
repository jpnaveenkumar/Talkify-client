<template>
    <div class="add-user-container">
        <div class="add-user-box">
            <div @click="close" class="closeBtn">
                <img height="15px" src="../assets/close.png"/>
            </div>
            <div class="membersContainer">
                <p class="members"> Members </p>
                <div class="shareChannel">
                    <p>Share Channel</p>
                    <img @click="copyData" src="../assets/share.png" height="25px"/>
                </div>
                <Members class="chatMembers" @openPrivateChat="openPrivateChat" v-bind:currentUser="currentUser"></Members>
            </div>
        </div>
    </div>
</template>
<script>
import Members from '../components/Members.vue';
export default {
    name : 'MemberMobile',
    data(){
        return {

        }
    },
    components : {Members},
    mounted(){
        
    },
    methods : {
        openPrivateChat: function(receiverId)
        {
           this.$emit('openPrivateChat',receiverId);
        },
        copyData: function()
        {
            this.$emit('copyData');
        },
        close: function()
        {
            this.$emit('close');
        }
    },
    props : ['currentUser']
}
</script>
<style lang="scss" scoped>
    .add-user-container{
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
        .add-user-box{
            position: relative;
            width: 60%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            padding: 30px;
            padding-top: 10px;
            border-radius: 10px;
            box-shadow: 1px 1px 10px 10px #c3c1c1;
            .closeBtn{
                position: absolute;
                top: 10px;
                right: 10px;
            }
            .membersContainer::-webkit-scrollbar{
                display: none;
            }
            .membersContainer{
                flex: 20%;
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
                }
                .chatMembers{
                    height: 250px;
                    overflow-y: scroll;
                }
            }
        }
    }
</style>