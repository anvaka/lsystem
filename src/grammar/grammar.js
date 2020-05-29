// Generated automatically by nearley, version 2.19.3
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Main", "symbols": ["Block"]},
    {"name": "Block$ebnf$1", "symbols": []},
    {"name": "Block$ebnf$1$subexpression$1", "symbols": ["EmptyLine"]},
    {"name": "Block$ebnf$1$subexpression$1", "symbols": ["StringKeyValue"]},
    {"name": "Block$ebnf$1$subexpression$1", "symbols": ["Axiom"]},
    {"name": "Block$ebnf$1$subexpression$1", "symbols": ["RuleList"]},
    {"name": "Block$ebnf$1$subexpression$1", "symbols": ["ActionList"]},
    {"name": "Block$ebnf$1$subexpression$1", "symbols": ["Comment"]},
    {"name": "Block$ebnf$1", "symbols": ["Block$ebnf$1", "Block$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Block", "symbols": ["Block$ebnf$1"], "postprocess":  d => {
          d = d[0];
          d = d.filter(x => x)
            .map(x => x.filter(x => x))
              .filter(x => x.length)
              .flat()
              .reduce((c, i) => Object.assign(c, i), {})
          
          return d;
        } 
        },
    {"name": "StringKeyValue", "symbols": ["Name", "Separator", "StringValue"], "postprocess": d => ({[d[0].toLocaleLowerCase()]: d[2]})},
    {"name": "Axiom$subexpression$1$subexpression$1", "symbols": [/[aA]/, /[xX]/, /[iI]/, /[oO]/, /[mM]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "Axiom$subexpression$1", "symbols": ["Axiom$subexpression$1$subexpression$1"]},
    {"name": "Axiom$subexpression$1$string$1", "symbols": [{"literal":"s"}, {"literal":"t"}, {"literal":"a"}, {"literal":"r"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Axiom$subexpression$1", "symbols": ["Axiom$subexpression$1$string$1"]},
    {"name": "Axiom", "symbols": ["Axiom$subexpression$1", "Separator", "Rule"], "postprocess": 
        d => ({start: d[2]})
        },
    {"name": "RuleList$subexpression$1$subexpression$1", "symbols": [/[rR]/, /[uU]/, /[lL]/, /[eE]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "RuleList$subexpression$1", "symbols": ["RuleList$subexpression$1$subexpression$1"]},
    {"name": "RuleList$subexpression$1$subexpression$2", "symbols": [/[pP]/, /[rR]/, /[oO]/, /[dD]/, /[uU]/, /[cC]/, /[tT]/, /[iI]/, /[oO]/, /[nN]/, {"literal":" "}, /[rR]/, /[uU]/, /[lL]/, /[eE]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "RuleList$subexpression$1", "symbols": ["RuleList$subexpression$1$subexpression$2"]},
    {"name": "RuleList$ebnf$1", "symbols": ["RuleItem"]},
    {"name": "RuleList$ebnf$1", "symbols": ["RuleList$ebnf$1", "RuleItem"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "RuleList", "symbols": ["RuleList$subexpression$1", "Separator", "RuleList$ebnf$1"], "postprocess": 
        d => {
          d = d.filter(x => x);
          let rules = d[1].reduce((c, i) => Object.assign(c, i), {}); 
          return {rules};
        } 
        },
    {"name": "RuleItem", "symbols": ["RuleChar", "Separator", "Rule"], "postprocess": d => ({[d[0]]: d[2]})},
    {"name": "RuleItem", "symbols": [/[\n]/, "_", "RuleItem"], "postprocess": d => d[2]},
    {"name": "Rule$ebnf$1$subexpression$1", "symbols": ["RuleChar"]},
    {"name": "Rule$ebnf$1$subexpression$1", "symbols": ["RuleChar", "__"]},
    {"name": "Rule$ebnf$1", "symbols": ["Rule$ebnf$1$subexpression$1"]},
    {"name": "Rule$ebnf$1$subexpression$2", "symbols": ["RuleChar"]},
    {"name": "Rule$ebnf$1$subexpression$2", "symbols": ["RuleChar", "__"]},
    {"name": "Rule$ebnf$1", "symbols": ["Rule$ebnf$1", "Rule$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Rule", "symbols": ["Rule$ebnf$1"], "postprocess":  d => {
          d = d[0].map(x => x.filter(x => x));
          return d.flat().join('')
        }},
    {"name": "RuleChar", "symbols": [/[0-9a-zA-Z+_^?~|&*%\][-]/], "postprocess": id},
    {"name": "ActionList$subexpression$1", "symbols": [/[aA]/, /[cC]/, /[tT]/, /[iI]/, /[oO]/, /[nN]/, /[sS]/], "postprocess": function(d) {return d.join(""); }},
    {"name": "ActionList$ebnf$1", "symbols": ["ActionItem"]},
    {"name": "ActionList$ebnf$1", "symbols": ["ActionList$ebnf$1", "ActionItem"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ActionList", "symbols": ["ActionList$subexpression$1", "Separator", "ActionList$ebnf$1"], "postprocess":  d => {
          d = d.filter(x => x);
          return {actions: d[1].reduce((c, i) => Object.assign(c, i), {})};
        }},
    {"name": "ActionItem", "symbols": ["RuleChar", "Separator", "Action"], "postprocess": d => ({[d[0]]: d[2]})},
    {"name": "ActionItem", "symbols": [/[\n]/, "_", "ActionItem"], "postprocess": d => d[2]},
    {"name": "Action", "symbols": ["Name", "_", {"literal":"("}, "_", "ArgList", "_", {"literal":")"}], "postprocess":  d => {
          d = d.filter(x => x);
          return { name: d[0], args: d[2] }
        }},
    {"name": "Action", "symbols": ["Name", "_", {"literal":"("}, "_", {"literal":")"}], "postprocess":  d => {
          d = d.filter(x => x);
          return { name: d[0], args: [] }
        }},
    {"name": "Name", "symbols": ["_name"], "postprocess": id},
    {"name": "_name", "symbols": [/[a-zA-Z_]/], "postprocess": id},
    {"name": "_name", "symbols": ["_name", /[\w_]/], "postprocess":  function(d) {
          return d[0] + d[1];
        } },
    {"name": "ArgList", "symbols": ["Value"], "postprocess": d => [d[0]]},
    {"name": "ArgList", "symbols": ["ArgList", "_", {"literal":","}, "_", "Value"]},
    {"name": "KeyValue", "symbols": ["Name", "Separator", "Value"], "postprocess": d => ({[d[0].toLocaleLowerCase()]: d[2]})},
    {"name": "StringValue$ebnf$1", "symbols": [/[^\n]/]},
    {"name": "StringValue$ebnf$1", "symbols": ["StringValue$ebnf$1", /[^\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "StringValue", "symbols": ["StringValue$ebnf$1"], "postprocess": d => d[0].join('').trim()},
    {"name": "Value", "symbols": ["float"], "postprocess": id},
    {"name": "float", "symbols": ["sign", "int", {"literal":"."}, "int"], "postprocess": d => parseFloat(d[0] + d[1] + d[2]+d[3])},
    {"name": "float", "symbols": ["sign", "int"], "postprocess": d => parseInt(d[0] + d[1], 10)},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": d => d[0].join("")},
    {"name": "sign$ebnf$1", "symbols": []},
    {"name": "sign$ebnf$1", "symbols": ["sign$ebnf$1", /[+-]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sign", "symbols": ["sign$ebnf$1"], "postprocess":  d => {
          return d.length ? d[0] : '';
        }
          },
    {"name": "Separator$subexpression$1", "symbols": [{"literal":":"}]},
    {"name": "Separator$subexpression$1$string$1", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Separator$subexpression$1", "symbols": ["Separator$subexpression$1$string$1"]},
    {"name": "Separator$subexpression$1$string$2", "symbols": [{"literal":"="}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Separator$subexpression$1", "symbols": ["Separator$subexpression$1$string$2"]},
    {"name": "Separator$subexpression$1", "symbols": [{"literal":"="}]},
    {"name": "Separator$subexpression$1", "symbols": [{"literal":"→"}]},
    {"name": "Separator", "symbols": ["_", "Separator$subexpression$1", "_"], "postprocess": () => null},
    {"name": "EmptyLine", "symbols": ["_", /[\n]/], "postprocess": () => null},
    {"name": "Comment$subexpression$1$string$1", "symbols": [{"literal":"/"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Comment$subexpression$1", "symbols": ["Comment$subexpression$1$string$1"]},
    {"name": "Comment$ebnf$1", "symbols": []},
    {"name": "Comment$ebnf$1", "symbols": ["Comment$ebnf$1", /[^\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "Comment", "symbols": ["_", "Comment$subexpression$1", "Comment$ebnf$1"], "postprocess": () => null},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[  \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null},
    {"name": "__$ebnf$1", "symbols": [/[ \t]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": () => null}
]
  , ParserStart: "Main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
