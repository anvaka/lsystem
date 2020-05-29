<template>
  <div id="app">
    <div class='sidebar'>
      <div class='controls'>
        <a href="#" class='print-button' @click.prevent='toggleEdit'>{{ showEdit ? "Hide editor" : "Edit..."}}</a>
        <a href="#" class='try-another' @click.prevent='randomize'>Randomize</a>
      </div>
      <div v-if='showEdit'>
        <code-editor v-if='codeEditorModel' :model='codeEditorModel'></code-editor>
        <div class='help'>Please read more about L-Systems on <a href='http://paulbourke.net/fractals/lsys/' target="_blank">Paul Bourke's website</a></div>
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
      showEdit: true
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
#app {
  position: absolute;
  z-index: 1;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.sidebar {
  width: 500px;
}
.error-container {
  background: orange;
  color: white;
  padding: 8px;
}
.controls {
  height: 48px;
  background: white;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: desktop-controls-width;
  justify-content: space-around;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  a {
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;
    color: highlight-color;
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
</style>
