var noise = new SimplexNoise();
var vizInit = function () {
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  var fileLabel = document.querySelector("label.file");

  document.onload = function (e) {
    console.log(e);
    audio.play();
    play();
  };

  file.onchange = function () {
    fileLabel.classList.add('normal');
    audio.classList.add('active');
    var files = this.files;

    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    play();
  };

  function play() {
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 512;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);
    camera.lookAt(scene.position);
    
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create a particle system
    var particleCount = 1000;
    var positions = new Float32Array(particleCount * 3);
    var colors = new Float32Array(particleCount * 3);
    var sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions.set([Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10], i * 3);
      colors.set([Math.random(), Math.random(), Math.random()], i * 3); // Random colors
      sizes[i] = Math.random() * 5; // Random sizes
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    var material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });

    var particles = new THREE.Points(geometry, material);
    scene.add(particles);

    var ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    document.getElementById('out').appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    render();

    function render() {
      analyser.getByteFrequencyData(dataArray);

      // Update particles based on audio frequency data
      for (let i = 0; i < particleCount; i++) {
        var index = i * 3;
        var position = new THREE.Vector3(
          positions[index],
          positions[index + 1],
          positions[index + 2]
        );

        var frequencyValue = dataArray[Math.floor(i / particleCount * bufferLength)];
        var distance = Math.sin(frequencyValue / 255 * Math.PI) * 10; // Modulate distance based on frequency

        position.y += distance; // Move particles up/down based on frequency
        positions[index + 1] = position.y;

        // Update color based on frequency
        colors[index] = frequencyValue / 255; // Red
        colors[index + 1] = 0; // Green
        colors[index + 2] = (255 - frequencyValue) / 255; // Blue
      }

      // Update geometry attributes
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    audio.play();
  };
};

window.onload = vizInit();

document.body.addEventListener('touchend', function (ev) { context.resume(); });

