<template>
    <div>
        <div v-for="member in $store.getters.MEMBERS" :key="member.userId">
            <div class="memberBox">
                <UserLogo v-bind:color="member.color" v-bind:name="member.nickName" ></UserLogo>
                <div class="memberLegend">
                    {{member.userName}}
                </div>
                <div v-if="currentUser != member.userId" class="chatIcon" @click="sendPrivateMessage(member.userId)">
                    <img src="../assets/chat.png" />
                </div>
            </div>
        </div>
    </div>    
</template>
<script>
import UserLogo from './UserLogo';
export default {
    name: 'Members',
    components : {UserLogo},
    props: ['currentUser'],
    methods: {
        sendPrivateMessage: function(receiverId){
            this.$emit('openPrivateChat',receiverId);
        }
    }
}
</script>
<style lang="scss" scoped>
.memberBox{
    display: flex;
    align-items: center;
    padding-left: 10px;
    background-color: white;
    border-radius: 5px;
    padding: 10px;
    box-shadow: 1px 1px 1px 1px #cdcdcd;
    margin: 10px;
    position: relative;
    .memberIdentifier{
        border-radius: 30px;
        height: 50px;
        width: 50px;
        color: white;
        position: relative;
        .memberNickName{
            display: flex;
            justify-content: center;
            align-items: center;
            height: inherit;
        }
    }
    .memberLegend{
        padding-left: 10px;
        width: 60%;
    }
    .chatIcon{
        position: absolute;
        right: 6px;
        img{
            height: 25px;
            cursor: pointer;
        }
    }
}
</style>