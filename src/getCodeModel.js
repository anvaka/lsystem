const grammar = require('../src/grammar/grammar')
const nearley = require('nearley');

// Create a Parser object from our grammar.
let standardCollection = [
`// dragon curve
axiom: FX
rules: 
 X => X+YF+
 Y => -FX-Y

maxDepth: 10
angle: 90`,

`// Hexagonal Gosper
axiom: XF
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

maxDepth: 4
angle: 90
`,
`// Tree
axiom: X
rules: 
 F => FF
 X => F-[[X]+X]+F[+FX]-X

angle: 22.5`,
  ]

export default function getCodeModel(scene) {
  let model = {
    setCode,
    error: null,
    randomize,
    code: getInitialCode(),
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
// maxDepth: 5 
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

maxDepth: 5
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