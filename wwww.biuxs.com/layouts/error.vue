<template>
    <div class="app-container app-child-page">
        <div class="app-content">
            <div class="app-error">
                <img class="img-404" :src="require(`@/assets/images/404.svg`)" alt="logo">
                <p class="error-text">
                    找不到这个页面了喔～
                </p>
                <div class="back-btn">
                    返回上一页
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-content{
    .app-error{
        margin: 188px auto;
        text-align: center;
        width: 680px;
        .error-text{
            text-align: left;
            margin-top: 30px;
            color: #5F5959;
            font-size: 20px;
            padding-left: 212px;
        }
        .back-btn{
            margin-top: 20px;
            margin-left: 224px;
            width: 172px;
            height: 40px;
            font-size: 14px;
            line-height: 40px;
            color: @app-theme-color;
            border: 1px solid @app-theme-color;
            cursor: pointer;
            transition: background-color .2s ease-in;
            &:hover{
                background-color: #e3cded;
            }
        }
    }
}
</style>
