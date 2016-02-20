/**
 * Created by ghassaei on 2/20/16.
 */


var gl;
var canvas;
var buffer;

var shaderScript;
var shaderSource;
var vertexShader;
var fragmentShader;


window.onload = init;

function init() {

    canvas = document.getElementById('glcanvas');
    gl = canvas.getContext('experimental-webgl');

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1.0, -1.0,
           1.0, -1.0,
          -1.0,  1.0,
          -1.0,  1.0,
           1.0, -1.0,
           1.0,  1.0]),
        gl.STATIC_DRAW
    );

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    //shaderScript = document.getElementById("2dVertexShader");
    //shaderSource = shaderScript.text;
    //vertexShader = gl.createShader(gl.VERTEX_SHADER);
    //gl.shaderSource(vertexShader, shaderSource);
    //gl.compileShader(vertexShader);
    //
    //var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    //if (!compiled) console.error(gl.getShaderInfoLog(vertexShader));
    //
    //shaderScript   = document.getElementById("2dFragmentShader");
    //shaderSource   = shaderScript.text;
    //fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    //gl.shaderSource(fragmentShader, shaderSource);
    //gl.compileShader(fragmentShader);
    //
    //var compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
    //if (!compiled) console.error(gl.getShaderInfoLog(fragmentShader));


    var program = createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);
    gl.useProgram(program);


    //cubeTexture = gl.createTexture();
    //cubeImage = new Image();
    //cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
    //cubeImage.src = "texture.jpg";


    render();
}

function handleTextureLoaded(image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function render() {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //positionLocation = gl.getAttribLocation(program, "a_position");
    //gl.enableVertexAttribArray(positionLocation);
    //gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    window.requestAnimationFrame(render, canvas);

}