import { Component, OnInit, ViewChild, Renderer2, AfterViewChecked, NgZone } from '@angular/core';
// import * as THREE from 'three';
// import * as THREE from 'three/build/three.module.js';
import {
  PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh,
  Clock, LoadingManager, AmbientLight, DirectionalLight
} from 'three';

import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

@Component({
  selector: 'app-threejs-editor',
  templateUrl: './threejs-editor.component.html',
  styleUrls: ['./threejs-editor.component.scss']
})
export class ThreejsEditorComponent implements OnInit, AfterViewChecked {
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

  constructor(private renderer: Renderer2, private zone: NgZone) { }

  ngAfterViewChecked() {
    console.log('ngAfterViewChecked');
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.initThree();
      this.animate();
    });
  }

  // default primjer
  // initThree() {
  //   this.scene = new Scene();
  //   this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

  //   this.webGLRenderer = new WebGLRenderer();
  //   // this.webGLRenderer.setSize( window.innerWidth, window.innerHeight );
  //   this.webGLRenderer.setSize( 800, 500 );
  //   // document.body.appendChild( this.webGLRenderer.domElement );
  //   this.renderer.appendChild(this.myCanvas.nativeElement, this.webGLRenderer.domElement);

  //   this.geometry = new BoxGeometry( 1, 1, 1 );
  //   this.material = new MeshBasicMaterial( { color: 0x00ff00 } );
  //   this.cube = new Mesh( this.geometry, this.material );
  //   this.scene.add( this.cube );

  //   this.camera.position.z = 5;
  // }

  // animate() {
  //   requestAnimationFrame(() => this.animate());

  //   this.cube.rotation.x += 0.01;
  //   this.cube.rotation.y += 0.01;

  //   this.webGLRenderer.render(this.scene, this.camera);
  // }

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

    //

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

    this.webGLRenderer.render( this.scene, this.camera );
  }

  cameraZ(isUp: boolean) {
    this.camera.translateZ(isUp ? 1 : -1);
  }

  cameraX(isRight: boolean) {
    this.camera.translateX(isRight ? 1 : -1);
  }


}
