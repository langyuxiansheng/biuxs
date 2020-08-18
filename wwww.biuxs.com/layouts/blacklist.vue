<template>
    <div class="app-container app-child-page">
        <nuxt />
    </div>
</template>
<script>
export default {
    name: 'Blacklist',
    transition: {
        name: 'test',
        mode: 'fade-in'
    }
};
</script>
<style lang="less" scoped>
.app-child-page{
    .app-content{
        min-height: 800px;
    }
    /deep/ .app-page-content{
        line-height: 2;
    }
    /* table 样式 */
    /deep/ table {
        border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
    }
    /deep/ table td,
    /deep/ table th {
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        padding: 3px 5px;
    }
    /deep/ table th {
        border-bottom: 2px solid #ccc;
        text-align: center;
    }

    /* blockquote 样式 */
    /deep/ blockquote {
        display: block;
        border-left: 8px solid #d0e5f2;
        padding: 5px 10px;
        margin: 10px 0;
        line-height: 1.4;
        font-size: 100%;
        background-color: #f1f1f1;
    }

    /* code 样式 */
    /deep/ code {
        display: inline-block;
        *display: inline;
        *zoom: 1;
        background-color: #f1f1f1;
        border-radius: 3px;
        padding: 3px 5px;
        margin: 0 3px;
    }
    /deep/ pre code {
        display: block;
    }

    /* ul ol 样式 */
    /deep/ ul, ol {
        margin: 10px 0 10px 20px;
    }
}
</style>
