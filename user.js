// ==UserScript==
// @name         Shellshock.io Cheat Script (No Ads) Aimbot and ESP (11 Feb)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Wallhack, that shows eggs behind walls and aimbot
// @author       Zertalious (Zert)
// @match        *://shellshock.io/*
// @match        *://algebra.best/*
// @match        *://algebra.vip/*
// @match        *://biologyclass.club/*
// @match        *://deadlyegg.com/*
// @match        *://deathegg.world/*
// @match        *://eggcombat.com/*
// @match        *://egg.dance/*
// @match        *://eggfacts.fun/*
// @match        *://egghead.institute/*
// @match        *://eggisthenewblack.com/*
// @match        *://eggsarecool.com/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://hardboiled.life/*
// @match        *://hardshell.life/*
// @match        *://humanorganising.org/*
// @match        *://mathdrills.info/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @match        *://mathlete.fun/*
// @match        *://mathlete.pro/*
// @match        *://overeasy.club/*
// @match        *://scrambled.best/*
// @match        *://scrambled.tech/*
// @match        *://scrambled.today/*
// @match        *://scrambled.us/*
// @match        *://scrambled.world/*
// @match        *://shellshockers.club/*
// @match        *://shellshockers.site/*
// @match        *://shellshockers.us/*
// @match        *://shellshockers.world/*
// @match        *://softboiled.club/*
// @match        *://violentegg.club/*
// @match        *://violentegg.fun/*
// @match        *://yolk.best/*
// @match        *://yolk.life/*
// @match        *://yolk.rocks/*
// @match        *://yolk.tech/*
// @match        *://zygote.cafe/*
// @icon         https://www.google.com/s2/favicons?domain=shellshock.io
// @grant        none
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.19
// ==/UserScript==
 
