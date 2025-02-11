import "./style.css";
import { createViewerForCanvas } from "@babylonjs/viewer";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { SpotLight, ReflectiveShadowMap } from "@babylonjs/core";
import { GIRSM } from "@babylonjs/core/";
import { GIRSMManager } from "@babylonjs/core";
import {
  PostProcess,
  PostProcessManager,
  PostProcessOptions,
  PostProcessRenderEffect,
  PostProcessRenderPipeline,
  PostProcessRenderPipelineManager,
  PostProcessRenderPipelineManagerSceneComponent,
} from "@babylonjs/core";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

const viewerPromise = createViewerForCanvas(canvas, {
  // engine: "WebGPU",
  onInitialized: (details) => {
    console.log("DETAILS", details);
    console.log("SCENE", details.scene);
    const light = new SpotLight(
      "spotLight",
      new Vector3(-1, 2, 1),
      new Vector3(2, -0.5, -2),
      Math.PI / 2,
      2,
      details.scene
    );
    light.intensity = 10;
    light.shadowMinZ = 0.01;
    light.shadowMaxZ = 6;
    details.scene.ambientColor.set(0.05, 0.05, 0.05);
    //
    const engine = details.scene.getEngine();

    const defaultRSMTextureRatio = 8;
    const defaultGITextureRatio = 2;

    const outputDimensions = {
      width: engine.getRenderWidth(true),
      height: engine.getRenderHeight(true),
    };

    const rsmTextureDimensions = {
      width: Math.floor(engine.getRenderWidth(true) / defaultRSMTextureRatio),
      height: Math.floor(engine.getRenderHeight(true) / defaultRSMTextureRatio),
    };

    const giTextureDimensions = {
      width: Math.floor(engine.getRenderWidth(true) / defaultGITextureRatio),
      height: Math.floor(engine.getRenderHeight(true) / defaultGITextureRatio),
    };

    const giRSMs: GIRSM[] = [];

    giRSMs.push(new GIRSM(new ReflectiveShadowMap(details.scene, light, rsmTextureDimensions)));

    // giRSMs.forEach((girsm) => (girsm.rsm.forceUpdateLightParameters = true)); // for the demo, don't do this in production!

    const giRSMMgr = new GIRSMManager(details.scene, outputDimensions, giTextureDimensions, 2048);

    giRSMMgr.addGIRSM(giRSMs);

    console.log(giRSMMgr);
    //
    //Uncomment the line below to see the error
    // giRSMMgr.enable = true;

    /*
    details.scene.materials.forEach((material) => {
      if ((material as any).ambientColor) {
        (material as any).ambientColor.set(1, 1, 1);
      }
    });
   
    giRSMs.forEach((girsm) => girsm.rsm.addMesh());
    giRSMMgr.addMaterial(); // add all materials in the scene
*/
    //
  },
});

viewerPromise.then((viewer) => {
  viewer.loadModel("https://playground.babylonjs.com/scenes/BoomBox.glb");

  viewer.onModelChanged.add(() => {
    console.log("Model changed");
    console.log(viewer);
  });
});
