<template>
    <div id="move-wrap">
        <ul id="move-list">
            <template v-if="list && list.length">
                <template v-for="(item,k) in list">
                    <li :key="`l-${k}`">
                        <!-- <img v-image-preview class="carousel-image" :src="`${$IMAGE_PATH }/${item.path}`" alt=""> -->
                        <!-- <img v-image-preview class="carousel-image" :src="item.url" alt=""> -->
                        <el-image
                            fit="cover"
                            class="carousel-image"
                            :src="`${$IMAGE_PATH }/${item.path}`"
                            :preview-src-list="list.map(v => `${$IMAGE_PATH}/${v.path}`)"
                        />
                        <p v-if="item.fileName" class="img-text">
                            {{ item.fileName }}
                        </p>
                    </li>
                </template>
                <template v-for="(item,k) in list">
                    <li :key="`j-${k}`">
                        <!-- <img v-image-preview class="carousel-image" :src="`${$IMAGE_PATH }/${item.path}`" alt=""> -->
                        <!-- <img v-image-preview class="carousel-image" :src="item.url" alt=""> -->
                        <el-image
                            fit="cover"
                            class="carousel-image"
                            :src="`${$IMAGE_PATH }/${item.path}`"
                            :preview-src-list="list.map(v => `${$IMAGE_PATH}/${v.path}`)"
                        />
                        <p v-if="item.fileName" class="img-text">
                            {{ item.fileName }}
                        </p>
                    </li>
                </template>
            </template>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'PictureScroll',
    props: {
        list: {
            type: [Array],
            required: false,
            default: []
        }
    }
};
</script>
<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
 //图片滚动
@keyframes move {
    0% {
        left: 0%;
    }
    100% {
        left: -100%;
    }
}
#move-wrap {
    height: 158px;
    position: relative;
    overflow: hidden;
}
#move-list {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    padding: 0;
    animation: move 80s infinite linear;
    width: 200%;
    height: 100%;
    box-sizing: content-box;
    display: flex;
}
#move-list li {
    list-style: none;
    padding: 0 .125rem;
    height: 100%;
    position: relative;
    .carousel-image{
        .max-img();
        max-width: 220px;
        min-width: 210px;
        height: 100%;
        margin: 0 auto;
    }
    .img-text{
        width: 100%;
        position: absolute;
        text-align: center;
        left: 0;
        bottom: 0;
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        padding: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
#move-wrap:hover #move-list {
    animation-play-state: paused;
}
// #move-list li  {
//     display: block;
//     max-width: 220px;
//     height: 100%;
//     margin: 0 auto;
// }
</style>
