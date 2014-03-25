# eotic

a tiny javascript template engine without any dependence.

## features

1. Cleaner grammer than `mustache`.
1. Without `with` statement in compiled function, so recognized performance problems will be shielded.
1. More detailed error logging.
1. Build-in `index` support when iterating an array.
2. Build-in `else if` support.
1. TODO: Customizable output filter plugin.
1. TODO: More useful partial template than `mustache`.
1. TODO: Matching precompiled npm tool.


## usage

### string variable: `{{this.varible}}`

output the value of the `key` in context data. 

    var data = {
        "name": "eotic"
    };
    var tpl = eotic.compile("{{this.name}}");
    tpl.render(data); // "eotic"

if there is no such `key` in context data.

    var tpl = eotic.compile("{{this.name}}");
    tpl.render({}); // ""

> Beginning with `this.` prefix, it will not throw errors like `underscore`.

### html-escaped variable: `{{@this.varible}}`

output the html-escaped value of the `key` in context data. 

    var data = {
        "name": "<h1> eotic </h1>"
    };
    var tpl = eotic.compile("{{@this.name}}");
    tpl.render(data); // "&lt;h1&gt; eotic &lt;/h1&gt;"

### `if` block: {{#somevalue[ operator somevalue]}}

demo data

    var data = {
        a: true,
        b: 1,
        c: 0
    };

表达式和值的对应demo

|block|equal to|result|note|
|----|----|----|----|
|{{#this.a}}|if (this.a)|true|variable vs somevalue|
|{{#this.b}}|if (this.b)|true|variable vs somevalue|
|{{#this.b === true}}|if (this.b === true)|false|variable vs somevalue|
|{{#this.b != true}}|if (this.b != true)|false|variable vs somevalue|
|{{#this.b !== true}}|if (this.b !== true)|true|variable vs somevalue|
|{{#this.a == this.b}}|if (this.a == this.b)|true|variable vs variable|

    
### `else if` block: {{^this.varible operator somevalue}}

|block|equal to|result|note|
|----|----|----|----|
|{{^this.a}}|else if (this.a)|true|variable vs somevalue|
|{{^this.b}}|else if (this.b)|true|variable vs somevalue|
|{{^this.b === true}}|else if (this.b === true)|false|variable vs somevalue|
|{{^this.b != true}}|else if (this.b != true)|false|variable vs somevalue|
|{{^this.b !== true}}|else if (this.b !== true)|true|variable vs somevalue|
|{{^this.a == this.b}}|else if (this.a == this.b)|true|variable vs variable|

demo

    var data = {
        "number": 2
    };
    var tpl = eotic.compile("{{#this.number === 1}}"+
        "number is 1"+
    "{{^this.number === 2}}"+
        "number is 2"+
    "{{/}})";
    tpl.render(data); // "number is 2"

### `else` block: {{^}}

    var data = {
        "show": false
    };
    var tpl = eotic.compile("{{#this.show}}"+
        "show"+
    "{{^}}"+
        "hide"
    "{{/}})";
    tpl.render(data); // "hide"


### enumeration block: `{{#this.varible item}}`

array data

    var data = {
        name: "eotic",
        features: [
            "simple",
            "standalone"
        ]
    };
    var tpl = eotic.compile("<ul>"+
        "{{#this.features item key}}"+
            "<li>{{key}}. {{this.name}} is {{item}}</li>"+
        "{{/}}"+
    "</ul>");
    tpl.render(data); 
    // "<ul><li>0. eotic is simple</li><li>1. eotic is standalone</li></ul>"

object data

    var data = {
        features: {
            "grammer": "simple",
            "dependency": "standalone"
        }
    };
    var tpl = eotic.compile("<ul>"+
        "{{#this.features item key}}"+
            "<li>{{key}}:{{item}}</li>"+
        "{{/}}"+
    "</ul>");
    tpl.render(data); 
    // "<ul><li>grammer:simple</li><li>dependency:standalone</li></ul>"

### comments block {{!comment text}}

    var tpl = eotic.compile("{{!hello}}eotic");
    tpl.render(); // "eotic"
    
### end of a block {{/}}

you can see it everywhere in the code above.

## updates

* 2014-03-21
  - initial version 1.0.0
