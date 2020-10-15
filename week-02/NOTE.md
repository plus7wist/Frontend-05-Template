# 学习笔记

## 边框宽度的问题

给一个 div 设置 width 是 6px，border-right-width 是 1px，期望格子宽度是 7px；但实际上格子宽度是 6.8px 左右。调试工具显示 border-right-width 的计算值是 0.8px。

这是 FireFox 的一个 BUG，目前还没有修复。触发的原因是边框和内容的缩放比例不一致。我的笔记本 Windows 设置了显示器缩放 125%，这个数影响了 border-right-width 的计算值。

解决办法之一给 div 设置 box-sizing: border-box，这时格子宽度会算上边框。width 相应改成 7px。则内容还是 6px，边框是 1px。

## 箭头函数不能写出生成器

不明白。

## webpack-dev-server

webpack 的文档上推荐使用 webpack-dev-server，但实际上：

> webpack-cli v4 comes with out of box support of @webpack-cli/serve which means you can use webpack serve to invoke the webpack-dev-server.

不过依然需要安装 webpack-dev-server。才能使用 webpack serve。尝试了一下之后感觉这个工具耦合过于严重，退而使用 webpack --watch。
