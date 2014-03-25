describe('inner-system test', function () {
    var ec = eotic.compile;
    var eachReg = /^t__(.+?)\s(\w+)\s?(\w+)?.*$/;

    it('eotic.template is function', function () {
        expect(ec).to.be.a('function');
    });

    it('eachReg null', function(){
        expect('t__.a'.match(eachReg)).to.be(null);
    });

    it('eachReg this.a b', function(){
        var m1 = 't__.a b'.match(eachReg);
        expect(m1[0]).to.be("t__.a b");
        expect(m1[1]).to.be(".a");
        expect(m1[2]).to.be("b");
    });

    it('eachReg this.a.a b', function(){
        var m1 = 't__.a.a b'.match(eachReg);
        expect(m1[0]).to.be("t__.a.a b");
        expect(m1[1]).to.be(".a.a");
        expect(m1[2]).to.be("b");
    });

    it('eachReg this["a"] b', function(){
        var m1 = 't__["a"] b'.match(eachReg);
        expect(m1[0]).to.be('t__["a"] b');
        expect(m1[1]).to.be('["a"]');
        expect(m1[2]).to.be("b");
    });

    it('eachReg this["a"].a b', function(){
        var m1 = 't__["a"].a b'.match(eachReg);
        expect(m1[0]).to.be('t__["a"].a b');
        expect(m1[1]).to.be('["a"].a');
        expect(m1[2]).to.be("b");
    });

    it('eachReg this.a["a"] b', function(){
        var m1 = 't__.a["a"] b'.match(eachReg);
        expect(m1[0]).to.be('t__.a["a"] b');
        expect(m1[1]).to.be('.a["a"]');
        expect(m1[2]).to.be("b");
    });

    it('eachReg this["a"]["a"] b', function(){
        var m1 = 't__["a"]["a"] b'.match(eachReg);
        expect(m1[0]).to.be('t__["a"]["a"] b');
        expect(m1[1]).to.be('["a"]["a"]');
        expect(m1[2]).to.be("b");
    });

    it('eachReg this["a-a"] b', function(){
        var m1 = 't__["a-a"] b'.match(eachReg);
        expect(m1[0]).to.be('t__["a-a"] b');
        expect(m1[1]).to.be('["a-a"]');
        expect(m1[2]).to.be("b");
    });


});


describe('usage test', function () {
    var ec = eotic.compile;

    it('{{}}', function(){
        expect(ec('{{this.name}}').render({name:'eotic'})).to.be('eotic');
    });

    it('{{}},no key', function(){
        // console.log(ec('{{this.age}}').source);
        expect(ec('{{this.age}}').render({name:'eotic'})).to.be('');
    });

    it('{{}},html', function(){
        expect(ec('{{this.name}}').render({name:'<h1>eotic</h1>'})).to.be('<h1>eotic</h1>');
    });

    it('{{}} + "-"', function(){
        // console.log(ec('{{this["first-name"]}}').source);
        expect(ec('{{this["first-name"]}}').render({'first-name':'<h1>eotic</h1>'}))
        .to.be('<h1>eotic</h1>');
    });

    it('w:{{this.w}}, h:{{this.h}}', function(){
        expect(ec('w:{{this.w}}, h:{{this.h}}').render({
            w:10,
            h:20
        })).to.be('w:10, h:20');
    });

    it('{{@}}', function(){
        expect(ec('{{@this.name}}').render({name:'eotic'})).to.be('eotic'); 
    });

    it('{{@}} + html', function(){
        expect(ec('{{@this.name}}').render({name:'<h1>eotic</h1>'})).to.be('&lt;h1&gt;eotic&lt;/h1&gt;'); 
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
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('this.variable in block', function(){
        var data = {
            name: 'eotic',
            features: [
                'simple',
                'standalone'
            ]
        };

        var tpl = '<ul>'+
            '{{#this.features item}}'+
              '<li>{{this.name}} is {{item}}</li>'+
            '{{/}}'+
        '</ul>';

        var result = '<ul><li>eotic is simple</li><li>eotic is standalone</li></ul>';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
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
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('object "a-b" key', function(){
        var data = {
            'new-book': {
                author: 'tim',
                price: '$9.00'
            }
        };

        var tpl = '<ul>'+
            '{{#this["new-book"] item key aaa}}'+
              '<li>{{key}}:{{item}}</li>'+
            '{{/}}'+
        '</ul>';

        var result = '<ul><li>author:tim</li><li>price:$9.00</li></ul>';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });


    it('if true', function(){
        var data = {
            foo: true
        };
        var tpl = '{{#this.foo}}foo{{/}}';
        var result = 'foo';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('if 1==true', function(){
        var data = {
            foo: 1
        };
        var tpl = '{{#this.foo}}foo{{/}}';
        var result = 'foo';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('if "foo"==true', function(){
        var data = {
            foo: 'foo'
        };
        var tpl = '{{#this.foo}}foo{{/}}';
        var result = 'foo';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('if ""==true', function(){
        var data = {
            foo: ''
        };
        var tpl = '{{#this.foo}}foo{{/}}';
        var result = '';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('if null==true', function(){
        var data = {
            foo: null
        };
        var tpl = '{{#this.foo}}foo{{/}}';
        var result = '';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('if undefined==true', function(){
        var data = {
            foo: undefined
        };
        var tpl = '{{#this.foo}}foo{{/}}';
        var result = '';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('if undefined==true', function(){
        var data = {};
        var tpl = '{{#this.foo}}foo{{/}}';
        var result = '';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('if false', function(){
        var data = {
            foo: false
        };
        var tpl = '{{#this.foo}}foo{{/}}';
        var result = '';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('if ===value', function(){
        var data = {
            foo: 'show'
        };
        var tpl = '{{#this.foo === "show"}}foo{{/}}';
        var result = 'foo';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('if !==value', function(){
        var data = {
            foo: 'show'
        };
        var tpl = '{{#this.foo !== "show"}}{{/}}';
        var result = '';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
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
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
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
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('comments', function(){
        var data = {
            foo: 'foo'
        };
        var tpl = '{{this.foo}}{{!ignore}}';
        var result = 'foo';
        // console.log(ec(tpl).source);
        expect(ec(tpl).render(data)).to.be(result);
    });

    it('', function(){});


});

