var gui;
var gradient = ['linear','cubic','quintic','sigmoid','quantize'];
var sigmoidSteepness = 0;
var colors = [];
var gilbertBakerColors = [];
var rainfall = 10;
var pointSize = 10;
var harmonizeColors = 70;
var colorModel = ['CMYK','RGB'];
var edgeRollToMagenta = true;
var shape = ['circle','square','pixel'];
var dither = 10;
var oldPointSize = -1;
var opacity = 50;
var button1 = function(){console.log('hi there');};
function setup() {
    // put setup code here

    colorsMagenta = [
	new Cmyk(0.0, 1.0, 0.0, 0.0 ), ///magenta
	new Cmyk(0.0, 0.7, 0.7, 0.1 ), //red
	new Cmyk(0.0, 0.5, 1.0, 0.1 ), //orange
	new Cmyk(0.0, 0.2, 1.0, 0.2 ), //yellow
	new Cmyk(0.5, 0.2, 0.75, 0.2 ), //green
	new Cmyk(0.5, 0.5, 0.1, 0.1 ), //blue
	new Cmyk(0.4, 0.7, 0.1, 0.0 ), //violet
	new Cmyk(0.0, 1.0, 0.0, 0.0 ) //magenta
    ];
    
    colors = [
	new Cmyk(0.0, 0.7, 0.7, 0.1 ), ///red
	new Cmyk(0.0, 0.7, 0.7, 0.1 ), //red
	new Cmyk(0.0, 0.5, 1.0, 0.1 ), //orange
	new Cmyk(0.0, 0.2, 1.0, 0.2 ), //yellow
	new Cmyk(0.5, 0.2, 0.75, 0.2 ), //green
	new Cmyk(0.5, 0.5, 0.1, 0.1 ), //blue
	new Cmyk(0.4, 0.7, 0.1, 0.0 ), //violet
	new Cmyk(0.4, 0.7, 0.1, 0.0 ) //violet
    ];


    gilbertBakerColors = [
	new Cmyk(0.0, 1.0, 1, 0.0), //red
	new Cmyk(0.0, 1.0, 1, 0.0), //red
	new Cmyk(0.0, 0.5, 1, 0.1), //orange
	new Cmyk(0.0, 0.0, 1, 0.2), //yellow
	new Cmyk(1.0, 0.0, 1, 0.3), //green
	new Cmyk(1.0, 1.0, 0, 0.2), //blue
	new Cmyk(0.4, 1.0, 0, 0.1), //purple
	new Cmyk(0.4, 1.0, 0, 0.1) //purple
    ];
    
    gilbertBakerColorsMagenta = [
	new Cmyk(0.0, 1.0, 0, 0.0), //red
	new Cmyk(0.0, 1.0, 1, 0.0), //red
	new Cmyk(0.0, 0.5, 1, 0.1), //orange
	new Cmyk(0.0, 0.0, 1, 0.2), //yellow
	new Cmyk(1.0, 0.0, 1, 0.3), //green
	new Cmyk(1.0, 1.0, 0, 0.2), //blue
	new Cmyk(0.4, 1.0, 0, 0.1), //purple
	new Cmyk(0.0, 1.0, 0, 0.0) //purple
    ];


    createCanvas(windowWidth, windowHeight);
    background(128);
    
    gui = createGui('prideFlag');
    gui.addGlobals(
	'pointSize',
	'shape',
	'opacity',
	'rainfall',
	'harmonizeColors',
	'colorModel',
	'edgeRollToMagenta',
	'dither',
	'gradient',
	'sigmoidSteepness'
    );

    gui.prototype.addButton( "more..." , function(elmt){
	window.open('http://jtn.im/projects.php');
    });
}


function rampLinear(t, b, c) {
    return b + c * t;
}

function rampInOutCubic(t, b, c) {
    var ts = t * t;
    var tc = ts * t;
    return b+c*(-2*tc+3*ts);
}

function rampInOutQuintic(t, b, c) {
    var ts = t * t;
    var tc = ts * t;
    return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
}


function rampSigmoid(t,b,c){
    return b + c * (1-1.0/(1.0+pow(Math.E,(12+sigmoidSteepness) * (t-0.5))));
}

function rampQuantize(t,b,c){
    return b + c * round(t);
}


function getGradientFunc(){
    switch(gradient){
    case 'linear': return rampLinear;
    case 'cubic': return rampInOutCubic;
    case 'quintic': return rampInOutQuintic;
    case 'sigmoid': return rampSigmoid;
    case 'quantize': return rampQuantize;
    default: return rampLinear;
    }
}

function getStripOffsetPerGradientFunc(){
    switch(gradient){
    case 'cubic':
    case 'linear':
    default:
	return 0.5;
    }
}

function draw() {

    if(pointSize != oldPointSize && isPixelMode()){
	loadPixels();
    }
    
    noFill();
    var h6 = height/6.0;
    var hh6 = h6 * getStripOffsetPerGradientFunc();
    //var hh6 = 0;
    var inc = 1/6.0;
    for (var i=0; i<7; i++) for(var ii=0;ii<rainfall * 10;ii++){
	var j = random(h6);
	var k = random(width);// x-position
	var ditherOffset;
	
	ditherOffset = random(-h6/4,h6/4) * (dither/10.0);
	
	var yPos = i*h6 - hh6 + j + ditherOffset;

	var clrs = colors;
	if(edgeRollToMagenta)clrs = colorsMagenta;

	var bakers = gilbertBakerColors;
	if(edgeRollToMagenta)bakers = gilbertBakerColorsMagenta;

	var lerpVal = j/h6;
	if(colorModel=='CMYK'){
	    var c = clrs[i].lerp( clrs[i+1], lerpVal, getGradientFunc() );
	    var c2 = bakers[i].lerp( bakers[i+1], lerpVal, getGradientFunc() );
	    c = c2.lerp(c, harmonizeColors / 100.0 , rampLinear ).toColor(opacity * 2.55);
	}else{
	    var c = clrs[i].toRgb().lerp( clrs[i+1].toRgb(), lerpVal, getGradientFunc() );
	    var c2 = bakers[i].toRgb().lerp( bakers[i+1].toRgb(), lerpVal, getGradientFunc() );
	    c = c2.lerp(c, harmonizeColors / 100.0 , rampLinear ).toColor(opacity * 2.55);
	}
	
	if(isPixelMode()){
	    set(k,round(yPos),c);
	}else{
	    noStroke();
	    fill(c);
	    
	    switch(shape){
	    case 'circle':
		ellipse(k,round(yPos),pointSize,pointSize);
		break;
	    case 'square':
		rect(k,round(yPos),pointSize,pointSize);
		break;
	    case 'pixel':
		set(k,round(yPos),c);
	    }
	}
    }
    
    if(isPixelMode())updatePixels();

    
    oldPointSize = pointSize;
}


function isPixelMode(){
    return size <= 1 || shape == 'pixel';
}

// dynamically adjust the canvas to the window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(128);
    
}