const mainwin = {};



 
window.XMLHttpRequest = class extends window.XMLHttpRequest {
 
	open( method, url ) {
 
		if ( url.indexOf( 'shellshock.js' ) > - 1 ) {
 
			this.isScript = true;
 
		}
 
		return super.open( ...arguments );
 
	}
 
	get response() {
 
		if ( this.isScript ) {
 
			const code = super.response;

 
			let babylonVarName,
				playersVarName,
				myPlayerVarName,
				sceneVarName,
				cullFuncName;
 
			try {
 
				babylonVarName = /crosshairs=new ([a-zA-Z]+)\.AbstractMesh/.exec( code )[ 1 ];
				playersVarName = /=([a-zA-Z]+)\[this\.playerIdx\];/.exec( code )[ 1 ];
				myPlayerVarName = /"fire":document.pointerLockElement&&([^&]+)&&/.exec( code )[ 1 ];
				sceneVarName = /createMapCells\(([^,]+),/.exec( code )[ 1 ];
				cullFuncName = /=([a-zA-Z_$]+)\(this\.([a-zA-Z_$]+),\.[0-9]+\)/.exec( code )[ 1 ];
 
				mainwin.MeshBuilder = /\.([a-zA-Z_$]+)\.CreateBox/.exec( code )[ 1 ];
				mainwin.CreateLines = /\.([a-zA-Z_$]+)\("",{po/.exec( code )[ 1 ];
				mainwin.Vector3 = /v1=new [a-zA-Z_$]+\.([a-zA-Z_$]+)/.exec( code )[ 1 ];
				mainwin.actor = /this\.([a-zA-Z_$]+)\.[a-zA-Z_$]+\.position,!/.exec( code )[ 1 ];
				mainwin.playing = /OPEN&&[a-zA-Z_$]+\.([a-zA-Z_$]+)/.exec( code )[ 1 ];
 
				mainwin.yaw = /\.([a-zA-Z_$]+)=[a-zA-Z_$]+\.yaw/.exec( code )[ 1 ];
				mainwin.pitch = /\.([a-zA-Z_$]+)=[a-zA-Z_$]+\.pitch/.exec( code )[ 1 ];
				mainwin.mesh = /this\.([a-zA-Z_$]+)\.setVisible\(/.exec( code )[ 1 ];
 
			} catch ( error ) {
 
				alert( 'Script failed to inject. Report the issue to the script developer.\n' + JSON.stringify( getVars(), undefined, 2 ) );
 
				return code;
 
			}
 
			function getVars() {
 
				return {
					babylonVarName,
					playersVarName,
					myPlayerVarName,
					playersVarName,
					sceneVarName,
					cullFuncName,
					mainwin
				};
 
			}
 
			console.log( '%cInjecting code...', 'color: red; background: black; font-size: 2em;', getVars() );
 
			return code.replace( sceneVarName + '.render()', `
 
					window[ '${onUpdateFuncName}' ]( 
						${babylonVarName}, 
						${playersVarName}, 
						${myPlayerVarName}
					);
 
				${sceneVarName}.render()` )
				.replace( `function ${cullFuncName}`, `
 
					function ${cullFuncName}() {
 
						return true;
 
					}
 
				function someFunctionWhichWillNeverBeUsedNow` );
 
		}
 
		return super.response;
 
	}
 
};
 
const settings = {
	espEnabled: true, 
	showLines: true,
	aimbotEnabled: true,
	aimbotOnRightMouse: true,
	showHelp() {
 
		dialogEl.style.display = dialogEl.style.display === '' ? 'none' : '';
 
	}
};
 
const keyToSetting = {
	'KeyB': 'aimbotEnabled', 
	'KeyV': 'espEnabled', 
	'KeyN': 'showLines', 
	'KeyL': 'aimbotOnRightMouse'
};
 
let gui, controllers;
 
function initGui() {
 
	const settingToKey = {};
	for ( const key in keyToSetting ) {
 
		settingToKey[ keyToSetting[ key ] ] = key;
 
	}
 
	gui = new lil.GUI();
	controllers = {};
	for ( const key in settings ) {
 
		let name = fromCamel( key );
		let shortKey = settingToKey[ key ];
 
		if ( shortKey ) {
 
			if ( shortKey.startsWith( 'Key' ) ) shortKey = shortKey.slice( 3 );
			name = `[${shortKey}] ${name}`;

 
		}
 
		controllers[ key ] = gui.add( settings, key ).name( name ).listen();
 
	}
 
	const titleEl = gui.domElement.querySelector( '.title' );
	titleEl.innerText = `[/] Controls`;
 
	gui.domElement.style.zIndex = '99999';
 
}
 
function fromCamel( text ) {
 
	const result = text.replace( /([A-Z])/g, ' $1' );
	return result.charAt( 0 ).toUpperCase() + result.slice( 1 );
 
}
 
const temp = document.createElement( 'div' );
 
temp.innerHTML = `<style>
 
.info {
	position: absolute;
	left: 50%;
	top: 50%;
	padding: 20px;
	background: rgba(0, 0, 0, 0.8);
	border: 6px solid rgba(0, 0, 0, 0.2);
	color: #fff;
	transform: translate(-50%, -50%);
	text-align: center;
	z-index: 999999;
	font-weight: bolder;
}
 
.info * {
	color: #fff;
}
 
.close-icon {
	position: absolute;
	right: 5px;
	top: 5px;
	width: 20px;
	height: 20px;
	opacity: 0.5;
	cursor: pointer;
}
 
.close-icon:before, .close-icon:after {
	content: ' ';
	position: absolute;
	left: 50%;
	top: 50%;
	width: 100%;
	height: 20%;
	transform: translate(-50%, -50%) rotate(-45deg);
	background: #fff;
}
 
.close-icon:after {
	transform: translate(-50%, -50%) rotate(45deg);
}
 
.close-icon:hover {
	opacity: 1;
}
 
.btn {
	cursor: pointer;
	padding: 0.5em;
	background: red;
	border: 3px solid rgba(0, 0, 0, 0.2);
}
 
.btn:active {
	transform: scale(0.8);
}
 
.msg {
    position: absolute;
    left: 50%;
    bottom: 20px; /* Adjust this value to control the vertical position */
    transform: translateX(-50%);
    color: #fff;
    background: rgb(3, 5, 10);
    font-weight: bolder;
    padding: 15px;
    animation: popup 0.5s forwards, popup 0.5s reverse forwards 3s;
    z-index: 999999;
    pointer-events: none;
    border-radius: 10px;
}
 
@keyframes msg {
    from {
        transform: translateY(150%);
    }

    to {
        transform: none;
    }
}
 


	.lil-gui {
	    --title-background-color: #030717 !important;
	    --hover-color: #ffffff !important;
	    --background-color: #02060e !important;
	    --widget-color: #2b3059 !important;
	}
	.lil-gui.root.allow-touch-styles.autoPlace {
	    border-radius: 6px !important;
	}
 
	.my-lil-gui-desc {
		font-size: 0.8em;
		opacity: 0.8;
		max-width: 100px;
		line-height: 1;
		white-space: normal !important;
	}


</style>

<div class="msg" style="display: none;"></div>
<div class="helpbox" id="dialogcontrol"><div class="close" onclick="this.parentNode.style.display='none';"></div>
<img src="https://i.imgur.com/P77vcpI.png" alt="BY FOCHOMOCHO">
    <div class="clearfix">
    <p class="left">Status: <span style="color: lightgreen;">Working</span></p>
    <p class="right">V1.0.1</p>
  </div>
  <div style="display: flex; flex-wrap: wrap; justify-content: center;">

  <div style="border: 1px solid lightgreen; padding: 10px; margin-right: 10px; display: flex; align-items: center;">
      <img src="https://i.imgur.com/4tFnsO9.png" alt="[B]" style="height: 20px; width: 20px; margin-right: 10px;">
      <p id="aimbot" style="color: lightgreen; margin: 0;">Aimbot</p>
  </div>

  <div style="border: 1px solid lightgreen; padding: 10px; margin-right: 10px; display: flex; align-items: center;">
      <img src="https://i.imgur.com/pIaF8kH.png" alt="[V]" style="height: 20px; width: 20px; margin-right: 10px;">
      <p id="esp" style="color: lightgreen; margin: 0;">ESP</p>
  </div>

</div>
<br>
<div style="display: flex; flex-wrap: wrap; justify-content: center;">

  <div style="border: 1px solid lightgreen; padding: 10px; margin-right: 10px; display: flex; align-items: center;">
      <img src="https://i.imgur.com/oIStPY3.png" alt="[N]" style="height: 20px; width: 20px; margin-right: 10px;">
      <p id="line" style="color: lightgreen; margin: 0;">Lines</p>
  </div>

  <div style="border: 1px solid lightgreen; padding: 10px; display: flex; align-items: center;">
      <img src="https://i.imgur.com/lbEgxGX.png" alt="[L]" style="height: 20px; width: 20px; margin-right: 10px;">
      <p id="em" style="color: lightgreen; margin: 0;">Right mouse Aimbot</p>
  </div>

</div>

    <p id="hide">[K] Hide & Show</p>
    <br>
    <br>
    <p>Consider joining my <u><a href="https://discord.gg/vt3S7NrQRk" target="_blank" style="color: #3072db;">Discord</a></u> for regular updates. This script may go down due to third-party actions.</p>

    <img src="https://i.imgur.com/hpcqGTm.gif" alt="Connection Issue Occurred!" style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); border-radius: 10px; width: 50%; height: auto; z-index: 99999999999; margin-bottom: -20%;">
</div>
<style>

.helpbox {
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 21px;
    background: rgb(21 21 21);
    border: 6px solid rgba(0, 0, 0, 0.2);
    color: #fff;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 999999;
    border-radius: 10px;
}

.helpbox * {
    color: #fff;
}

.close {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
    cursor: pointer;
}

.close:before, .close:after {
    content: ' ';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 20%;
    transform: translate(-50%, -50%) rotate(-45deg);
    background: #fff;
}

.close:after {
    transform: translate(-50%, -50%) rotate(45deg);
}

.close:hover {
    opacity: 1;
}

.btn {
    cursor: pointer;
    padding: 0.5em;
    background: red;
    border: 3px solid rgba(0, 0, 0, 0.2);
}

.btn:active {
    transform: scale(0.8);
}

.popup {
    position: absolute;
    left: 50%;
    bottom: 20px; /* Adjust this value to control the vertical position */
    transform: translateX(-50%);
    color: #fff;
    background: rgb(3, 5, 10);
    font-weight: bolder;
    padding: 15px;
    animation: popup 0.5s forwards, popup 0.5s reverse forwards 3s;
    z-index: 999999;
    pointer-events: none;
    border-radius: 10px;
}

@keyframes popup {
    from {
        transform: translateY(150%);
    }

    to {
        transform: none;
    }
}

.left {
    float: left;
}

.right {
    float: right;
}

.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

</style>`;
 
const msgEl = temp.querySelector( '.msg' );
const dialogEl = temp.querySelector( '.info' );
 
window.addEventListener( 'DOMContentLoaded', async function () {
 
	initGui();
 
	while ( temp.children.length > 0 ) {
 
		document.body.appendChild( temp.children[ 0 ] );
 
	}
 
 
 
} );
 
let rightMouseDown = false;


 
function handleMouse( event ) {
 
	if ( event.button === 2 ) {
 
		rightMouseDown = event.type === 'pointerdown' ? true : false;
 
	}
 
}
 
window.addEventListener( 'pointerdown', handleMouse );
window.addEventListener( 'pointerup', handleMouse );
 
 
function toggleSetting( key ) {
 
	settings[ key ] = ! settings[ key ];
	showMsg( fromCamel( key ), settings[ key ] );
 
}
 
window.addEventListener( 'keyup', function ( event ) {
 
	if ( document.activeElement && document.activeElement.tagName === 'INPUT' ) return;
 
	if ( keyToSetting[ event.code ] ) {
 
		toggleSetting( keyToSetting[ event.code ] );
 
	}
 
	switch ( event.code ) {
 
		case 'KeyH':
			settings.showHelp();
			break;
 
		case 'Slash' :
			gui._hidden ? gui.show() : gui.hide();
			break;
 
	}
 
} );


// Assuming you have a reference to the canvas or the document
// Replace 'canvas' with the appropriate element if needed
document.addEventListener("keydown", function (event) {
    // Check if the pressed key is 'X'
    if (event.key === 'X') {
        // Change the box color to a new color
        player.sphere.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    }
});

 
function showMsg( name, bool ) {
 
	msgEl.innerText = name + ': ' + ( bool ? 'ON' : 'OFF' );
 
	msgEl.style.display = 'none';
	void msgEl.offsetWidth;
	msgEl.style.display = '';
 
}
 
let lineOrigin, linesArray;
 
const onUpdateFuncName = btoa( Math.random().toString( 32 ) );
 
window[ onUpdateFuncName ] = function ( BABYLON, players, myPlayer ) {
 
	if ( ! myPlayer ) {
 
        return;
 
    } 
 
	if ( ! lineOrigin ) {
 
		lineOrigin = new BABYLON[ mainwin.Vector3 ]();
		linesArray = [];
 
		console.log( lineOrigin );
 
	}
 
	lineOrigin.copyFrom( myPlayer[ mainwin.actor ][ mainwin.mesh ].position );
 
	const yaw = myPlayer[ mainwin.actor ][ mainwin.mesh ].rotation.y;
 
	lineOrigin.x += Math.sin( yaw );
	lineOrigin.z += Math.cos( - myPlayer[ mainwin.pitch ] );
	lineOrigin.y += Math.sin( - myPlayer[ mainwin.pitch ] ) -1;
 
	for ( let i = 0; i < linesArray.length; i ++ ) {
 
		linesArray[ i ].playerExists = false;
 
	}
 
	for ( let i = 0; i < players.length; i ++ ) {
 
		const player = players[ i ];
 
		if ( ! player || player === myPlayer ) continue;
 
if (player.sphere === undefined) {

    console.log('Adding sphere...');

    const material = new BABYLON.StandardMaterial('myMaterial', player[mainwin.actor].scene);
    material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    material.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    material.alpha = 0.7; // Set alpha to 0.7 for 30% transparency

    const sphere = BABYLON[mainwin.MeshBuilder].CreateBox('mySphere', { width: 0.5, height: 0.75, depth: 0.5 }, player[mainwin.actor].scene);
    sphere.material = material;
    sphere.position.y = 0.3;
    sphere.parent = player[mainwin.actor][mainwin.mesh];
    sphere.renderingGroupId = 1;

    player.sphere = sphere;

}

 
		if ( player.lines === undefined ) {
 
			const options = {
				points: [ lineOrigin, player[ mainwin.actor ][ mainwin.mesh ].position ],
				updatable: true
			};
 
			const lines = options.instance = BABYLON[ mainwin.MeshBuilder ][ mainwin.CreateLines ]( 'lines', options, player[ mainwin.actor ].scene );
			lines.color = new BABYLON.Color3( 1, 0, 0 );
			lines.alwaysSelectAsActiveMesh = true;
			lines.renderingGroupId = 1;
			lines.alpha = 0.3;
 
			player.lines = lines;
			player.lineOptions = options;
 
			linesArray.push( lines );
 
			console.log( '%cAdding line...', 'color: green; background: black; font-size: 2em;' );
 
		}
 
		player.lines.playerExists = true;
		player.lines = BABYLON[ mainwin.MeshBuilder ][ mainwin.CreateLines ]( 'lines', player.lineOptions );
 
		const isEnemy = myPlayer.team === 0 || myPlayer.team !== player.team;
		player.sphere.visibility = settings.espEnabled && isEnemy;
		player.lines.visibility = settings.showLines && player[ mainwin.playing ] && isEnemy;
 
	}
 
	for ( let i = 0; i < linesArray.length; i ++ ) {
 
		if ( ! linesArray[ i ].playerExists ) {
 
			console.log( '%cRemoving line...', 'color: red; background: black; font-size: 2em;' );
 
			linesArray[ i ].dispose();
			linesArray.splice( i, 1 );
 
		}
 
	}
 
	if ( settings.aimbotEnabled && ( settings.aimbotOnRightMouse ? rightMouseDown : true ) && myPlayer[ mainwin.playing ] ) {
 
		let minDistance = Infinity;
		let targetPlayer;
 
		for ( let i = 0; i < players.length; i ++ ) {
 
			const player = players[ i ];
 
			if ( player && player !== myPlayer && player[ mainwin.playing ] && ( myPlayer.team === 0 || player.team !== myPlayer.team ) ) {
 
				const distance = Math.hypot( 
					getPos( player, 'x' ) - getPos( myPlayer, 'x' ), 
					getPos( player, 'y' ) - getPos( myPlayer, 'y' ), 
					getPos( player, 'z' ) - getPos( myPlayer, 'z' ) 
				);
 
				if ( distance < minDistance ) {
 
					minDistance = distance;
					targetPlayer = player;
 
				}
 
			}
 
		}
 
		if ( targetPlayer ) {
 
			const x = getPos( targetPlayer, 'x' ) - getPos( myPlayer, 'x' );
			const y = getPos( targetPlayer, 'y' ) - getPos( myPlayer, 'y' );
			const z = getPos( targetPlayer, 'z' ) - getPos( myPlayer, 'z' );
 
			myPlayer[ mainwin.yaw ] = Math.radAdd( Math.atan2( x, z ), 0 );
			myPlayer[ mainwin.pitch ] = - Math.atan2( y, Math.hypot( x, z ) ) % 1.5;
 
		}
 
	}
 
}
 
function getPos( player, component ) {
 
	return player[ mainwin.actor ][ mainwin.mesh ].position[ component ];
 
}
 



delete localStorage[ 'lastVersionPlayed' ];


