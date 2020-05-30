<template>
<div>
  <codemirror v-model='model.code' ref='editor' :options="{
    viewportMargin: Infinity,
    mode: 'application/lsystem',
  }"></codemirror>
  <div class='error-container' v-if='model.error'>
    <pre class='error hl'>{{model.error}}</pre>
  </div> 
</div>
</template>

<script>
import bus from './bus';
import { codemirror } from 'vue-codemirror-lite';
var CodeMirror = require('codemirror/lib/codemirror.js')
require('codemirror/addon/comment/comment.js');
require('./lmode.js')(CodeMirror)

function toggleComment(cm) {
  cm.toggleComment({
    indent: true,
    lineComment: '//'
  });
}

function handleUp(cm) {
  return updateValueIfNeededBy(1, cm);
}

function handleDown(cm) {
  return updateValueIfNeededBy(-1, cm);
}

function updateValueIfNeededBy(delta, cm) {
  let cursor = cm.getCursor();
  let token = cm.getTokenAt(cursor);
  if (!token || token.type !== 'number') return CodeMirror.Pass;

  let from = {line: cursor.line, ch: token.start};
  let end = {line: cursor.line, ch: token.end};

  let v = Number.parseFloat(token.string);
  let line = cm.getLine(cursor.line);
  if (from.ch > 0) {
    // minus is not part of the number.
    if (line[from.ch - 1] === '-') {
      v *= -1;
      from.ch -= 1;
    }
  }

  
  v += delta;
  var doc = cm.getDoc();
  doc.replaceRange(String(v), from, end);
  bus.fire('immediate-update')
}
//require('./glslmode')(CodeMirror);
export default {
  name: 'CodeEditor',
  props: ['model'],
  components: {
    codemirror
  },

  mounted() {
    bus.on('settings-collapsed', refreshEditor, this);
    bus.on('immediate-update', this.setImmediateUpdate, this);
    this.$refs.editor.editor.setOption('extraKeys', {
      'Cmd-/': toggleComment,
      'Ctrl-/': toggleComment,
      'Shift-Up': handleUp,
      'Shift-Down': handleDown
    });
  },

  beforeDestroy() {
    bus.off('settings-collapsed', refreshEditor, this);
    bus.off('immediate-update', this.setImmediateUpdate, this);
  },
  watch: {
    'model.code': function() {
      if (this.model.ignoreNextUpdate) {
        this.model.ignoreNextUpdate = false;
        return;
      }
      if (this.pendingSetCode) {
        clearTimeout(this.pendingSetCode);
      }
      if (this.isImmediate) {
        this.model.setCode(this.model.code);
        this.pendingSetCode = 0;
        return;
      } 

      // We don't want to update code on each key stroke. This would have negative
      // impact on performance.
      this.pendingSetCode = setTimeout(() => {
        this.model.setCode(this.model.code);
        this.pendingSetCode = 0;
      }, 300);
    },
  },
  data() {
    return {
      clearImmediate: 0,
      isImmediate: false
    }
  },
  methods: {
    setImmediateUpdate() {
      if (this.clearImmediate) clearTimeout(this.clearImmediate);
      this.clearImmediate = setTimeout(() => this.isImmediate = false, 30);
      this.isImmediate = true;
    }
  }
}
function refreshEditor(isCollapsed) {
  // Code mirror sometimes is not visible https://stackoverflow.com/questions/8349571/codemirror-editor-is-not-loading-content-until-clicked
  if (!isCollapsed) {
    setTimeout(() => {
      this.$refs.editor.editor.refresh()
    }, 10);
  }
}
</script>