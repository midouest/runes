/*! For license information please see 7135.44d88f8f.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunk_runes_web=self.webpackChunk_runes_web||[]).push([[7135],{7135:function(e,n,s){s.r(n),s.d(n,{conf:function(){return t},language:function(){return o}});var t={comments:{lineComment:"#"},brackets:[["{","}"],["[","]"],["(",")"]],autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}],surroundingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}]},o={defaultToken:"",tokenPostfix:".ini",escapes:/\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,tokenizer:{root:[[/^\[[^\]]*\]/,"metatag"],[/(^\w+)(\s*)(\=)/,["key","","delimiter"]],{include:"@whitespace"},[/\d+/,"number"],[/"([^"\\]|\\.)*$/,"string.invalid"],[/'([^'\\]|\\.)*$/,"string.invalid"],[/"/,"string",'@string."'],[/'/,"string","@string.'"]],whitespace:[[/[ \t\r\n]+/,""],[/^\s*[#;].*$/,"comment"]],string:[[/[^\\"']+/,"string"],[/@escapes/,"string.escape"],[/\\./,"string.escape.invalid"],[/["']/,{cases:{"$#==$S2":{token:"string",next:"@pop"},"@default":"string"}}]]}}}}]);
//# sourceMappingURL=7135.44d88f8f.chunk.js.map