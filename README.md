# L-System

This website allows you to edit [L-System](https://en.wikipedia.org/wiki/L-system) and immediately see results online:

![demo](https://i.imgur.com/z8YW0YK.png)

https://anvaka.github.io/lsystem

## High level details

The rendering is done with WebGL use can explore generated system similar to a map (with pan-zoom interaction).

To change camera angle hold `Option` (or `Alt`) key and drag with mouse, or slide two fingers up/down.

You can click `Randomize` button to generate a well-known L-System and tweak it. While `randomize`
functionality provides basic L-Systems, I'd love to find a better way to introduce variety here. Please let
me know if you have suggestions how to improve random L-System generation logic, so that it produces appealing
results.

## Syntax/L-Systems details

L-Systems are described very well on [Paul Bourke's](http://paulbourke.net/fractals/lsys/) website.

### Sections in the editor

Each section can be entered in the text editor, followed by a semicolon. For example:

```
axiom: X
rules:
  X => F+F
```

Here we entered two sections: `axiom` and `rules`. The list of available sections, along with their
meanings is below:

* `axiom` - initial state of the system
* `rules` - list of rewrite rules that are applied on each iteration
* `depth` - how deep we are allowed to go recursively
* `angle` - if specified, this argument governs rotation angle. Can be overridden with actions
* `actions` - list of graphic commands that are triggered by a matching character in the evolved system.
* `width` - width in pixels of the drawn line
* `color` - color of the line. Accepts names and hex. E.g. `blue`, works the same as `#0000ff`
* `stepsPerFrame` - how many steps we are allowed to render per single frame. If set to -1 the scene is rendered immediately. This could be dangerous on deep systems, as the entire system traversal may exhaust the browser's resources.
* `direction` - three numbers separated by coma `x, y, z` that set initial direction
* `position` three numbers separated by coma `x, y, z` that set initial position

### Actions

Actions are associated with each symbol in the `rules` section. When processor finds matching action
it executes it.

For example, let's say we have the following system:

```
axiom: X
rules:
  X => F+FX

depth: 4
actions:
  F => draw(10)
  + => rotate(90)
```

Once the system is unwrapped, we get the following string: 

```
F+FF+FF+FF+F
```

Each `F` has an associated action `draw(10)` which means "draw 10 units in current direction".
Each `+` has an associated action `rotate(90)` which means "rotate 90 degrees".

Can you guess what `F+FF+FF+FF+F` will render? To see the final result, [click here](https://anvaka.github.io/lsystem/?code=axiom%3A%20X%0Arules%3A%0A%20%20X%20%3D%3E%20F%2BFX%0A%0Adepth%3A%204%0Aactions%3A%0A%20%20F%20%3D%3E%20draw%2810%29%0A%20%20%2B%20%3D%3E%20rotate%2890%29)

Here is the list of all available actions:

`draw(x)` draw `x` units in current direction
`move(x)` move `x` units in current direction without drawing
`rotate(deg)` rotate current direction `deg` degrees around `Z` axis
`rotateX(deg)` rotate current direction `deg` degrees around `X` axis
`rotateY(deg)` rotate current direction `deg` degrees around `Y` axis
`push()` saves current render state onto stack
`pop()` restores previously saved render state

By default the following actions are added automatically:
actions:

```
  F => draw(10)
  f => move(10)
  + => rotate(60)
  - => rotate(-60)
  [ => push()
  ] => pop()
```


## Local development

```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

# License

[MIT](https://github.com/anvaka/lsystem/blob/master/LICENSE.md)