<template>
    <div class="memberIdentifier" v-bind:style="{backgroundColor: color}">
        <div class="memberNickName">
            {{name}}
        </div>
    </div>
</template>
<script>
export default {
    name: 'UserLogo',
    props: ['color','name']
}
</script>
<style lang="scss" scoped>
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
</style>