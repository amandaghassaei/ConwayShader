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

    // Create a buffer and put a single clipspace rectangle in
    // it (2 triangles)
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
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