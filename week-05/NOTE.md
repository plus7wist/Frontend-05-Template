# 学习笔记

## Proxy

对对象进行包装，重新定义对对象的操作。可以看作是使用组合而不是接口来实现动态分发的途径。

## effect 接口

effect 以一个回调函数，和被此函数捕获的 reactive 对象为参数。当被捕获的 reactive 对象发生改变，触发回调函数。

实际上被回调函数绑定的对象不易也无法直接传递给 effect 函数：因为 Javascript 的函数是分享调用的。所以实际上 effect 会在注册阶段调用一次回调函数，从而获取被他捕获的 reactive 对象的列表。

reactive 对象实际上是为了满足 effect 需要而对对象进行的 Proxy 包装。

人们常把 effect 视作对 reactive 对象的值的意义的定义，在这当中用赋值模拟绑定。所以 effect 注册阶段的莫名其妙的调用也就变成了初始绑定：即要求被绑定的 reactive 的初始值存活不仅存活在回调函数之前，也要存活在 effect 之前。

## effect 的共享

effect 没有任何通信接口，所以是通过共享进行通信的。但要注意它同时却是一个纯函数，可以进行记忆化。

按照上一节的解析，effect 的职责主要是获取被回调函数绑定的 reactive，并且进行绑定。

1. 回调函数需要通知 effect，它捕获了哪些 reactive。

2. effect 需要通知每个被回调函数捕获的 reactive，当后者执行 set 操作时需要执行的回调函数是什么，reactive 就可以利用 Proxy 代理调用这些函数。

## 拖拽

监听被拖拽对象的 mousedown 事件，在此事件触发时，再在 document 上注册 mousemove 和 mouseup 事件。在在这个过程注册的 mouseup 回调调用的时候删除响应 mouseup 和 mousemove 的回调函数。

移动对象要以 translate 函数修改 transform 样式。mousemove 中元素的偏移就是 mousedown 时鼠标的位置到此时的鼠标位置的偏移。但是 transform 总是从元素的起点开始计算的，所以需要手动累计多次拖拽之间的偏移量的和。

## 内容中的拖拽

首先创建若干空 range 的列表，视作插入点。在 mousemove 事件中找到举例当前位置最近的 range，用此 range 插入被拖拽对象即可。在这个过程中注意要获取与 range 的 getBoundingClientRect 同座标系的位置。
