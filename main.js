/**
 * Created by ghassaei on 2/20/16.
 */


var gl;
var canvas;

window.onload = init;

function init() {

    // Get A WebGL context
    var canvas = document.getElementById("glcanvas");
    var gl = canvas.getContext("experimental-webgl");
    if (!gl) return;
    gl.imageSmoothingEnabled= false;

    // setup a GLSL program
    var program = createProgramFromScripts(gl, "2d-vertex-shader", "2d-fragment-shader");
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // set the resolution
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    var colorLocation = gl.getAttribLocation(program, "a_color");

    // lookup uniforms
    //var matrixLocation = gl.getUniformLocation(program, "u_matrix");


    // draw 50 random rectangles in random colors
    for (var ii = 0; ii < 50; ++ii) {
        // Setup a random rectangle
        // Create a buffer for positions
        var bufferPos = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferPos);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);


        setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));

        // Create a buffer for the colors.
        var bufferColor = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferColor);
        gl.enableVertexAttribArray(colorLocation);
        gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

        // Set a random color.
        setColors(gl);

        // Draw the rectangle.
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
    return Math.floor(Math.random() * range);
}

function setColors(gl) {
  // Pick 2 random colors.
  var r1 = Math.random();
  var b1 = Math.random();
  var g1 = Math.random();
  var r2 = Math.random();
  var b2 = Math.random();
  var g2 = Math.random();
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        [ Math.random(), Math.random(), Math.random(), 1,
          Math.random(), Math.random(), Math.random(), 1,
          Math.random(), Math.random(), Math.random(), 1,
          Math.random(), Math.random(), Math.random(), 1,
          Math.random(), Math.random(), Math.random(), 1,
          Math.random(), Math.random(), Math.random(), 1]),
      gl.STATIC_DRAW);
}

// Fills the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}

//function handleTextureLoaded(image, texture) {
//    gl.bindTexture(gl.TEXTURE_2D, texture);
//    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
//    gl.generateMipmap(gl.TEXTURE_2D);
//    gl.bindTexture(gl.TEXTURE_2D, null);
//}
//
//function render() {
//
//    gl.clearColor(0.0, 0.0, 0.0, 1.0);
//    gl.clear(gl.COLOR_BUFFER_BIT);
//
//    //positionLocation = gl.getAttribLocation(program, "a_position");
//    //gl.enableVertexAttribArray(positionLocation);
//    //gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
//
//    gl.drawArrays(gl.TRIANGLES, 0, 6);
//
//    window.requestAnimationFrame(render, canvas);
//
//}