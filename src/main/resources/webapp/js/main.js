/**
 *
 */

requirejs.config({
    baseUrl: 'js'
});

require([
    'lib/three.min',
    'lib/OrbitControls',
    'logic'
], function(THREE, OrbitControls, Logic) {

    var scene, camera, renderer;

    var font;

    var fontLoader = new THREE.FontLoader();
    fontLoader.load(
        'js/fonts/helvetiker_regular.typeface.json',
        function(result) {
            font = result;
            init();
            animate();
        },
        function (xhr) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (xhr) {
            console.log( 'An error happened' );
        }
    );

    function init() {

        scene = new THREE.Scene();
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;

        renderer = new THREE.WebGLRenderer({
            antialias:true
        });
        renderer.setSize(WIDTH, HEIGHT);
        document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
        camera.position.set(20, 20, 10);
        scene.add(camera);

        window.addEventListener('resize', function() {
            var WIDTH = window.innerWidth,
                HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        });

        renderer.setClearColor(0xEEEEEE, 1);

        var light1 = new THREE.PointLight(0x888888);
        light1.position.set(-100, 100, 100);
        scene.add(light1);

        var light2 = new THREE.PointLight(0x888888);
        light2.position.set(100, 100, -100);
        scene.add(light2);

        var light3 = new THREE.PointLight(0x888888);
        light3.position.set(-100, 100, -100);
        scene.add(light3);

        var light4 = new THREE.PointLight(0x888888);
        light4.position.set(100, 100, 100);
        scene.add(light4);

        // todo
        var building = new Logic.Building(10, 16, 10);
        scene.add(building.getMesh());
        // todo

        controls = new THREE.OrbitControls(camera, renderer.domElement);

        animationController = new Logic.AnimationController(new THREE.Clock(), scene);
    }

    function animate() {
        requestAnimationFrame(animate);

        animationController.animate();

        renderer.render(scene, camera);
        controls.update();
    }
});

