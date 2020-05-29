Main -> Block

Block ->  (EmptyLine
  | StringKeyValue
  | Axiom
  | RuleList 
  | ActionList
  | Comment
  ):* {% d => {
  d = d[0];
  d = d.filter(x => x)
    .map(x => x.filter(x => x))
      .filter(x => x.length)
      .flat()
      .reduce((c, i) => Object.assign(c, i), {})
  
  return d;
} 
%}

StringKeyValue -> Name Separator StringValue  {% d => ({[d[0].toLocaleLowerCase()]: d[2]}) %}

Axiom -> ("axiom"i | "start") Separator Rule {%
  d => ({start: d[2]})
%}

RuleList -> ("rules"i | "production rules"i) Separator RuleItem:+ {%
 d => {
   d = d.filter(x => x);
   let rules = d[1].reduce((c, i) => Object.assign(c, i), {}); 
   return {rules};
 } 
%}

RuleItem -> RuleChar Separator Rule {% d => ({[d[0]]: d[2]}) %}
  | [\n] _ RuleItem {% d => d[2] %} 


Rule -> (RuleChar | RuleChar __ ):+  {% d => {
  d = d[0].map(x => x.filter(x => x));
  return d.flat().join('')
}%}

RuleChar -> [0-9a-zA-Z+_^?~|&*%\][-] {% id %}

ActionList -> "actions"i Separator ActionItem:+ {% d => {
  d = d.filter(x => x);
  return {actions: d[1].reduce((c, i) => Object.assign(c, i), {})};
}%}

ActionItem -> RuleChar Separator Action {% d => ({[d[0]]: d[2]}) %}
  | [\n] _ ActionItem {% d => d[2] %}
  
Action -> Name _ "(" _ ArgList _ ")" {% d => {
  d = d.filter(x => x);
  return { name: d[0], args: d[2] }
}%}
  | Name _ "(" _ ")" {% d => {
  d = d.filter(x => x);
  return { name: d[0], args: [] }
}%}

Name -> _name {% id %} 
 
_name -> [a-zA-Z_] {% id %}
  | _name [\w_] {% function(d) {
  return d[0] + d[1];
} %}
 
ArgList -> Value {% d => [d[0]] %}
  | ArgList _ "," _ Value

KeyValue -> Name Separator Value {% d => ({[d[0].toLocaleLowerCase()]: d[2]}) %}

StringValue -> [^\n]:+ {% d => d[0].join('').trim() %}

Value -> float {% id %}
  
float ->
      sign int "." int   {% d => parseFloat(d[0] + d[1] + d[2]+d[3]) %}
    | sign int           {% d => parseInt(d[0] + d[1], 10) %}

int -> [0-9]:+      {% d => d[0].join("") %}

sign -> [+-]:* {% d => {
  return d.length ? d[0] : '';
}
  %}
 
Separator -> _ (":" | "->" | "=>" | "=" | "→") _ {% () => null %}
EmptyLine -> _ [\n] {% () => null %}
Comment -> _ ("//") [^\n]:* {% () => null %}

_ -> [  \t]:* {% () => null %}
__ -> [ \t]:+ {% () => null %}