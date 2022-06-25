<template>
  <div id="app">
    <div class='sidebar'>
      <div class='controls'>
        <a href="#" class='print-button' @click.prevent='toggleEdit'>{{ showEdit ? "Hide editor" : "Edit..."}}</a>
        <a href="#" class='try-another' @click.prevent='randomize'>Randomize</a>
      </div>
      <div v-if='showEdit' class='editor-container'>
        <div class="section">
        <div class='title'>L-System details: <a class='reset-all' :class='{"syntax-visible": syntaxHelpVisible}' href='#' @click.prevent='syntaxHelpVisible = !syntaxHelpVisible' title='click to learn more about syntax'>syntax help</a></div>
        <div class='help' v-if='syntaxHelpVisible'>
          L-Systems are described very well on <a href='http://paulbourke.net/fractals/lsys/' target="_blank">Paul Bourke's website</a>.
          <p>The following is the list of available sections:
            <ul>
              <li><strong>axiom</strong>: initial state of the system</li>
              <li><strong>rules</strong>: list of rewrite rules that are applied on each iteration</li>
              <li><strong>depth</strong>: how deep we are allowed to go recursively</li>
              <li><strong>angle</strong>: if specified, this argument governs rotation angle. Can be overridden with <strong>actions</strong></li>
              <li><strong>actions</strong>: list of graphic commands that are triggered by a matching character in the evolved system.
                The following is the list of available actions:
                <ul>
                  <li><strong>draw(x)</strong> draw <code>x</code> units in current direction</li>
                  <li><strong>move(x)</strong> move <code>x</code> units in current direction without drawing</li>
                  <li><strong>rotate(deg)</strong>  rotate current direction <code>deg</code> degrees around Z axis</li>
                  <li><strong>rotateX(deg)</strong> rotate current direction <code>deg</code> degrees around X axis</li>
                  <li><strong>rotateY(deg)</strong> rotate current direction <code>deg</code> degrees around Y axis</li>
                  <li><strong>push()</strong> saves current render state onto stack</li>
                  <li><strong>pop()</strong> restores previously saved render state</li>
                  <li><strong>setcolor(color)</strong> set the current color value, '#ffa500' or 'orange'.</li>
                </ul>

                <p>By default the following actions are added automatically:</p>
<pre><code>actions:
  F => draw(10)
  f => move(10)
  + => rotate(60)
  - => rotate(-60)
  [ => push()
  ] => pop()
</code></pre>

              </li>

              <li><strong>width</strong>: width in pixels of the drawn line</li>
              <li><strong>color</strong>: color of the line. Accepts names and hex. E.g. <code>blue</code>, works the same as <code>#0000ff</code></li>
              <li><strong>stepsPerFrame</strong>: how many steps we are allowed to render per single frame.
              If set to <code>-1</code> the scene is rendered immediately. This could be dangerous on deep
              systems, as the entire system traversal may exhaust the browser's resources.
              </li>

              <li><strong>direction</strong>: three numbers separated by coma <code>x, y, z</code> that set initial direction</li>
              <li><strong>position</strong>: three numbers separated by coma <code>x, y, z</code> that set initial position</li>
            </ul>
          </p>
        </div>
        <code-editor v-if='codeEditorModel' :model='codeEditorModel' class='code-editor-container'></code-editor>
</div>
        <div class='section border-top'>
        <p>This website renders any L-Systems defined above. The website was created by <a href='https://twitter.com/anvaka'>@anvaka</a>.</p>
        <p>You can <a href='#' @click.prevent='toSVGFile' >export to svg</a> current scene</p>
        <p>You can find the entire source code <a href='https://github.com/anvaka/lsystem'>here</a>. 
        Finally, under condition that you love this website you can <a href='https://www.paypal.com/paypalme2/anvakos/3'>buy me a coffee</a> :)
        </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import createScene from './createScene';
import getCodeModel from './getCodeModel';
import CodeEditor from './CodeEditor';

export default {
  name: 'App',
  components: {
    CodeEditor
  },
  data() {
    return {
      codeEditorModel: null,
      showEdit: true,
      syntaxHelpVisible: false
    }
  },
  mounted() {
    this.scene = createScene(document.querySelector('#scene'));
    this.codeEditorModel = getCodeModel(this.scene);
  },
  beforeDestroy() {
    this.scene.dispose();
  },
  methods: {
    toSVGFile() { 
      this.scene.saveToSVG('l-system.svg');
    },
    toggleEdit() {
      this.showEdit = !this.showEdit;
    },
    randomize() {
      this.codeEditorModel.randomize();
    }
  }

}
</script>

<style lang='stylus'>
@import "./shared.styl";
@import "./editor.styl";

highlight-color = #172A4D;
primary-text = white;
help-text-color = #267fcd;
help-background = rgb(7, 12, 23);

border-color = #0d3f71;

#app {
  overflow: hidden;
  max-height: 100%;
  position: absolute;
  z-index: 1;
  color: #ffffff;
  background: window-background;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
}

.section {
  padding: 8px;
}
.section.border-top {
  border-top: 1px solid border-color;
}
.sidebar {
  width: 500px;
  overflow: hidden
  max-height: 100%;
}
.editor-container {
  max-height: calc(100vh - 68px);
  overflow-y: scroll;
  a {
    color: #267fcd;
    text-decoration: none;
    border-bottom: 1px dashed #172a4d;
  }
}
.error-container {
  color: white;
  background: #ff4500;
  padding: 0 8px;
}
.title {
  color: primary-text;
  font-size: 18px;
  padding-left: 4px;
  a {
    float: right;
    font-size: 12px;
    font-style: italic;
    color: help-text-color;
    height: 30px;
    margin: -5px 0;
    padding: 7px;
    border-bottom: none;
  }
  a.syntax-visible {
    background: help-background;
    color: white;
    font-style: normal;
  }
}

.help {
  margin-bottom: 7px;
  padding: 14px;
  background: #070c17;
  color: #0774c3;
  margin: 0 -8px 7px -8px;
  a {
    border-bottom: 1px dashed #172a4d;
    color: white;
  }
  ul {
    padding: 0
    list-style-type: none;
    
    ul {
      padding-left: 18px;
      list-style-type: none;
    }

    strong {
      color: white;
      font-weight: normal;
    }
    code {
      color: #4ec9b0;
    }
  }
}
.code-editor-container {
  margin: 8px 0 16px 0;
}

.controls {
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-around;
  border-bottom: 1px solid border-color;
  a {
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    margin: 0;
    border: 0;
    &:hover {
      color: emphasis-background;
      background: highlight-color;
    }
  }
  a.try-another {
    flex: 1;
  }
  a.print-button {
    flex: 1;
    border-right: 1px solid border-color;
    &:focus {
      border: 1px dashed highlight-color;
    }
  }
}
@media (max-width: 500px) {
  #app {
    width: 100%;
    margin: 0;
  }
  .sidebar {
    width: 100%;
  }
}
</style>
