/**
 * This is a very simple parser to parse our "L-system" language
 * 
 * It works as a simple state machine, which has two rules:
 * 
 * "ExpectKeyValue" and "ExpectRewriteValue". In each state it consumes
 * a line from the input and either transitions to the next state
 * or adds new key/values to the current state.
 */
const separator = /:|->|=>|=|→/
const rules = /rules|production rules/i;
const actions = /actions/i;
const ws = /[ \t]/g;
const numericKey = /angle|depth|width|stepsPerFrame/i;
const vectorKey = /direction|position/i;
const parens = /[[\]()]/;

/**
 * Read rewrite rule.
 */
class ExpectRewriteValue {
  constructor(addTo, parent, valueParser) {
    this.parent = parent;
    this.addTo = addTo;
    this.valueParser = valueParser || (result => result);
  }

  process(line) {
    let result = line.split(separator)
    if (result.length === 1) throw new Error('Expected `_ => value`, found ' + line);

    let key = result[0].trim();
    if (key.length !== 1) {
      // we are done with this rule
      return this.parent.process(line);
    }
    let v = result.slice(1).join('').replace(ws, '');
    this.addTo[key] = this.valueParser(v);
    return this;
  }
}

function extractAction(stringValue) {
  let m = stringValue.match(/(\w+?)\s*\((.+?)?\)/);
  if (!m) {
    throw new Error('Expected `action()` call, got: ' + stringValue);
  }
  let name = m[1];
  let args = !m[2] ? [] : m[2].split(',').map(v => Number.parseFloat(v.trim()));
  return {name, args};
}

/**
 * Expect arbitrary key/value line.
 */
class ExpectKeyValue {
  constructor(addTo) {
    this.addTo = addTo;
  }

  process(line) {
    let result = line.split(separator)
    if (result.length === 1) throw new Error('Expected `key: value`, found ' + line);
    let key = result[0].trim();
    let value = result.slice(1).join('').trim();
    if (key.match(rules)) {
      this.addTo.rules = {};
      return new ExpectRewriteValue(this.addTo.rules, this);
    } else if (key.match(actions)) {
      this.addTo.actions = {};
      return new ExpectRewriteValue(this.addTo.actions, this, extractAction);
    } else if (key.match(numericKey)) {
      let v = Number.parseFloat(value);
      if (!Number.isFinite(v)) {
        throw new Error('Expected a number value for `' + key + '`');
      }
      this.addTo[key] = v;
      return this;
    } else if (key.match(vectorKey)) {
      this.addTo[key] = parseVector(value, key)
      return this;
    }

    this.addTo[key] = value;
    return this;
  }
}

function parseVector(v, vectorName) {
  return v.replace(parens, '').replace(ws, '').split(',').map((component, position) => {
    if (!component) {
      throw new Error('Missing vector component at position ' + position +' for `' + vectorName + '`');
    }
    let x = Number.parseFloat(component);
    if (!Number.isFinite(x)) {
      throw new Error('Vectors are expected to be numbers. Found `' + component + '` in `' + v + '`');
    }
    return x;
  })
}

export default function parse(str) {
  let lines = str.split('\n');
  let currentState = new ExpectKeyValue({});

  lines.forEach((line, lineNumber) => {
    line = line.trim();
    // ignore comments and empty lines
    if (line === '' || line.startsWith('//')) return;
    try {
      currentState = currentState.process(line);
    } catch (e) {
      throw new Error(e.message + '\n\n at line ' + lineNumber);
    }
  });

  while (currentState.parent) {
    currentState = currentState.parent;
  }
  return currentState.addTo;
}
