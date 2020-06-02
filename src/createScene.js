import {createScene, createGuide, toSVG} from 'w-gl';
import LSystem from './LSystem';

export default function createLScene(canvas) {
  let scene = createScene(canvas);
  let guide = createGuide(scene, {
    lineColor: 0x0d3f71ff
  });

  scene.setClearColor(12/255, 41/255, 82/255, 1)
  let initialSceneSize = 40;
  scene.setViewBox({
    left:  -initialSceneSize,
    top:   -initialSceneSize,
    right:  initialSceneSize,
    bottom: initialSceneSize,
  });

  let canDrawMore = false;
  let lSystem = [];
  let disposeLater;
  let raf = requestAnimationFrame(frame);

  return {
    dispose,
    setSystem,
    saveToSVG,
    isComplete,
  }

  function saveToSVG(fileName) {
    let svg = toSVG(scene, {
      open() {
        return `<!-- Generator: https://github.com/anvaka/l-system -->`;
      }
    });
    let blob = new Blob([svg], {type: "image/svg+xml"});
    let url = window.URL.createObjectURL(blob);
    // For some reason, safari doesn't like when download happens on the same
    // event loop cycle. Pushing it to the next one.
    setTimeout(() => {
      let a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      revokeLater(url);
    }, 30)
  }

  function revokeLater(url) {
    // In iOS immediately revoked URLs cause "WebKitBlobResource error 1." error
    // Setting a timeout to revoke URL in the future fixes the error:
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 45000);
  }

  function setSystem(newSystem) {
    cancelAnimationFrame(raf);
    if (disposeLater) {
      lSystem.forEach(l => disposeLater.push(l));
    } else {
      disposeLater = lSystem;
    }

    if (!Array.isArray(newSystem)) {
      newSystem = [newSystem]
    }
    let wantGuideToBeHidden = false;
    lSystem = [];
    newSystem.forEach(systemSettings => {
      if (systemSettings.hideGrid) {
        wantGuideToBeHidden = true;
      }
      lSystem.push(new LSystem(scene, systemSettings));
    });

    if (wantGuideToBeHidden && guide) {
      guide.dispose();
      guide = null;
    } else if (!wantGuideToBeHidden && !guide) {
      guide = createGuide(scene);
    }

    raf = requestAnimationFrame(frame);
  }

  function isComplete() {
    return lSystem.every(x => x.complete);
  }

  function frame() {
    canDrawMore = false;
    lSystem.forEach(drawSystem);
    if (canDrawMore) {
      raf = requestAnimationFrame(frame);
    }
    if (disposeLater) {
      disposeLater.forEach(l => l.dispose())
      disposeLater = null;
    }
  }

  function drawSystem(system) {
    canDrawMore |= system.frame();
  }

  function dispose() {
    cancelAnimationFrame(raf);
    scene.dispose();
  }
}