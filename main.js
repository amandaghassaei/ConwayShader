/**
 * Created by ghassaei on 2/20/16.
 */


var gl;
var canvas;
var lastState;
var currentState;
var frameBuffer;

var width;
var height;

var flipYLocation;

window.onload = initGL;

function initGL() {

    // Get A WebGL context
    canvas = document.getElementById("glcanvas");
    canvas.width = 400;
    canvas.height = 300;
    canvas.clientWidth = 400;
    canvas.clientHeight = 300;
    gl = canvas.getContext("experimental-webgl");
    if (!gl) {
        alert('Could not initialize WebGL, try another browser');
        return;
    }

    gl.disable(gl.DEPTH_TEST);

    var devicePixelRatio = window.devicePixelRatio || 1;
    width = canvas.clientWidth * devicePixelRatio;
    height = canvas.clientHeight * devicePixelRatio;

    // setup a GLSL program
    var program = createProgramFromScripts(gl, "2d-vertex-shader", "2d-fragment-shader");
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // Create a buffer for positions
    var bufferPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferPos);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0]), gl.STATIC_DRAW);


    //flip y
    flipYLocation = gl.getUniformLocation(program, "u_flipY");


    //set texture location
    var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    var textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
    // set the size of the texture
    gl.uniform2f(textureSizeLocation, width, height);

    // provide texture coordinates for the rectangle.
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);


    //texture for saving output from frag shader
    currentState = makeTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    lastState = makeTexture(gl);
    //fill with random pixels
    var rgba = new Uint8Array(width*height*4);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, makeRandomArray(rgba));

    frameBuffer = gl.createFramebuffer();

    gl.bindTexture(gl.TEXTURE_2D, lastState);//original texture

    this.render();
}

function makeRandomArray(rgba){
    var numPixels = rgba.length/4;
    var probability = 0.2;
    for (var i=0;i<numPixels;i++) {
        var ii = i * 4;
        var state = Math.random() < probability ? 1 : 0;
        rgba[ii] = rgba[ii + 1] = rgba[ii + 2] = state ? 255 : 0;
        rgba[ii + 3] = 255;
    }
    return rgba;
}

function makeTexture(gl){

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    texture.height = canvas.height;
    texture.width = canvas.width;

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
}

function render(){

    //for (var i=1;i<10;i++){
    //    step();
    //}
    // don't y flip images while drawing to the textures
    gl.uniform1f(flipYLocation, 1);

    step();


    gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas
    gl.bindTexture(gl.TEXTURE_2D, lastState);


    //draw to canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //gl.viewport(0, 0, width, height);
    gl.bindTexture(gl.TEXTURE_2D, lastState);
    gl.drawArrays(gl.TRIANGLES, 0, 6);



    window.requestAnimationFrame(render);
}

function step(){
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, currentState, 0);

    gl.bindTexture(gl.TEXTURE_2D, lastState);
    //gl.viewport(0, 0, width, height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);//draw to framebuffer

    var temp = lastState;
    lastState = currentState;
    currentState = temp;
}