import parseExpression from './grammar/parser';
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

`// William McWorters Terdragon
axiom: F
rules: 
 F => F+F-F

depth: 8
angle: 120`,

`// William McWorters Pentl
axiom: F-F-F-F-F
rules: 
  F => cF-F-F++dF+F-F 

depth: 4
angle: 72
actions:
  c => setColor("mediumpurple")
  d => setColor("violet") `,

`// William McWorters Pentant
axiom: X-X-X-X-X
rules: 
  F => 
  X => dFX-FX-FX+FY+FY+FX-FX
  Y => cFY+FY-FX-FX-FY+FY+FY

depth: 3
angle: 72
actions:
  c => setColor("goldenrod")
  d => setColor("gold") `,

`// William McWorter Sierπnski Carpet 
axiom: F
rules: 
 F => cF+F-F-F-f+dF+F+F-F
 f => fff

angle: 90
depth: 4
actions:
  c => setColor("goldenrod")
  d => setColor("gold") `,

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

depth:4
angle: 90`,

`// Gary Teachout Pean-c
axiom: FX
rules:
 F => 
 X =>  FX-FY-FX+FY+FX+FY+FX+FY+FX-FY-FX-FY-FX-FY-FX+FY+FX
 Y => FY

depth: 3
angle: 45`,

`// Square Sierpinski
axiom: F+XF+F+XF
rules: 
 X => XF-F+F-XF+F+XF-F+F-X

depth: 4
angle: 90 `,

`// Tree
axiom: X
rules: 
 F => FF
 X => F-[[X]+X]+F[+FX]-X

direction: [0, 1, 0]
angle: 22.5`,
`// Tree with color
axiom: X
rules: 
 F => FF
 X => F-[[X]+X]+cF[+dFX]-X

color:brown
direction: [0, 1, 0]
angle: 22.5a
actions:
  c => setColor('green')
  d => setColor('lightgreen')`,

`// Bush, after P. Bourke
axiom: Y
rules: 
  X => X[-FFF]c[+FFF]FX
  Y => dYFXe[+Y][-Y]

color: brown
direction: [0, 1, 0]
angle: 22.5
actions:
  c => setColor('green')
  d => setColor('lime')
  e => setColor('brown')`,

`// Bush, P. Bourke
axiom: F
rules: 
  F => FF+[c+F-F-F]-[-F+F+dF]

color: green
direction: [0, 1, 0]
angle: 21
depth:4
actions:
  c => setColor('green')
  d => setColor('lime')`,

`// P. Bourkes Pentaplexy
axiom: F++F++F++F++F
rules: 
  F => cF++F++F+++++dF-F++F

depth:4
angle: 36
actions:
  c => setColor('mediumpurple')
  d => setColor('violet')`,

`// poetasters shrub
axiom: F
rules: 
 F => Fe[+cFF]Fd[-FF]cF

color:brown
direction: [0, 1, 0]
angle: 322
depth: 4
actions:
  c => setColor('green')
  d => setColor('lightgreen')
  e => setColor('brown')`,

`// poetasters weed, after, P. Bourke
axiom: F
rules:
  F -> F-[XY]+[XY]F+[XY]-[XY]
  X -> +dFY
  Y -> -cFX

color: brown
direction: [0, 1, 0.5]
angle: 22.5
depth:5
actions:
  c => setColor('green')
  d => setColor('lime')`,

`// Unlikely bush (after Bourke)
axiom: F
rules: 
  F => eF[+cFF][-FF]cF[-F]d[+F]F

color: brown
direction: [0, 1, 0]
angle: 330
depth:4
actions:
  c => setColor('green')
  d => setColor('lime')
  e => setColor('brown')`,

`// Weed, P. Bourke
axiom: F
rules:
  F -> FF-[XY]+[XY]
  X -> +cFY
  Y -> -dFX

color: brown
direction: [0, 1, 1]
angle: 22.5
actions:
  c => setColor('green')
  d => setColor('lime')`,

`// P. Bourke after Saupe
axiom: VZFFF
rules:
  V -> [+++W][---W]YV
  W -> +X[-W]Z
  X -> -W[+X]Z
  Y -> YZ
  Z -> [-FcFF][+FdFF]F

color: brown
depth:8
direction: [0, 1, 0]
angle: 20
actions:
  c => setColor('green')
  d => setColor('lime')`,

`// poetaster's curly, inspired by  McWorter
axiom: F+F-F+F
rules: 
  F => eF-F-F++[cF+F-dF[GGG]][GGG]
  G => c--g--g--g--g--g--g--g

depth: 2
angle: 27
width:2
direction: [0,0.1,0.1]
actions:
  c => setColor("palegreen")
  d => setColor("violet") 
  e => setColor("green")
  g => draw(2)`,

`// aquatic plant
axiom: F
rules:
  F -> FFc[-F++F]d[+F--F]e++F--F

color: brown
direction: [0, 1, 0.5]
angle: 27
depth:4
actions:
  c => setColor('green')
  d => setColor('lime')
  e => setColor('goldenrod')`,

`// another aquatic 
axiom: F
rules:
  F => FMNOMBxPNMyO
  M => e[-F++F++]
  N => d[+F--F--]
  O => c++F--F
  P => d--F++F

