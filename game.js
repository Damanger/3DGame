import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);
const instructionsButton = document.getElementById('instructions');
instructionsButton.addEventListener('click', showInstructions);
const scoreContainer = document.getElementById('container');
const canvas = document.getElementById('miCanvas');
const cuchao = new Audio('./modelos/cuchao.mp3');
const crash = new Audio('./modelos/Crash.mp3');
const money = new Audio('./modelos/moneda.mp3');
const win = new Audio('./modelos/win.mp3');

//Empieza el juego
function startGame() {
    startButton.removeEventListener('click', startGame);
    startButton.style.display = 'none';
    instructionsButton.style.display = 'none';
    startButton.addEventListener('click', playAudio);
    // Mostrar el contenedor del score
    scoreContainer.style.display = 'block';
    let objectToFollow;
    let vidas = 3;
    let monedas = 0;
    let totalMonedas = 0;
    let mcqueenModel;
    const objectsToRemove = [];
    const coins = [];
    const grogus = [];
    const pats = [];
    const oxid = [];
    const bloq = [];
    const dogs = [];
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new THREE.Scene();
    scene.background = null;
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha;
    //Crear cámara
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(5, 0, 0);

    //Agregar variable de velocidad
    const speed = 15;

    //cámara
    var cam = 1;

    //Crear luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight3.position.set(0, 0, -1);
    scene.add(directionalLight3);

    // Crear una luz direccional que emita luz en la dirección Z
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(0, 0, 1); // dirección de la luz en el eje Z
    directionalLight2.target.position.set(0, 0, 0); // punto hacia donde apunta la luz
    scene.add(directionalLight2);
    scene.add(directionalLight2.target);

    function playAudio() {
        const audio = document.querySelector('audio');
        audio.play();
    }

    function loadModel(loader, url) {
        return new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
        });
    }

    let patricioModel, coinModel, groguModel, dogModel;

    async function loadModels() {
        const loader = new GLTFLoader();
        const coinModelPromise = loadModel(loader, './modelos/bitcoin/scene.gltf');
        const dogModelPromise = loadModel(loader, './modelos/dog/scene.gltf')
        const groguModelPromise = loadModel(loader, './modelos/baby_yoda__grogu/scene.gltf');
        const patricioModelPromise = loadModel(loader, './modelos/sponge-bob-patrick-starfish/scene.gltf');
        const oxidadoModelPromise = loadModel(loader, './modelos/ruined_cars_small_freebie/scene.gltf');
        const bloqueoModelPromise = loadModel(loader, './modelos/damaged_roadblock_01/scene.gltf');

        // Esperar a que se carguen todos los modelos
        [
            coinModel,
            groguModel,
            patricioModel,
            dogModel
        ] = await Promise.all([
            coinModelPromise,
            groguModelPromise,
            patricioModelPromise,
            dogModelPromise
        ]);

        // Replicar los modelos
        if (coinModel) {
            replicateModel(coinModel.scene, 750, -300, 0.25, 110, coins, objectsToRemove);
        }
        if (groguModel) {
            replicateModel(groguModel.scene, 500, -1000, 3, 127, grogus, objectsToRemove);
        }
        if (dogModel) {
            replicateModel(dogModel.scene, 500, -2000, 15, 122, dogs, objectsToRemove);
        }
        if (patricioModel) {
            replicateModel(patricioModel.scene, 500, -2500, 0.1, 112, pats, objectsToRemove);
        }
        if (oxidadoModelPromise) {
            const oxidadoModel = await oxidadoModelPromise;
            replicateModel(oxidadoModel.scene, 500, -3150, 0.2, 110, oxid, objectsToRemove);
        }
        if (bloqueoModelPromise) {
            const bloqueoModel = await bloqueoModelPromise;
            replicateModel(bloqueoModel.scene, 500, -1500, 30, 110, bloq, objectsToRemove);
        }
    }

    function replicateModel(originalMesh, numCopies, initialX, scale, yPosition, collection, objectsToRemove) {
        if (originalMesh) {
            for (let i = 0; i < numCopies; i++) {
                const mesh = originalMesh.clone();
                mesh.position.x = initialX + i * -2500;
                mesh.scale.set(scale, scale, scale);
                mesh.position.y = yPosition;
                mesh.position.z = Math.random() * 180 - 120;

                // Aplicar rotación solo a los modelos patricioModel, coinModel y groguModel
                if (originalMesh === patricioModel.scene || originalMesh === coinModel.scene || originalMesh === groguModel.scene) {
                    mesh.rotation.y = Math.PI / 2;
                }
                if (originalMesh === dogModel.scene)
                mesh.rotation.y = Math.PI;

                scene.add(mesh);
                collection.push(mesh);
                objectsToRemove.push(mesh);
            }
        }
    }

    // Llamar a la función para cargar los modelos
    loadModels();

    //Carretera1
    const carretera = new GLTFLoader();
    carretera.load('./modelos/road1/scene.gltf', (gltf) => {
        //Accede al objeto de malla del modelo GLTF
        const originalMesh = gltf.scene.children[0];

        //Repetir carretera
        const numCopies = 500;
        for (let i = 0; i < numCopies; i++) {
            //Clonar el objeto de malla
            const mesh = originalMesh.clone();

            //Modificar la posición del objeto de malla clonado
            mesh.position.x = -1000 + i * -11710; //Distancia entre cada copia de la carretera

            //Escala el objeto de malla
            mesh.scale.set(80, 80, 80);

            //Mueve el objeto de malla hacia arriba en la escena
            mesh.position.y = 100;

            //Agrega el modelo GLTF a la escena
            scene.add(mesh);
        }
    });

    //Carretera2
    const carretera2 = new GLTFLoader();
    carretera2.load('./modelos/road3/scene.gltf', (gltf) => {
        //Accede al objeto de malla del modelo GLTF
        const originalMesh = gltf.scene.children[0];
        originalMesh.position.x = -4620;
        //Repetir carretera
        const numCopies = 500;
        for (let i = 0; i < numCopies; i++) {
            //Clonar el objeto de malla
            const mesh = originalMesh.clone();

            //Modificar la posición del objeto de malla clonado
            mesh.position.x = -4620 + i * -11710; //Distancia entre cada copia de la carretera
            mesh.rotation.z = Math.PI / 2;
            //Escala el objeto de malla
            mesh.scale.set(159, 159, 159);

            //Mueve el objeto de malla hacia arriba en la escena
            mesh.position.y = 47;
            mesh.position.z = -35;
            //Agrega el modelo GLTF a la escena
            scene.add(mesh);
        }
    });

    //mcqueen

    //En la función de carga del objeto GLTF, asignar el objeto a la variable
    const mcqueen = new GLTFLoader();
    mcqueen.load('./modelos/lighting_mcqueen/scene.gltf', (gltf) => {
        //Accede al objeto de malla del modelo GLTF
        mcqueenModel= gltf.scene.children[0];
        //Escala el objeto de malla
        mcqueenModel.scale.set(10, 10, 10);
        //Mueve el objeto de malla hacia arriba en la escena
        mcqueenModel.position.y = 110;
        //Gira el objeto de malla alrededor del eje Z
        mcqueenModel.rotation.z = Math.PI / 2 + Math.PI;
        //Agrega el modelo GLTF a la escena
        scene.add(gltf.scene);

        //Asignar el objeto a la variable objectToFollow
        objectToFollow = mcqueenModel;

        document.addEventListener("keydown", (event) => {
            if ((event.code === "ArrowLeft" || event.key === "a") && (mcqueenModel.position.z > -130 && mcqueenModel.position.z < 120) && isPaused === false) {
                mcqueenModel.position.z += 10;
            } else if ((event.code === "ArrowRight" || event.key === "d") && (mcqueenModel.position.z > -120 && mcqueenModel.position.z < 130) && isPaused === false) {
                mcqueenModel.position.z -= 10;
            }
        });
    });

    let animationFrameId;

    //En la función de animación, actualizar la posición de la cámara
    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        //Si objectToFollow está definido, actualizar la posición de la cámara
        if (objectToFollow) {
            //Mover hacia adelante
            objectToFollow.position.x -= speed;
            // Actualizar el valor de las monedas
            const coinsValue = document.getElementById('coinsValue');
            coinsValue.textContent = monedas;
            // Actualizar el valor del puntaje
            const scoreValue = document.getElementById('scoreValue');
            scoreValue.textContent = totalMonedas * 100;
            // Actualizar el valor de las vidas
            const livesValue = document.getElementById('livesValue');
            livesValue.textContent = vidas;
            //Actualizar la posición de la cámara para que esté detrás del objeto
            camera.position.set(objectToFollow.position.x + 120, objectToFollow.position.y + 60, objectToFollow.position.z);
            //Apuntar la cámara hacia el objeto
            camera.lookAt(objectToFollow.position);
            for (let i = objectsToRemove.length - 1; i >= 0; i--) {
                const object = objectsToRemove[i];
                if (object.position.x > objectToFollow.position.x + 3500) {
                    scene.remove(object);
                    objectsToRemove.splice(i, 1);
                }
            }
        }

        //Colisiones Monedas
        coins.forEach((coin, index) => {
            if (checkCollision(objectToFollow, coin)) {
                scene.remove(coin);
                coins.splice(index, 1);
                monedas++;
                money.play();
                if (monedas === 20){
                    vidas++;
                    livesValue.textContent = vidas;
                    livesValue.classList.add('texto-verde'); // Agregar clase 'texto-verde' al elemento de texto
                    setTimeout(() => {
                        livesValue.classList.remove('texto-verde'); // Eliminar clase 'texto-verde' después de 0.5 segundos
                    }, 500);
                    monedas = 0;
                }
                totalMonedas++;
                // Actualiza el valor de la variable monedas en el HTML
                document.getElementById('coinsValue').textContent = totalMonedas;
                coinsValue.textContent = monedas;
                coinsValue.classList.add('texto-amarillo'); // Agregar clase 'texto-amarillo' al elemento de texto
                setTimeout(() => {
                    coinsValue.classList.remove('texto-amarillo'); // Eliminar clase 'texto-amarillo' después de 0.5 segundos
                }, 500);
            }
        });

        //Colisiones Grogus
        grogus.forEach((grogu, index) => {
            if (checkCollision(objectToFollow, grogu)) {
                grogus.splice(index, 1);
                vidas--;
                if(vidas !=-1)
                    cuchao.play();
                // Actualiza el valor de la variable vidas en el HTML
                document.getElementById('livesValue').textContent = vidas;
                livesValue.textContent = vidas;
                livesValue.classList.add('texto-rojo'); // Agregar clase 'texto-rojo' al elemento de texto
                setTimeout(() => {
                    livesValue.classList.remove('texto-rojo'); // Eliminar clase 'texto-rojo' después de 0.5 segundos
                }, 500);
            }
        });

        //Colisiones Pats
        pats.forEach((pat, index) => {
            if (checkCollision(objectToFollow, pat)) {
                pats.splice(index, 1);
                vidas--;
                if(vidas !=-1)
                    cuchao.play();
                // Actualiza el valor de la variable vidas en el HTML
                document.getElementById('livesValue').textContent = vidas;
                livesValue.textContent = vidas;
                livesValue.classList.add('texto-rojo'); // Agregar clase 'texto-rojo' al elemento de texto
                setTimeout(() => {
                    livesValue.classList.remove('texto-rojo'); // Eliminar clase 'texto-rojo' después de 0.5 segundos
                }, 500);
            }
        });

        //Colisiones Oxidados
        oxid.forEach((ox, index) => {
            if (checkCollision(objectToFollow, ox)) {
                oxid.splice(index, 1);
                vidas--;
                if(vidas !=-1)
                    cuchao.play();
                // Actualiza el valor de la variable vidas en el HTML
                document.getElementById('livesValue').textContent = vidas;
                livesValue.textContent = vidas;
                livesValue.classList.add('texto-rojo'); // Agregar clase 'texto-rojo' al elemento de texto
                setTimeout(() => {
                    livesValue.classList.remove('texto-rojo'); // Eliminar clase 'texto-rojo' después de 0.5 segundos
                }, 500);
            }
        });

        //Colisiones Bloques
        bloq.forEach((blo, index) => {
            if (checkCollision(objectToFollow, blo)) {
                bloq.splice(index, 1);
                vidas--;
                if(vidas !=-1)
                    cuchao.play();
                // Actualiza el valor de la variable vidas en el HTML
                document.getElementById('livesValue').textContent = vidas;
                livesValue.textContent = vidas;
                livesValue.classList.add('texto-rojo'); // Agregar clase 'texto-rojo' al elemento de texto
                setTimeout(() => {
                    livesValue.classList.remove('texto-rojo'); // Eliminar clase 'texto-rojo' después de 0.5 segundos
                }, 500);
            }
        });

        //Colisiones Dogs
        dogs.forEach((doggie, index) => {
            if (checkCollision(objectToFollow, doggie)) {
                dogs.splice(index, 1);
                vidas--;
                if(vidas !=-1)
                    cuchao.play();
                // Actualiza el valor de la variable vidas en el HTML
                document.getElementById('livesValue').textContent = vidas;
                livesValue.textContent = vidas;
                livesValue.classList.add('texto-rojo'); // Agregar clase 'texto-rojo' al elemento de texto
                setTimeout(() => {
                    livesValue.classList.remove('texto-rojo'); // Eliminar clase 'texto-rojo' después de 0.5 segundos
                }, 500);
            }
        });

        if (vidas === -1) {
            cuchao.pause();
            crash.play();
            cancelAnimationFrame(animationFrameId); //Detiene el bucle de animación
            audio.pause(); // Pausa el audio
            showGameOver(); // Mostrar el texto "GAME OVER"
            setTimeout(reloadPage, 4000); // Esperar 4 segundos (4000 milisegundos) antes de recargar la página
        }

        if (vidas === 7) {
            cancelAnimationFrame(animationFrameId);
            audio.pause();
            win.play();
            showWinner();
            setTimeout(reloadPage, 4000);
        }

        renderer.render(scene, camera);
    }

    //Agregar variable de pausa
    let isPaused = false;
    let audio = document.querySelector('audio'); // Obtener referencia al elemento audio

    //Controlador de eventos para la tecla "p"
    document.addEventListener('keydown', function (event) {
        if (event.key === 'p') {
            isPaused = !isPaused; //cambiar el estado de pausa

            //pausar/reanudar la animación
            if (isPaused) {
                showPausedGame();
                cancelAnimationFrame(animationFrameId); //Detiene el bucle de animación
                audio.pause(); // Pausa el audio
            } else {
                removePausedGame(); // Elimina el letrero de "Paused"
                animationFrameId = requestAnimationFrame(animate); //Reanuda el bucle de animación
                audio.play(); // Reproduce el audio
            }
        }
        if (event.key === 'q') {
            cancelAnimationFrame(animationFrameId); //Detiene el bucle de animación
            audio.pause(); // Pausa el audio
            showGameOver(); // Mostrar el texto "GAME OVER"
            setTimeout(reloadPage, 4000); // Esperar 4 segundos (4000 milisegundos) antes de recargar la página
        }
        if (event.key === 'r') {
            resetGame();
        }
    });

    function resetGame() {
        // Restablecer variables a sus valores iniciales
        objectsToRemove.forEach(object => scene.remove(object));
        vidas = 3;
        monedas = 0;
        totalMonedas = 0;
        objectsToRemove.length = 0;
        coins.length = 0;
        grogus.length = 0;
        pats.length = 0;
        oxid.length = 0;
        bloq.length = 0;
        dogs.length = 0;

        // Restablecer la posición y orientación de la cámara
        camera.position.set(5, 0, 0);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Resetting...',
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout(resetingGame, 2000);
    }

    function resetingGame(){
        resetCarPosition();
        // Volver a cargar los modelos
        loadModels();
    }

    // Variable para almacenar la posición inicial del carro
    const initialCarPosition = new THREE.Vector3(5, 110, 0);

    function resetCarPosition() {
        if (objectToFollow) {
            objectToFollow.position.copy(initialCarPosition);
        }
    }

    // Función para mostrar el texto "Paused"
    function showPausedGame() {
        const pausedGameDiv = document.createElement("div");
        pausedGameDiv.id = "pausedGameDiv"; // Asigna un ID al elemento <div>
        pausedGameDiv.textContent = "Paused";
        pausedGameDiv.style.fontSize = "20rem";
        pausedGameDiv.style.fontWeight = "bold";
        pausedGameDiv.style.textAlign = "center";
        pausedGameDiv.style.position = "absolute";
        pausedGameDiv.style.top = "50%";
        pausedGameDiv.style.left = "50%";
        pausedGameDiv.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(pausedGameDiv);
    }

    // Función para eliminar el letrero de "Paused"
    function removePausedGame() {
        const pausedGameDiv = document.getElementById("pausedGameDiv");
        if (pausedGameDiv) {
            pausedGameDiv.parentNode.removeChild(pausedGameDiv);
        }
    }

    function checkCollision(object1, object2) {
        const box1 = new THREE.Box3().setFromObject(object1);
        const box2 = new THREE.Box3().setFromObject(object2);
        return box1.intersectsBox(box2);
    }

    // Función para mostrar el texto "GAME OVER"
    function showGameOver() {
        const gameOverDiv = document.createElement("div");
        removePausedGame(); // Elimina el letrero de "Paused"
        gameOverDiv.textContent = "GAME OVER";
        gameOverDiv.style.fontSize = "20rem";
        gameOverDiv.style.fontWeight = "bold";
        gameOverDiv.style.textAlign = "center";
        gameOverDiv.style.position = "absolute";
        gameOverDiv.style.top = "50%";
        gameOverDiv.style.left = "50%";
        gameOverDiv.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(gameOverDiv);
    }

    // Función para mostrar el texto "WINNER!"
    function showWinner() {
        const winnerDiv = document.createElement("div");
        winnerDiv.textContent = "WINNER!";
        winnerDiv.style.fontSize = "20rem";
        winnerDiv.style.fontWeight = "bold";
        winnerDiv.style.textAlign = "center";
        winnerDiv.style.position = "absolute";
        winnerDiv.style.top = "50%";
        winnerDiv.style.left = "50%";
        winnerDiv.style.transform = "translate(-50%, -50%)";
        document.body.appendChild(winnerDiv);
    }

    // Función para recargar la página
    function reloadPage() {
        window.location.reload();
    }

    //Crear controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    animate();
    if (audio)
        audio.play();
}

function showInstructions() {
    Swal.fire({
        title: 'Instructions:',
        width: 600,
        html: '<div>Here are the instructions of the game:<br><ul><li>Rule 1: Avoid crashing arround.</li><li>Rule 2: Get as many points as you posibbly can by taking coins.</li><li>Rule 3: Win by reaching 7 lives!</li></ul></div><div>Movement instructions of the game:<br><ul><li>Movement 1: Move with arrows (Left or Right) or with "a" and "d".</li><li>Movement 2: Press "p" to pause the game or "q" to quit.</li></ul></div>',
        showConfirmButton: true,
        background: '#fff',
        backdrop: `
          url(/images/wall.jpeg)
          no-repeat
          center top
          /cover
          fixed
        `
    });
}
