import { Component, OnInit, ViewChild, Renderer2, AfterViewChecked, NgZone, HostListener, OnDestroy } from '@angular/core';
// import * as THREE from 'three';
// import * as THREE from 'three/build/three.module.js';
import {
  PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh,
  Clock, LoadingManager, AmbientLight, DirectionalLight
} from 'three';

import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

@Component({
  selector: 'app-threejs-editor',
  templateUrl: './threejs-editor.component.html',
  styleUrls: ['./threejs-editor.component.scss']
})
export class ThreejsEditorComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('myCanvas', { static: true }) myCanvas;

  camera: PerspectiveCamera;
  scene: Scene;
  webGLRenderer: WebGLRenderer;
  geometry: BoxGeometry;
  material: MeshBasicMaterial;
  cube: Mesh;
  clock: Clock;
  elf: Scene;
  stats: Stats;


  keyboardControls = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  constructor(private renderer: Renderer2, private zone: NgZone) { }

  ngAfterViewChecked() {
    console.log('ngAfterViewChecked');
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initThree();
      this.animate();

      document.addEventListener('keydown', this.keydownPressHandler.bind(this));
      document.addEventListener('keyup', this.keyupPressHandler.bind(this));
    });
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.keydownPressHandler);
    document.removeEventListener('keyup', this.keyupPressHandler);
  }

  initThree() {
    this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 2000 );
    this.camera.position.set( 8, 10, 8 );
    this.camera.lookAt( 0, 3, 0 );

    this.scene = new Scene();

    this.clock = new Clock();

    // loading manager

    const loadingManager = new LoadingManager( () => {
      this.scene.add( this.elf );
    });

    // collada

    const loader = new ColladaLoader( loadingManager );
    loader.load(
      './assets/models/test_kuca.dae/4b9845c4-4e49-4dd1-a6f7-209ef36bfd6a.dae',
      // './assets/models/elf/elf.dae',
      (collada) => {
        this.elf = collada.scene;
      }, (e: ProgressEvent<EventTarget>) => {
        console.log('loaded', Math.round(e.loaded / e.total * 100) + '%');
      }, (e: ErrorEvent) => {
        console.log('load-error', e);
      }
    );

    //

    const ambientLight = new AmbientLight( 0xcccccc, 0.4 );
    this.scene.add( ambientLight );

    const directionalLight = new DirectionalLight( 0xffffff, 0.8 );
    directionalLight.position.set( 1, 1, 0 ).normalize();
    this.scene.add( directionalLight );

    //

    this.webGLRenderer = new WebGLRenderer();
    this.webGLRenderer.setPixelRatio( window.devicePixelRatio );
    // this.webGLRenderer.setSize( window.innerWidth, window.innerHeight );
    this.webGLRenderer.setSize( 800, 600 );
    // container.appendChild( this.webGLRenderer.domElement );
    this.renderer.appendChild(this.myCanvas.nativeElement, this.webGLRenderer.domElement);

    //

    // this.stats = new Stats();
    this.stats = Stats();
    // container.appendChild( stats.dom );
    this.renderer.appendChild(this.myCanvas.nativeElement, this.stats.dom);

    // nije ok, napravi ovako https://threejs.org/examples/misc_controls_pointerlock.html
    var controls = new OrbitControls( this.camera, this.myCanvas.nativeElement );
    this.camera.position.set( 0, 0, 0 );
    controls.update();

    window.addEventListener( 'resize', () => this.onWindowResize(), false );

  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // this.webGLRenderer.setSize( window.innerWidth, window.innerHeight );
    this.webGLRenderer.setSize( 800, 600 );
  }

  animate() {
    requestAnimationFrame( () => this.animate() );

    this.render();
    this.stats.update();
  }

  render() {
    const delta = this.clock.getDelta();

    if ( this.elf !== undefined ) {
      // this.elf.rotation.z += delta * 0.5;
    }
    if (this.keyboardControls.up) {
      this.cameraZ(false);
    }
    if (this.keyboardControls.down) {
      this.cameraZ(true);
    }
    if (this.keyboardControls.left) {
      this.cameraX(false);
    }
    if (this.keyboardControls.right) {
      this.cameraX(true);
    }

    this.webGLRenderer.render( this.scene, this.camera );
  }

  cameraZ(isUp: boolean) {
    this.camera.translateZ(isUp ? 0.1 : -0.1);
    //this.camera.translateY();
  }

  cameraX(isRight: boolean) {
    this.camera.translateX(isRight ? 0.1 : -0.1);
  }

  // key hendler
  private keydownPressHandler(event: KeyboardEvent): void {
    this.setKeyboardControl(event.key.toLowerCase(), true);
  }
  private keyupPressHandler(event: KeyboardEvent): void {
    this.setKeyboardControl(event.key.toLowerCase(), false);
  }

  private setKeyboardControl(key: String, value: boolean) {
    if (key == 'w') {
      this.keyboardControls.up = value;
    } else if (key == 's') {
      this.keyboardControls.down = value;
    } else if (key == 'a') {
      this.keyboardControls.left = value;
    } else if (key == 'd') {
      this.keyboardControls.right = value;
    }
  }

}
