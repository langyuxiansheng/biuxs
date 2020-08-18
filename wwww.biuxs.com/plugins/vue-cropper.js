import Vue from 'vue';
import VueCropper from 'vue-cropper';
Vue.use(VueCropper);

/**
名称	功能	默认值	可选值
img	裁剪图片的地址	空	url 地址 || base64 || blob
outputSize	裁剪生成图片的质量	1	0.1 - 1
outputType	裁剪生成图片的格式	jpg (jpg 需要传入jpeg)	jpeg || png || webp
info	裁剪框的大小信息	true	true || false
canScale	图片是否允许滚轮缩放	true	true || false
autoCrop	是否默认生成截图框	false	true || false
autoCropWidth	默认生成截图框宽度	容器的80%	0~max
autoCropHeight	默认生成截图框高度	容器的80%	0~max
fixed	是否开启截图框宽高固定比例	true	true | false
fixedNumber	截图框的宽高比例	[1, 1]	[宽度, 高度]
full	是否输出原图比例的截图	false	true | false
fixedBox	固定截图框大小 不允许改变	false	true | false
canMove	上传图片是否可以移动	true	true | false
canMoveBox	截图框能否拖动	true	true | false
original	上传图片按照原始比例渲染	false	true | false
centerBox	截图框是否被限制在图片里面	false	true | false
high	是否按照设备的dpr 输出等比例图片	true	true | false
infoTrue	true 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
maxImgSize	限制图片最大宽度和高度	2000	0-max
enlarge	图片根据截图框输出比例倍数	1	0-max(建议不要太大不然会卡死的呢)
mode	图片默认渲染方式	contain	contain , cover, 100px, 100% auto
内置方法 通过this.$refs.cropper 调用
this.$refs.cropper.startCrop() 开始截图
this.$refs.cropper.stopCrop() 停止截图
this.$refs.cropper.clearCrop() 清除截图
this.$refs.cropper.changeScale() 修改图片大小 正数为变大 负数变小
this.$refs.cropper.getImgAxis() 获取图片基于容器的坐标点
this.$refs.cropper.getCropAxis() 获取截图框基于容器的坐标点
this.$refs.cropper.goAutoCrop 自动生成截图框函数
this.$refs.cropper.rotateRight() 向右边旋转90度
this.$refs.cropper.rotateLeft() 向左边旋转90度
图片加载的回调 imgLoad 返回结果success, error
获取截图信息
this.$refs.cropper.cropW 截图框宽度

this.$refs.cropper.cropH 截图框高度

// 获取截图的base64 数据
this.$refs.cropper.getCropData((data) => {
  // do something
  console.log(data)
})

// 获取截图的blob数据
this.$refs.cropper.getCropBlob((data) => {
  // do something
  console.log(data)
})

### Description of the default rendering mode of the image
Image layout mode mode achieves the same effect as css background
Contain Centered layout Default does not scale Ensure the image is inside the container mode: 'contain'
Cover stretch layout fill the entire container mode: 'cover'
If only one value is given, this value will be used as the width value and the height value will be set to auto. mode: '50px'
If two values are given, the first one will be the width value and the second will be the height value. mode: '50px 60px'

### 预览
``` html
@realTime="realTime"
// Real time preview function
realTime(data) {
  var previews = data;
  var h = 0.5;
  var w = 0.2;

  this.previewStyle1 = {
    width: previews.w + "px",
    height: previews.h + "px",
    overflow: "hidden",
    margin: "0",
    zoom: h
  };

  this.previewStyle2 = {
    width: previews.w + "px",
    height: previews.h + "px",
    overflow: "hidden",
    margin: "0",
    zoom: w
  };

  固定为100宽度
  this.previewStyle3 = {
    width: previews.w + "px",
    height: previews.h + "px",
    overflow: "hidden",
    margin: "0",
    zoom: 100 / preview.w
  };

  固定为100高度
  this.previewStyle4 = {
    width: previews.w + "px",
    height: previews.h + "px",
    overflow: "hidden",
    margin: "0",
    zoom: 100 / preview.h
  };
  this.previews = data;
},

<div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden',
    'margin': '5px'}">
  <div :style="previews.div">
    <img :src="option.img" :style="previews.img">
  </div>
</div>
<p>中等大小</p>
<div :style="previewStyle1">
  <div :style="previews.div">
    <img :src="previews.url" :style="previews.img">
  </div>
</div>

<p>迷你大小</p>
<div :style="previewStyle2">
  <div :style="previews.div">
    <img :src="previews.url" :style="previews.img">
  </div>
</div>
=
图片移动回调函数 @imgMoving
data type
{
   moving: true, // moving 是否在移动
   axis: {
    x1: 1, // 左上角
	 x2: 1，// 右上角
	 y1: 1，// 左下角
	 y2: 1 // 右下角
   }
 }
截图框移动回调函数 @cropMoving
data type
{
   moving: true, // moving 是否在移动
   axis: {
    x1: 1, // 左上角
	 x2: 1，// 右上角
	 y1: 1，// 左下角
	 y2: 1 // 右下角
   }
 }

 */
