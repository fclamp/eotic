# eotic

a tiny javascript template engine without any dependence.

## features

1. 比mustache更简洁干净的语法。
1. 没有使用with，屏蔽公认的性能问题。
1. 完善的报错信息，便于快速定位错误。
1. 遍历数组时，内置支持索引功能。
1. 内置支持else if语意块。
1. TODO: 支持”管道”filter。
1. TODO: 支持子模板。
1. 配套的预编译工具。


## usage

### string variable: `{{this.varible}}`

output the value of the `key` in context data. 

    var data = {
        "name": "eotic"
    };
    var tpl = "{{this.name}}";
    tpl(data); // "eotic"

if there is no such `key` in context data 

    var data = {
        "name": "eotic"
    };
    var tpl = "{{this.age}}";
    tpl(data); // ""

> 因为没有使用with块，所以这里不会像underscore.template那样报错。


### html-escaped variable: `{{@this.varible}}`

output the html-escaped value of the `key` in context data. 

    var data = {
        "name": "<h1> eotic </h1>"
    };
    var tpl = "{{@this.name}}";
    tpl(data); // "&lt;h1&gt; eotic &lt;/h1&gt;"

### `if` block: {{#this.varible[ operator somevalue]}}



|block|equal to|
|----|----|
|{{#this.foo}}|if (this.foo)|
|{{#this.foo === true}}|if (this.foo === true)|
|{{#this.foo != true}}|if (!this.foo)|
|{{#this.foo !== true}}|if (this.foo !== true)|

下面的例子使用`==`操作符做比较。

    var data = {
        "show": 1
    };
    var tpl = "{{#this.show}}show{{/}}";
    tpl(data); // "show"
    
### `else if` block: {{^this.varible operator somevalue}}

|block|equal to|
|----|----|
|{{^this.foo === true}}|else if (this.foo === true)|
|{{^this.foo != true}}|else if (this.foo != true)|
|{{^this.foo !== true}}|else if (this.foo !== true)|

    var data = {
        "number": 2
    };
    var tpl = "{{#this.number === 1}}"+
        "number is 1"+
    "{{^this.show === 2}}"+
        "number is 2"+
    "{{/}}";
    tpl(data); // "number is 2"

### `else` block: {{^}}

    var data = {
        "show": false
    };
    var tpl = "{{#this.show}}"+
        "show"+
    "{{^}}"+
        "hide"
    "{{/}}";
    tpl(data); // "hide"


### enumeration block: `{{#this.varible item}}`

array data

    var data = {
        name: "eotic",
        features: [
            "simple",
            "standalone"
        ]
    };
    var tpl = "<ul>"+
        "{{#this.features item key}}"+
            "<li>{{key}}. {{this.name}} is {{item}}</li>"+
        "{{/}}"+
    "</ul>";
    tpl(data); 
    // "<ul><li>0. eotic is simple</li><li>1. eotic is standalone</li></ul>"

object data

    var data = {
        features: {
            "grammer": "simple",
            "dependency": "standalone"
        }
    };
    var tpl = "<ul>"+
        "{{#this.features item key}}"+
            "<li>{{key}}:{{item}}</li>"+
        "{{/}}"+
    "</ul>";
    tpl(data); // "<ul><li>grammer:simple</li><li>dependency:standalone</li></ul>"



## updates

* 2014-03-21
  - initial version 1.0.0
