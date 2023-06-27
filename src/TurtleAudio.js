export default class TurtleAudio {
  constructor(options = {}, audioCtx) {
      this.playing= false;
      // the Ctx is passed from LSystem -> Turtle -> this
      this.aCtx= audioCtx;
      this.notesLower = [138.5, 146.83, 185.0, 164.81, 207.65, 174.61, 220.0, 196.0, 138.59, 246.94, 155.56].sort();
      this.notesUpper = [220.0, 246.94, 329.63, 246.94, 261.63, 392.43, 327.03, 441.493, 392.43,  441.49].sort();
      this.freq1= 261.63;
      this.freq2= 329.63;
      this.wave1= 'sine';
      this.wave2= 'triangle';
      this.osc1= null;
      this.osc2= null;
      this.mainGain= 0.01;
      this.debug= false;

    }
    setupAudio() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.aCtx = new AudioContext();
    }
    playPause() {
      if (!this.playing) {
        this.playing = true;
        this.aCtx.resume();

        this.mainGainNode = this.aCtx.createGain();
        this.mainGainNode.gain.value = this.mainGain;
        this.mainGainNode.connect(this.aCtx.destination);
        this.osc1 = this.aCtx.createOscillator();
        this.osc1.frequency.setValueAtTime(this.freq1, this.aCtx.currentTime);
        this.osc1.type = this.wave1;
        this.osc1.connect(this.mainGainNode);
        this.osc1.start();
        this.osc2 = this.aCtx.createOscillator();
        this.osc2.frequency.setValueAtTime(this.freq2, this.aCtx.currentTime);
        this.osc2.type = this.wave2;
        this.osc2.connect(this.mainGainNode);
        this.osc2.start();

      } else {
        this.playing = false;
        this.osc1.stop();
        this.osc2.stop();
        this.aCtx.suspend();
      }
    }
    selectUpper(note){
        let random = this.notesUpper[Math.floor((Math.random()*this.notesUpper.length))];
        let select = random;//Math.max(random,note) ;
        //console.log(select);
        return select;
    }
    selectLower(note){
        let random = this.notesLower[Math.floor((Math.random()*this.notesLower.length))];
        let select = random;//Math.min(random,note) ;
        //console.log(select);
        return select;
    }
    updateGain() {
      this.mainGainNode.gain.linearRampToValueAtTime(this.mainGain,0.1);
    }
    updateFreq1() {
      this.osc1.frequency.linearRampToValueAtTime(this.freq1 + 0.0, 0.1);
    }
    updateFreq2() {
      this.osc1.frequency.linearRampToValueAtTime(this.freq2 + 0.0, 0.1);
    }
    updateFreq3() {
      this.osc1.frequency.linearRampToValueAtTime(this.freq3 + 0.0, 0.1);
    }
    updateFreq(id, type) {
      switch (id) {
        case 1:
          this.osc1.frequency.linearRampToValueAtTime(this.freq1, 0.1);
          break;
        case 2:
          this.osc2.frequency.linearRampToValueAtTime(this.freq2, 0.1);
          break;
        case 3:
          this.osc3.frequency.linearRampToValueAtTime(this.freq2, 0.1);
          break;
      }
    }
    updateWave(id, type) {
      switch (id) {
        case 1:
          this.wave1 = type;
          this.osc1.type = type;
          break;
        case 2:
          this.wave2 = type;
          this.osc2.type = type;
          break;
        case 3:
          this.wave3 = type;
          this.osc3.type = type;
          break;
      }
    }
    setChord(type) {
      switch (type) {
        case 'CMajor':
          this.freq1 = 261.63;
          this.freq2 = 329.63;
          break;
        case 'DMajor':
          this.freq1 = 146.83;
          this.freq2 = 185.0;
          break;
        case 'EMajor':
          this.freq1 = 164.81;
          this.freq2 = 207.65;
          break;
        case 'FMajor':
          this.freq1 = 174.61;
          this.freq2 = 220.0;
          break;
        case 'GMajor':
          this.freq1 = 196.0;
          this.freq2 = 246.94;
          break;
        case 'AMajor':
          this.freq1 = 220.0;
          this.freq2 = 138.59;
          break;
        case 'BMajor':
          this.freq1 = 246.94;
          this.freq2 = 155.56;
          break;
      }

      this.updateFreq1();
      this.updateFreq2();
    }

    randomFreq() {
      this.freq1 = Math.random() * (1200 - 110) + 110;
      this.freq2 = Math.random() * (1200 - 110) + 110;
      this.updateFreq1();
      this.updateFreq2();
    }
    dispose() {
      this.mainGain = 0.0;
      this.updateGain();
      console.log("TurtleAudio dispose called");
      this.osc1.stop();
      this.osc2.stop();
      this.aCtx.suspend();
    }
}

