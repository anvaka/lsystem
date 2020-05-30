const grammar = require('../src/grammar/grammar')
const nearley = require('nearley');
const queryState = require('query-state');

var qs = queryState({
  code: getInitialCode()
}, {
  useSearch: true
});

// Create a Parser object from our grammar.
let standardCollection = [
`// dragon curve
axiom: X
rules: 
 X => X+YF+
 Y => -FX-Y

depth: 10
angle: 90`,

`// Hexagonal Gosper
axiom: X
rules:
 X => X+YF++YF-FX--FXFX-YF+
 Y => -FX+YFYF++YF+FX--FX-Y 
angle: 60`,

`// Peano curve
axiom: X
rules: 
 X => XFYFX-F-YFXFY+F+XFYFX
 Y => YFXFY+F+XFYFX-F-YFXFY
angle: 90`,
`// Square Sierpinski
axiom: F+XF+F+XF
rules: 
 X => XF-F+F-XF+F+XF-F+F-X

depth: 4
angle: 90
`,
`// Tree
axiom: X
rules: 
 F => FF
 X => F-[[X]+X]+F[+FX]-X

angle: 22.5`,
`// Hilbert curve
axiom: X
rules: 
 X => -YF+XFX+FY-
 Y => +XF-YFY-FX+

angle: 90`,
`// blocks
axiom: F+F+F+F
rules: 
 F => F-f+FF-FF-FF-FFf-FFFF
 f => ffffff

angle: 90
depth: 3 `,
`
// 3 Blocks
axiom: F^^F^^F
rules: 
 F => F-fff^F^^F^^F&&fff-FFF
 f => fff

depth: 3
actions:
 + => rotate(90)
 - => rotate(-90)
 ^ => rotate(60)
 & => rotate(-60)
`
  ]

export default function getCodeModel(scene) {
  let model = {
    setCode,
    error: null,
    randomize,
    code: qs.get('code')
  }

  setCode(model.code);

  return model;

  function randomize() {
//     let sys = getRandomSystem(6 + Math.round(Math.random() * 10))
//     let code = `axiom: XY
// rules: 
//  X => ${sys.X}
//  Y => ${sys.Y}

// angle: ${sys.angle} 
// depth: 5 
// stepsPerFrame: -1`
    
    let code = pickRandom(standardCollection);
    setCode(code);
    model.ignoreNextUpdate = true;
    model.code = code;
  }

  function setCode(newCode) {
    newCode = newCode.trim();
    if (!newCode) {
      model.error = 'Enter a system description above'
      return;
    }
    try {
      let system = getParsedSystem(newCode);
      if (system) {
        // TODO: I messed up with grammar, and seems like string value takes precedence over
        // axiom clause. A little hack here to put them back on the same page until better fix:
        if (system.axiom) system.start = system.axiom;
        scene.setSystem(system);
        model.error = null;
        qs.set('code', newCode);
      } else {
        model.error = 'Could not parse the input string';
      }
    } catch (e) {
      model.error = e.message;
    }
  }
}

function getParsedSystem(newCode) {
  try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(newCode);
    let parserResults = parser.finish()[0];
    return parserResults && parserResults[0]
  } catch (e) {
    let lines = e.message.split('\n')
    let head = lines.slice(0, 4).join('\n')
    let err = new Error(head)
    err.details = lines.slice(1)
    throw err;
  }
}

function getInitialCode() {
  // todo: query state?
  return `axiom: X
rules: 
  X => -YF+XFX+FY-
  Y => +XF-YFY-FX+

depth: 5
stepsPerFrame: 10
width: 2
color: #FFFFFF

actions:
  - => rotate(-90)
  + => rotate(90)
  F => draw()
`
}


function getRandomSystem(length) {
  let states = 'FXY';
  let res = [];
  let lastCh = '';
  while (res.length < length) {
    let ch = pickChar();
    if (ch === '+' && lastCh === '-') ch = '-'
    else if (ch === '-' && lastCh === '+') ch = '+';
    else if (ch === 'F' && lastCh === 'F') ch = Math.random() < 0.5 ? 'X': 'Y';
    res.push(ch);
    lastCh = ch;
  }

  for (let ch of 'FXY') {
    if (res.indexOf(ch) < 0) {
      res[Math.floor(Math.random() * res.length)] = ch;
    }
  }

  let X = res.join('');
  let Y = res.reverse().map( x => {
    if (x === '+') return '-';
    if (x === '-') return '+';
    if (x === 'Y') return 'X';
    if (x === 'X') return 'Y';
    return x;
  } ).join('')

  let angle = Math.random() < 0.5 ? 60 : 90;
  if (angle === 90 && ( X.match(/(\+\+|\+-|--)/) || Y.match(/(\+\+|\+-|--)/))) angle = 45;
  return {X, Y, angle}

  function pickChar() {
    let r = Math.random();
    if (r < 0.78) {
      r = Math.random();
      return states[Math.floor(states.length * r)]
    } else {
      return r < 0.89 ? '+' : '-'
    }
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}