describe('eotic template engine', function () {
    var et = eotic.template;

    it('eotic.template', function () {
        expect(et).to.be.a('function');
    });

    it('{{}}', function(){
        expect(et('{{this.name}}')({name:'eotic'})).to.be('eotic');
    });

    it('{{}} + html', function(){
        expect(et('{{this.name}}')({name:'<h1>eotic</h1>'})).to.be('<h1>eotic</h1>');
    });

    it('{{}} + "-"', function(){
        // console.log(et('{{this["first-name"]}}').source);
        expect(et('{{this["first-name"]}}')({'first-name':'<h1>eotic</h1>'}))
        .to.be('<h1>eotic</h1>');
    });

    it('w:{{this.w}}, h:{{this.h}}', function(){
        expect(et('w:{{this.w}}, h:{{this.h}}')({
            w:10,
            h:20
        })).to.be('w:10, h:20');
    });

    it('{{@}}', function(){
        expect(et('{{@this.name}}')({name:'eotic'})).to.be('eotic'); 
    });

    it('{{@}} + html', function(){
        expect(et('{{@this.name}}')({name:'<h1>eotic</h1>'})).to.be('&lt;h1&gt;eotic&lt;/h1&gt;'); 
    });

    it('array', function(){
        var data = {
            features: [
                'NO "with"',
                'precompiler'
            ]
        };

        var tpl = '<ul>'+
            '{{#this.features item}}'+
              '<li>{{key}}:{{item}}</li>'+
            '{{/}}'+
        '</ul>';

        var result = '<ul><li>0:NO "with"</li><li>1:precompiler</li></ul>';
        // console.log(et(tpl).source);
        expect(et(tpl)(data)).to.be(result);

// var tpl = '<h1><%=this.module%></h1>'+
// '<ul>'+
//   '<% var list=this.features; for (var i=0, l=list.length; i<l; i++) { %>'+
//       '<li><%=list[i]%></li>'+
//   '<% } %>'+
// '</ul>';

    });

    it('object', function(){
        var data = {
            book: {
                author: 'tim',
                price: '$9.00'
            }
        };

        var tpl = '<ul>'+
            '{{#this.book item key}}'+
              '<li>{{key}}:{{item}}</li>'+
            '{{/}}'+
        '</ul>';

        var result = '<ul><li>author:tim</li><li>price:$9.00</li></ul>';
        // console.log(et(tpl).source);
        expect(et(tpl)(data)).to.be(result);
    });

    it('if true', function(){
        var data = {
            foo: true
        };
        var tpl = '{{#this.foo}}foo{{/}}';
        var result = 'foo';
        // console.log(et(tpl).source);
        expect(et(tpl)(data)).to.be(result);
    });

    it('if false', function(){
        var data = {
            foo: false
        };
        var tpl = '{{#this.foo}}foo{{/}}';
        var result = '';
        // console.log(et(tpl).source);
        expect(et(tpl)(data)).to.be(result);
    });

    it('if ===value', function(){
        var data = {
            foo: 'show'
        };
        var tpl = '{{#this.foo === "show"}}foo{{/}}';
        var result = 'foo';
        // console.log(et(tpl).source);
        expect(et(tpl)(data)).to.be(result);
    });

    it('if !==value', function(){
        var data = {
            foo: 'show'
        };
        var tpl = '{{#this.foo !== "show"}}{{/}}';
        var result = '';
        // console.log(et(tpl).source);
        expect(et(tpl)(data)).to.be(result);
    });

    it('if else', function(){
        var data = {
            foo: false
        };
        var tpl = '{{#this.foo}}'+
            'foo'+
        '{{^}}'+
            'boo'+
        '{{/}}';
        var result = 'boo';
        // console.log(et(tpl).source);
        expect(et(tpl)(data)).to.be(result);
    });

    it('if elseif else', function(){
        var data = {
            foo: 'foo'
        };
        var tpl = '{{#this.foo === "x"}}'+
            'x'+
        '{{^this.foo === "foo"}}'+
            'foo'+
        '{{^}}'+
            'y'+
        '{{/}}';
        var result = 'foo';
        // console.log(et(tpl).source);
        expect(et(tpl)(data)).to.be(result);
    });

    it('ignore', function(){
        var data = {
            foo: 'foo'
        };
        var tpl = '{{this.foo}}{{!ignore}}';
        var result = 'foo';
        // console.log(et(tpl).source);
        expect(et(tpl)(data)).to.be(result);
    });

});