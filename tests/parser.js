let test = require('tap').test;

test('it can parse', (t) => {
  let config = parseString(`
Alphabet: F, G, X
Constants: F, G, +, −
Axiom: F--XF--F--XF
Production rules:
X → XF+G+XF--F--XF+G+X
Angle: 45`);

  t.equals(config.start, 'F--XF--F--XF');
  t.equals(config.rewrite.length, 1);
  t.equals(config.rewrite[0].X, 'XF+G+XF--F--XF+G+X');
  t.end();
})

function parseString(str) {
  return {};

}