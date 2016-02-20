/**
 * Created by ghassaei on 2/20/16.
 */


var gl;
var canvas;

window.onload = init;

function init() {
  var image = new Image();
  image.src = "bitmap.png";
  image.onload = function() {
    initGL(image);
  }
}

function initGL(image) {

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


    //// set the resolution
    //var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    //gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    // Create a buffer for positions
    var bufferPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPos);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0]), gl.STATIC_DRAW);


    //set texture location
    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
    // set the size of the image
    gl.uniform2f(textureSizeLocation, image.width, image.height);

    // provide texture coordinates for the rectangle.
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Create a texture.
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);


    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}