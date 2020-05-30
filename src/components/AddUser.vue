<template>
    <div class="add-user-container">
        <div class="add-user-box">
            <div class="username">
                <input type="text" v-model="username" placeholder="Username" spellcheck="false">
            </div>
            <div class="button-container">
                <div @click="collectUsername" class="join-button btn-hover">
                    JOIN CHANNEL
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AddUser',
    data(){
        return {
            'username' : ''
        }
    },
    methods: {
        collectUsername: function(){
            if(this.username == ""){
                this.$toast.error("Enter Username!!");
                return;
            }
            this.$emit('setUserName',this.username);
        }
    }
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
        .add-user-box{
            position: absolute;
            top: calc(50% - 70px);
            left: calc(50% - 150px);
            background-color: white;
            padding: 30px;
            padding-top: 50px;
            padding-left: 50px;
            padding-right: 55px;
            border-radius: 10px;
            box-shadow: 1px 1px 10px 10px #c3c1c1;
            input{
                width: 97%;
                height: 30px;
                border-radius: 10px;
                border: 1px solid #cdcdcd;
                padding:5px;
                color: #868383;
                font-size: 16px;
                text-align: center;
            }
            input:focus{
                outline: none;
            }
            .button-container{
                margin:20px;
                .join-button{
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
</style>