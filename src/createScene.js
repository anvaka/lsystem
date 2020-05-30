import {createScene, createGuide} from 'w-gl';
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
  let raf = requestAnimationFrame(frame);

  return {
    dispose,
    setSystem,
  }

  function setSystem(newSystem) {
    cancelAnimationFrame(raf);
    lSystem.forEach(l => l.dispose());

    if (!Array.isArray(newSystem)) {
      newSystem = [newSystem]
    }
    let wantGuideToBeHidden = false;
    lSystem = [];
    newSystem.forEach(systemSettings => {
      if (systemSettings.hidegrid) {
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

  function frame() {
    canDrawMore = false;
    lSystem.forEach(drawSystem);
    if (canDrawMore) {
      raf = requestAnimationFrame(frame);
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