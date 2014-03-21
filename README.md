# eotic

a tiny javascript template engine without any dependence.

## features

* 超简洁的语法
* 没有使用with，屏蔽公认的性能问题
* 完善的报错信息，方便快速定位错误
* TODO: 插件机制
* 遍历数组时，内置支持索引功能。
* 支持`else if`语意块


## usage

文档稍后补全，可以先看[测试用例](http://)里的case，包含了所有的语法。

## compare

### 相对underscore.template的优点

1) 超简洁的语法

2) 没有使用with，屏蔽公认的性能问题

3) 对源模板字符串只执行了一次全局正则匹配，underscore.template是三次

4) 完善的报错信息，方便快速定位错误

5) TODO：支持'管道'filter

### 相对underscore.template的缺点

1) 出于上面第2条的性能考虑，需要在表达式中多写'this.'。以输出`name`值为例，underscore的模板为`<%=name%>`，eotic的模板为`{{this.name}}`。

### 相对mustache系([mustachejs][mustachejs]，[hoganjs][hoganjs]等)模板引擎的优点

[mustachejs]:https://github.com/janl/mustache.js
[hoganjs]:http://twitter.github.io/hogan.js/

1) 更加简化的语法。

2) 遍历数组时，内置支持索引功能。

mustache系(Handlebars可以使用`{{@index}}`)模板还需要自己写hack函数或者需要提前把数组转成对象。这一点对所有初次使用mustache系模板的用户的确照成不小的困扰，stackoverflow上关于"如何输出数组索引"的提问和讨论有很多，有力的说明了这个问题。如：

* [Index of an array element in Mustache.js](http://stackoverflow.com/questions/8567413/index-of-an-array-element-in-mustache-js)
* [In Mustache, How to get the index of the current Section](http://stackoverflow.com/questions/5021495/in-mustache-how-to-get-the-index-of-the-current-section)

3) 直观地支持`else if`语意，mustache系模板需要在`else`块里再嵌套`if`块来间接实现，用起来不爽。

### updates

* 2014-03-21
  - initial version 1.0.0
