import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  FontLoader,
  OrbitControls,
  TextGeometry,
} from "three/examples/jsm/Addons.js";

export default function IndexPage() {
  const screen = useRef<HTMLDivElement>(null);
  let mouseX = 0;
  let mouseY = 0;

  useEffect(() => {
    //events
    window.onmousemove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    //loaders
    const fontLoader = new FontLoader();

    fontLoader.load(
      "node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json",
      function (font) {
        const textGeometry = new TextGeometry("JS", {
          font,
          size: 0.5,
          depth: 0.15,
        });

        const textMaterial = new THREE.MeshBasicMaterial({
          color: 0xad4000,
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.castShadow = true;
        textMesh.position.set(-0.3, 0, 0);

        scene.add(textMesh);
      },
      undefined,
      function (err) {
        console.log(err);
      }
    );

    //events
    window.onresize = () => {
      (sizes.heigth = window.innerHeight), (sizes.width = window.innerWidth);
      //camera update
      camera.updateProjectionMatrix();
      camera.aspect = sizes.width / sizes.heigth;
      renderer.setSize(sizes.width, sizes.heigth);
    };

    //refs
    const screenRef = screen.current as HTMLElement;
    //sizes
    const sizes = {
      width: window.innerWidth,
      heigth: window.innerHeight,
    };
    //scene
    const scene = new THREE.Scene();

    //camera
    const camera = new THREE.PerspectiveCamera(
      45,
      sizes.width / sizes.heigth,
      0.1,
      100
    );

    camera.position.z = 10;

    //light
    const light = new THREE.SpotLight(0xffffff, 100, 100000, 0.2);

    light.position.set(10, 10, 10);

    //geometry
    const icosagonoGeometry = new THREE.IcosahedronGeometry(1, 2);

    //material
    const material = new THREE.MeshStandardMaterial({
      color: "#000",
      transparent: true,
      opacity: 0.9,
    });

    //mesh
    const icosagono = new THREE.Mesh(icosagonoGeometry, material);

    icosagono.position.set(0, 15, 20);

    //scene added things
    scene.add(light);
    scene.add(camera);
    scene.add(icosagono);

    //renderer
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(sizes.width, sizes.heigth);
    screenRef?.appendChild(renderer.domElement);
    renderer.render(scene, camera);
    renderer.setClearColor(0xfffff, 1);
    //controls
    const control = new OrbitControls(camera, screenRef);

    control.enableDamping = true;
    control.enablePan = false;

    //loop
    const clock = new THREE.Clock();
    const loop = () => {
      const elapsedTime = clock.getElapsedTime();
      renderer.render(scene, camera);
      window.requestAnimationFrame(loop);

      const points = icosagono.position;

      const posY = points.y;
      const posX = points.x;
      const posZ = points.z;

      if (posX > 0) {
        icosagono.position.x -= 1 * (0.0001 * elapsedTime);
      }

      if (posX < 0) {
        icosagono.position.x += 1 * (0.0001 * elapsedTime);
      }

      if (posZ > 0) {
        icosagono.position.z -= 1 * (0.0001 * elapsedTime);
      }

      if (posZ < 0) {
        icosagono.position.z += 1 * (0.0001 * elapsedTime);
      }

      if (posY > 0) {
        icosagono.position.y -= 1 * (0.0001 * elapsedTime);
      }

      if (posY < 0) {
        icosagono.position.y += 1 * (0.0001 * elapsedTime);
      }

      control.update();
    };

    loop();

    //testes

    return () => {
      screenRef?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div>
      <div ref={screen} />
    </div>
  );
}
