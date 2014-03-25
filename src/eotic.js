/*
 * @module eotic
 * @author gnosaij
 *
 * 相对underscore.template的优点
 *   (0) 超简洁的语法
 *   (1) 没有使用with，屏蔽公认的性能问题
 *   (2) 对源模板字符串只执行了一次全局正则匹配，underscore.template是三次
 *   (3) 完善的报错信息，方便快速定位错误
 *   (4) TODO：支持'管道'filter
 * 相对underscore.template的缺点
 *   (1) 出于上面第一条的性能考虑，需要在表达式中多写'this.'，如：
 *       underscore：<%=name%>
 *       eotic：<%=this.name%>
 *
 * 相对mustache系(mustachejs/hoganjs)模板引擎的优点
 *   (1) 更加简化的语法
 *   (2) 遍历数组时，可以直接使用索引，mustache系(handlbar除外)模板还需要
 *       自己写hack函数或者干脆把数组转成对象。
 *       这一点对所有初次使用mustache系模板的用户的确照成不小的困扰，
 *       stackflow上关于"如何输出数组索引"的提问和回答有很多，有力的说明了这个问题。
 *   (3) 支持elseif语意，mustache系(handlbar除外)模板还需要通过在else块里再次
 *       嵌套if块来间接实现，困扰不小。
 *
 * 参考
 *   (1) http://ejohn.org/blog/javascript-micro-templating/
 *   (2) http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
 *   (3) https://github.com/janl/mustache.js/
 *   (4) http://www.yajet.net/yajet/doc/yajet.html
 */
(function(glob) {
var re = /\{\{(.+?)\}\}/g,
    thisReg = /\bthis\b/g,
    thisAlt = 't__',
    flags = '#^/@!>',
    eachReg = /^t__(.+?)\s(\w+)\s?(\w+)?.*$/, // see unit test
    escapeReg = /[&<>"']/g,
    escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
    };

var eotic = {
    compile: compile,
    escape: ee
};

// replacer callback for ee
function rr(match) {
    return escapeMap[match];
}

// escape html chars
// NOTE: 'escape' is reserved word in javascript
function ee(string) {
    return string == null ? '' : ''+string.replace(escapeReg, rr);
}

// @param {string} str  the string to be processed
// @param {boolean} js  if the 'str' is a js expression
function add(str, js) {
    if (!str) return '';
    var code = '';
    // console.log('-----',str, js);
    if (js) {
        // turn 'this'(point to data) to 't__' globally
        str = str.replace(thisReg, thisAlt);

        var firstChar = str[0];

        if (flags.indexOf(firstChar) === -1) {
            code +='r__.push(' + str + ');\n';
        } else {
            // @foo => foo
            str = str.substr(1);
            switch (firstChar) {
                case '@':
                    code +='r__.push(e__(' + str + '));\n';
                    break;
                case '#':
                    // {#t__.list value key} 
                    // => 'var key, value; 
                    //    for(key in t__.list){ value = t__.list[key];'
                    // {#t__.foo === "foo"}  
                    // => 'if(t__.foo === "foo"){'
                    if (eachReg.test(str)) {
                        code += str.replace(eachReg, function (all, list, value, key) {
                        key = key || 'key';
                        return 'var '+key+', '+ value +'\n'+
                            'for('+key+' in t__'+list+'){\n'+
                                'if(!t__'+list+'.hasOwnProperty('+key+')) return;\n'+
                                value+' = t__'+list+'['+key+'];\n';
                        });
                    } else {
                        code += 'if('+str+'){\n';
                    }
                    break;
                case '^':
                    if (!str) {
                        code += '}else{\n';
                    } else {
                        code += '}else if('+str+'){\n';
                    }
                    break;
                case '/':
                    code += '}\n';
                    break;
                case '!':
                default:
                    break;
            }
        }
    } else {
        code += str != '' ? 'r__.push("' + str.replace(/"/g, '\\"') + '");\n' : '';
    }
        
    return code;
}


function compile(html) {

    var match = null,
        block = 0, // 是否在代码块{}中 数字表示代码块的层级
        code = 'var r__=[];\n',
        cursor = 0;

    while(match = re.exec(html)) {
        // console.log(match);
        code += add(html.slice(cursor, match.index))
        code += add(match[1], true);
        cursor = match.index + match[0].length;
    }

    code += add(html.substr(cursor, html.length - cursor));

    code = (code + 'return r__.join("");');//.replace(/[\r\t\n]/g, '');

    var render = function (data) {
        var result;
        try { 
            result = new Function('var t__=this, e__=eotic.escape;' + code).apply(data);
        } catch(err) {
            console.error(err.message + " from data and tpl below:");
            console.log(data);
            console.log(html);
        }
        return result;            
    };

    // for precompile by nodejs
    // NOTE: reserved variables contains:
    //    'r__' array that holds the string fragments
    //    't__' point to data
    //    'e__' html-escape function, added within compile scripts
    // 
    // precompiled file will be made of:
    // 
    // header.js + body(created by nodejs) + footer.js
    // 
    //        ┌ (function (glob) {
    // header ┤     var tpl = {};
    //        └     var e__ = function () {};  // prefilled!!!
    //              
    //        ┌     tpl.menu = function (data) {
    //        │         var t__ = data;
    // body   ┤         var r__ = [];
    //        │     }
    //        └     // more tpl.xxx
    //  
    //        ┌     // AMD/CMD/browser support
    // footer ┤     ...
    //        └ })(this);

    return {
        render: render,
        source: 'function (data) {\nvar t__=data;\n' + code + '\n}'
    };
} // tt

(typeof module != 'undefined' && module.exports) ?
    (module.exports = eotic) :
    (typeof define === 'function' && define.amd) ?
        define('eotic', [], function() { return eotic; }) :
        (glob.eotic = eotic);
})(this);