color: brown
direction: [0, 1, 0.5]
angle: 27
depth:5
actions:
  c => setColor('green')
  d => setColor('lime')
  e => setColor('goldenrod')
  x => rotatex(2)
  y => rotatey(-3)`,

`// poetasters third aquatic
axiom: F
rules:
  F -> FMNxQRyQR[O-O-O-O-0]
  M => d[++FF+FF+]
  N => d[--FF-FF-]
  O => e[F-F-F++dF+F-F]
  Q => c++F--F
  R => c--F++F

color: brown
direction: [0, 1, 0.5]
angle: 17
depth:4
actions:
  c => setcolor('green')
  d => setcolor('lime')
  e => setcolor('goldenrod')
  x => rotatex(2)
  y => rotatey(-1.5)`,

`// poetasters sallow thorn
axiom: F
rules:
  F -> FMNxQRyQROP
  M => d[++FF+FF+]
  N => d[--FF-FF-]
  O => e[-F++F++]
  P => e[+F--F--]
  Q => c++F--F
  R => c--F++F

color: brown
direction: [0, 1, 0.5]
angle: 17
depth:5
actions:
  c => setColor('green')
  d => setColor('lime')
  e => setColor('goldenrod')
  x => rotatex(2)
  y => rotatey(-1.5)`,

`// Pean-c flower after Gary Teachout
axiom: FXhFXiFX
rules:
 F => 
 X =>  [FX-FY][-cFX-FY-FX][ZZ]-dFY-FX+FY+FX
 Y => FY
 Z => -cFX-FY-FX

color: green
depth: 3
angle: 340
width: 2
direction: [1,1,1]
actions:
  c => setColor("violet")
  d => setColor("lime")
  h => rotate(5)
  i => rotate(-3)`,

`// poetasters succulent 1
axiom: A
rules:
 A =>[FL]gAhg[FLA]
 F => cSF 
 S => dFL
 L => c[F+F+F]fe[F-F-F]

color:green
direction: [0, 1, 0.5]
width: 4
angle: 17
depth: 7
actions:
  c => setColor('green')
  d => setColor('lime')
  e => setColor('lightgreen')
  g => rotate(4.5)
  h => rotate(-3)`,

`// Pyramids, Anthony Hanmer ADH258a 
axiom: F++F++F+++F--F--F
rules: 
  F =>  cFF++F++F++dFFF

color: gold
angle: 60
depth:3
actions:
  c => setColor('gold')
  d => setColor('goldenrod')`,

`// Hilbert curve
axiom: X
rules: 
 X => -YF+XFX+FY-
 Y => +XF-YFY-FX+

angle: 90`,

`// Levey Curve
axiom: F++F++F++F
rules: 
  F => -dF++cF-
angle: 45
depth: 12
actions:
  c => setColor("goldenrod")
  d => setColor("gold")`,

`// blocks
axiom: F+F+F+F
rules: 
 F => F-f+FF-FF-FF-FFf-FFFF
 f => ffffff

angle: 90
depth: 3 `,

`// aztec blocks
axiom: F-F-F-F
rules: 
 F => F-cf+FF-F-FF-Ff-FF+df-FF+F+FF+Ff+FFF
 f => ffffff

angle: 90
depth: 2
actions:
  c => setColor("goldenrod")
  d => setColor("gold")`,

`// Color Mosaic
axiom: F+F+F+F
rules: 
  F => dFF+F+cF+F+FF

color: green
depth: 3
angle: 90
actions:
  c => setColor('lime')
  d => setColor('green')`,

`// 3 Blocks
axiom: F^^F^^F
rules: 
 F => F-fff^F^^F^^F&&fff-FFF
 f => fff

depth: 3
actions:
 - => rotate(-90)
 ^ => rotate(60)
 & => rotate(-60) `,
`// Leaf
axiom: Y---Y
rules: 
 X => F-FF-F--[--X]F-FF-F--F-FF-F--
 Y => f-F+X+F-fY

depth: 8
angle: 60`, `// esum
axiom: X+X+X+X+X+X+X+X
rules: 
 X => [F[-X++Y]]
 Y => [F[-Y--X]]
 F => F

depth: 6
angle: -45`,
`// Penrose tiling
axiom: [N]++[N]++[N]++[N]++[N]
rules: 
  M => OF++PF----NF[-OF----MF]++
  N => +OF--PF[---MF--NF]+
  O => -MF++NF[+++OF++PF]-
  P => --OF++++MF[+PF++++NF]--NF
  F => 

depth: 4
angle: 36
`
  ]

export default function getCodeModel(scene) {
  let model = {
    setCode,
    error: null,
    randomize,
    code: qs.get('code')
  }
  let lastPickedIndex = -1;

  setCode(model.code);

  return model;

  function randomize() {
    let index;
    do { index = pickRandomIndex(standardCollection) } while (index === lastPickedIndex);
    lastPickedIndex = index;
    let code = standardCollection[lastPickedIndex];
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
      let system = parseExpression(newCode);
      if (system) {
        // TODO: I messed up with grammar, and seems like string value takes precedence over
        // axiom clause. A little hack here to put them back on the same page until better fix:
        if (system.axiom) system.start = system.axiom;
        scene.setSystem(system);
        if (scene.isComplete()) {
          model.error = null;
        } else {
          model.error = 'The system limit reached.\nRendering first 1,000,000 characters'
        }
        qs.set('code', newCode);
      } else {
        model.error = 'Could not parse the input string';
      }
    } catch (e) {
      model.error = e.message;
    }
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

function pickRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}
