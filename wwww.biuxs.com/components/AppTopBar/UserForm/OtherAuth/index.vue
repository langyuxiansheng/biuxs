<template>
    <div class="form-item app-flex">
        <span class="form-item-title">第三方账号登录</span>
        <ul class="other-list app-flex">
            <li title="QQ登录">
                <i class="iconfont iconQQdenglu" />
            </li>
            <li title="微信授权登录">
                <i class="iconfont iconweixindenglu" />
            </li>
            <li title="Github授权登录">
                <i class="iconfont icongithub1" />
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'OtherAuth'
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.form-item{
    margin-bottom: 20px;
    .other-list{
        margin-left: 20px;
        li{
            margin-right: 10px;
            cursor: pointer;
            .iconfont{
                font-size: 26px;
            }
            &:hover{
                color: #f00;
            }
        }
    }
}
</style>
