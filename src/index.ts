import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,

    addBasePlugins,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,
    MeshBasicMaterial2,
    IViewerPlugin,

    Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";

import gsap from "gsap";
//import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis'

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
})
  
function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
    
requestAnimationFrame(raf)
  
//  gsap.registerPlugin(ScrollTrigger)

async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target
    const exitButton = document.querySelector('.button--exit') as HTMLElement
    const customizerInterface = document.querySelector('.customizer--container') as HTMLElement

    // Add a popup(in HTML) with download progress when any asset is downloading.
    await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    // await viewer.addPlugin(GBufferPlugin)
    // await viewer.addPlugin(new ProgressivePlugin(32))
    // await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    // await viewer.addPlugin(GammaCorrectionPlugin)
    // await viewer.addPlugin(SSRPlugin)
    // await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    // await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)

    // or use this to add all main ones at once.
    await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    //await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})

    const assets = await manager.addFromPath("./assets/ring.glb")

    const pearl = manager.materials!.findMaterialsByName('/Peach-b57391c8-0a2c-478c-91c5-ff6a93c5d5b0')[0] as MeshBasicMaterial2;
    const ring = manager.materials!.findMaterialsByName('/Yellow Gold-8508952d-1574-41b6-8512-d7f9eb00d480')[0] as MeshBasicMaterial2;
    
    
    // Load an environment map if not set in the glb file
    // await viewer.scene.setEnvironment(
    //     await manager.importer!.importSinglePath<ITexture>(
    //         "./assets/environment.hdr"
    //     )
    // );

    // Add some UI for tweak and testing.
    //const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // Add plugins to the UI to see their settings.
    //uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)
    let needsUpdate = true;

    function onUpdate() {
        needsUpdate = true;
        //viewer.renderer.resetShadows();
        viewer.setDirty()
    }

    viewer.addEventListener('preFrame', () => {
        if(needsUpdate) {
            camera.positionUpdated(true);
            camera.targetUpdated(true);
            needsUpdate = false;    
        }
    })

    const sections = document.querySelector('.container') as HTMLElement
    const mainContainer = document.getElementById('webgi-canvas-container') as HTMLElement

	document.querySelector('.customize')?.addEventListener('click', () => {
        sections.style.display = "none"
        mainContainer.style.pointerEvents = "all"
        document.body.style.cursor = "grab"
        lenis.stop()

        gsap.to(position, {x: -1.3724612108, y: 3.7451892032, z: 5.8411973578, duration: 2, ease: "power3.inOut", onUpdate})
        gsap.to(target, {x: -0.1648821255, y: 0.0762043385, z: -0.2125132234, duration: 2, ease: "power3.inOut", onUpdate, onComplete: enableControllers})
	})

    function changeColor(obj: any, _colorToBeChanged: Color){
        obj.color = _colorToBeChanged;
        viewer.scene.setDirty()
    }

    document.querySelector('.button--colors.pearl-color1')?.addEventListener('click', () => {
		changeColor(pearl, new Color(0x000031).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.pearl-color2')?.addEventListener('click', () => {
		changeColor(pearl, new Color(0xf2f2f5).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.pearl-color3')?.addEventListener('click', () => {
		changeColor(pearl, new Color(0xe4b4b7).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.pearl-color4')?.addEventListener('click', () => {
		changeColor(pearl, new Color(0xd5c6bf).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.ring-color1')?.addEventListener('click', () => {
		changeColor(ring, new Color(0xf9c6ae).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.ring-color2')?.addEventListener('click', () => {
		changeColor(ring, new Color(0xcacaca).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.ring-color3')?.addEventListener('click', () => {
		changeColor(ring, new Color(0xd79e96).convertSRGBToLinear())
    })

    document.querySelector('.button--colors.ring-color4')?.addEventListener('click', () => {
		changeColor(ring, new Color(0xd7b683).convertSRGBToLinear())
    })

    exitButton.addEventListener('click', () => {
        gsap.to(position, {
            x: -3.8365125773, 
            y: 4.6972497739,
            z: 4.0313748276, 
            duration: 1.5, ease: "power3.inOut", 
        onUpdate})
        gsap.to(target, {x: -0.9072162274, y: 0.1324056976, z: -0.6748475763, duration: 1.5, ease: "power3.inOut", onUpdate})
        
        changeColor(pearl, new Color(0x000031).convertSRGBToLinear())
        changeColor(ring, new Color(0xf9c6ae).convertSRGBToLinear())
        
        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false})
        sections.style.display = "flex"
        mainContainer.style.pointerEvents = "none"
        document.body.style.cursor = "default"
        exitButton.style.display = "none"
        customizerInterface.style.display = "none"
        lenis.start()
        window.scrollTo(0, document.body.scrollHeight);    
	})

    function enableControllers(){
        exitButton.style.display = "block"
        customizerInterface.style.display = "block"
        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: true})
    }

}

setupViewer()
