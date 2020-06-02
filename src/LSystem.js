import Turtle from './Turtle';
import tinycolor from 'tinycolor2';

// We don't want to crash the browser. If the expanded system is larger than this
// we will stop iteration
const LIMIT = 1000000;

export default class LSystem {
  constructor(scene, systemSettings) {
    coerceTypes(systemSettings);
    this.rules = systemSettings.rules;
    this.actions = compileActions(systemSettings, this);
    this.turtle = new Turtle(scene, systemSettings);
    this.stepsPerFrame = systemSettings.stepsPerFrame || 42;
    this.drawQueue = [];
    this.lastDrawnIndex = -1;

    const depth = Number.isFinite(systemSettings.depth) ? systemSettings.depth : 5;
    let start = systemSettings.start;
    if (start === undefined) start = Object.keys(this.rules)[0];
    if (start === undefined) throw new Error('System does not have neither rewrite rules nor start state');
    this.start = start;
    this.depth = depth;
    this.simulate(); // TODO: Might exhaust system resources
    this.iterator = this.renderIterator();
  }

  dispose() {
    this.turtle.dispose();
  }

  frame() {
    let next, steps = 0;
    do {
      next = this.iterator.next();
    } while (!next.done && steps++ < this.stepsPerFrame );
    return !next.done;
  }

  simulate() {
    let production = this.start;
    let index = 0;
    while (index < this.depth && production.length < LIMIT) {
      production = this.iterateRules(production);
      index += 1;
    }

    this.production = production;
    this.complete = production.length < LIMIT;
  }

  iterateRules(rule) {
    let result = [];
    for (let op of rule) {
      let rewriteRule = this.rules[op];
      if (rewriteRule !== undefined) result.push(rewriteRule);
      else result.push(op);
    }
    return result.join('');
  }

  *renderIterator() {
    for (let op of this.production) {
      if (this.actions[op]) {
        if (this.stepsPerFrame < 0) {
          yield* this.actions[op]();
        } else {
          yield this.actions[op]();
        }
      }
    }
  }
}

function compileActions(systemSettings, lSystem) {
  let actions = {};

  let defaultRotationAngle = Number.isFinite(systemSettings.angle) ? systemSettings.angle : 60; 

  let mergedActions = {
    'F': {name: 'draw', args: []},
    'f': {name: 'move', args: []},
    '+': {name: 'rotate', args: [defaultRotationAngle]},
    '-': {name: 'rotate', args: [-defaultRotationAngle]},
    '[': {name: 'push', args: []},
    ']': {name: 'pop', args: []},
    ...systemSettings.actions
  }

  Object.keys(mergedActions).forEach(key => {
    let value = mergedActions[key];
    let turtleAction = turtleCanDo(value, lSystem);
    if (turtleAction) {
      actions[key] = turtleAction;
    } else {
      throw new Error("Turtle does not know how to do '" + value + "'");
    }
  });

  return actions;
}

function turtleCanDo(command, lSystem) {
  if (command.name.indexOf('rotate') === 0) {
    let angle = command.args[0]
    if (!Number.isFinite(angle)) throw new Error('`rotate() needs one float argument');

    switch (command.name) {
      case 'rotateX': return function() { lSystem.turtle.rotateX(angle) };
      case 'rotateY': return function() { lSystem.turtle.rotateY(angle) };
    }

    return function() { lSystem.turtle.rotateZ(angle) };
  }

  if (command.name === 'draw') {
    let length = getLength(command.args[0], 'draw');
    return function() {
      lSystem.turtle.draw(length)
    }
  }

  if (command.name === 'push') return function() {lSystem.turtle.push()}
  if (command.name === 'pop') return function() {lSystem.turtle.pop()}
  if (command.name === 'move') {
    let length = getLength(command.args[0], 'move');
    return function() {lSystem.turtle.move(length)}
  }
}


function getLength(value, name) {
  let length = 10;
  if (value !== undefined) {
    length = value;
    if (!Number.isFinite(length)) throw new Error(name  +'(l) expects `l` to be a float number. Got: ' + value);
  }
  return length;
}


function coerceTypes(system) {
  if (system.angle !== undefined) system.angle = Number.parseFloat(system.angle);
  if (system.width !== undefined) system.width = Number.parseFloat(system.width);
  if (system.depth !== undefined) system.depth = Number.parseFloat(system.depth);
  if (system.color !== undefined) {
    let rgba = tinycolor(system.color).toRgb();
    system.color = (rgba.r << 24) | (rgba.g << 16) | (rgba.b << 8) | (rgba.a * 255 | 0)
  } 
}