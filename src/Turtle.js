import LineCollection from './LineCollection';
import tinycolor from 'tinycolor2';

export default class Turtle {
  constructor(scene, options = {}) {
    this.position = options.position || [0, 0, 0];
    checkArray('position', this.position);
    this.direction = options.direction || [1, 0, 0];
    normalize(this.direction);
    checkArray('direction', this.direction);

    this.lines = new LineCollection(scene.getGL(), { capacity: 1024, width: options.width || 2 });
    this.scene = scene;
    this.color = options.color || 0xFFFFFFFF;

    this.scene.appendChild(this.lines);
    this.stack = [];
    this.invertZYAngle = false;
  }

  push() {
    this.stack.push({
      color: this.color,
      direction: [this.direction[0], this.direction[1], this.direction[2]],
      position: [this.position[0], this.position[1], this.position[2]],
    })
  }

  pop() {
    let state = this.stack.pop();
    this.color = state.color;
    this.direction = state.direction;
    this.position = state.position;
  }

  dispose() {
    this.scene.removeChild(this.lines);
  }

  move(distance) {
    let p = this.position;
    let n = this.direction;
    let x = p[0] + distance * n[0];
    let y = p[1] + distance * n[1];
    let z = p[2] + distance * n[2];
    p[0] = x; p[1] = y; p[2] = z;
  }

  draw(distance) {
    let p = this.position;
    let n = this.direction;
    let x = p[0] + distance * n[0];
    let y = p[1] + distance * n[1];
    let z = p[2] + distance * n[2];
    this.lines.add({
      from: p, 
      to: [x, y, z],
      color: this.color
    });

    p[0] = x; p[1] = y; p[2] = z;
    this.scene.renderFrame();
  }

  setColor(newColorValue) {
    if (newColorValue === undefined) {
      throw new Error('setColor() expects color value, got undefined');
    }
    const rgba = tinycolor(typeof newColorValue === 'number' ? 
      Object.values(tinycolor.names)[newColorValue] : newColorValue
    ).toRgb();
    this.color = (rgba.r << 24) | (rgba.g << 16) | (rgba.b << 8) | (rgba.a * 255 | 0)
  }

  rotateZ(angleInDegrees) {
    if (this.invertZYAngle) angleInDegrees *= -1;
    let rad = Math.PI * angleInDegrees / 180;
    let n = this.direction;

    let x = Math.cos(rad) * n[0] - Math.sin(rad) * n[1];
    let y = Math.sin(rad) * n[0] + Math.cos(rad) * n[1];

    n[0] = x;
    n[1] = y;
  }

  rotateY(angleInDegrees) {
    if (this.invertZYAngle) angleInDegrees *= -1;
    let rad = Math.PI * angleInDegrees / 180;
    let n = this.direction;

    let x = Math.cos(rad) * n[0] - Math.sin(rad) * n[2];
    let z = Math.sin(rad) * n[0] + Math.cos(rad) * n[2];

    n[0] = x;
    n[2] = z;
  }

  rotateX(angleInDegrees) {
    let rad = Math.PI * angleInDegrees / 180;
    let n = this.direction;

    let y = Math.cos(rad) * n[1] - Math.sin(rad) * n[2];
    let z = Math.sin(rad) * n[1] + Math.cos(rad) * n[2];

    n[1] = y;
    n[2]= z;
  }

  swapAngle() {
    this.invertZYAngle = !this.invertZYAngle;
  }
}

function checkArray(arrayName, array, ) {
  if (!Array.isArray(array)) {
    throw new Error('Array is expected for `' + arrayName + '`');
  }
  if (array.length === 2) {
    array.push(0);
  }
  if (array.length !== 3) {
    throw new Error('Array `' + arrayName + '` should have 2 or 3 coordinates, got ' + array.length);
  }
}
function normalize(arr) {
  let l = Math.hypot(arr[0], arr[1], arr[2]);
  arr[0] /= l;
  arr[1] /= l;
  arr[2] /= l;
}
