import Vue from 'vue';
import AppMessage from '@/components/AppMessage';
AppMessage.config({
    top: 20,
    duration: 3000,
    zIndex: 10000
});
Vue.prototype.$message = AppMessage;

/**
this.$message(options)
this.$message.info(options)
this.$message.success(options)
this.$message.warning(options)
this.$message.error(options)
this.$message.loading(options)

Message(options)
Message.info(options)
Message.success(options)
Message.warning(options)
Message.error(options)
Message.loading(options)

Options
参数	说明	类型	可选值	默认值
zIndex （新增）	层级	number	—	2000
message	消息文字	string / VNode	—	—
type	主题	string	success/warning/info/error/loading	info
iconClass	自定义图标的类名，会覆盖 type	string	—	—
customClass	自定义类名	string	—	—
duration	显示时间, 毫秒。设为 0 则不会自动关闭	number	—	3000
showClose	是否显示关闭按钮	boolean	—	false
onClose	关闭时的回调函数, 参数为被关闭的 message 实例	function	—	—

方法
调用 Message 或 this.$message 会返回当前 Message 的实例。 如果需要手动关闭实例，可以调用它的 close 方法。

方法名	说明
close	关闭当前的 Message
¶全局配置 （新增特性）
调用 Message.config(options) 来进行全局配置。

Messge.config({
  top: 20,
  duration: 3000,
  zIndex: 2000
})
参数	说明	类型	可选值	默认值
top	提示组件距离顶端的距离，单位像素	number	—	—
duration	显示时间, 毫秒。设为 0 则不会自动关闭，优先级低于局部配置	number	—	—
zIndex	层级，优先级低于局部配置	number	—	—

 */
