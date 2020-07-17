var HeptiHex = HeptiHex || {};

//CONSTANTS
HeptiHex.DEBUG_MODE = true;
HeptiHex.LOCAL_TICK_RATE = 1000/60;

HeptiHex.start = function() {
	HeptiHex.KeyHandler.init();
	HeptiHex.Screen.init();
	HeptiHex.Screen.setMenuContainer(new HeptiHex.UI.MainMenuContainer());
}

/** Dictates what happens when keys are pressed
 */
HeptiHex.KeyHandler = {
	
	/** Matches enum types with key codes.
	 */
	KeyBinds : {
	
		right : 68, //d
		left : 65, //a
		up : 87, // w
		down : 83, //s
		rotateRight : 39, //right arrow
		rotateLeft : 37, //left arrow
		selectItem : 32 // space
	
	},
	
	/** Enables key input to the screen
	 */
	init : function() {
		
		document.body.addEventListener("keydown", function(keyEvent) {
	
			var menuContainer = HeptiHex.Screen.getMenuContainer();
	
			if(menuContainer != undefined)
				menuContainer.KeyHandler.keyDown.call(menuContainer, keyEvent);
			
		});
		
		document.body.addEventListener("keyup", function(keyEvent) {
			
			var menuContainer = HeptiHex.Screen.getMenuContainer();
	
			if(menuContainer != undefined)
				menuContainer.KeyHandler.keyUp.call(menuContainer, keyEvent);
			
		});
	}
};

/** User Interface object. Stores all user interface related classes, and interfaces.
 */
HeptiHex.UI = {};

	/** Container for GameUIs and other GameUIContainers. Containers are added to the game by using Screen.addMenuContainer()
	 */
	HeptiHex.UI.GameUIContainer = function() {};

		HeptiHex.UI.GameUIContainer.prototype.uis = [];
		
		HeptiHex.UI.GameUIContainer.prototype.addUI = function(ui) {
			ui.parentContainer = this;
			this.uis.push(ui);
		};
		
		HeptiHex.UI.GameUIContainer.prototype.removeUI = function(ui) {
			var uiIndex = this.uis.indexOf(ui)
			this.uis.splice(uiIndex);
		};
		
		HeptiHex.UI.GameUIContainer.prototype.KeyHandler = {};
		
		HeptiHex.UI.GameUIContainer.prototype.KeyHandler.keyUp = function(keyEvent) {
			var uis = [];
			
			for(var i=0; i<this.uis.length; i++) {
				if(this.isVisible(this.uis[i])) {
					uis.push(this.uis[i]);
				}
			}
			
			for(var i=0; i<uis.length; i++) {
				if(this.isVisible(uis[i])) {
					uis[i].KeyHandler.keyUp.call(uis[i], keyEvent);
				}
			}
		};
		HeptiHex.UI.GameUIContainer.prototype.KeyHandler.keyDown = function(keyEvent) {
			var uis = [];
			
			for(var i=0; i<this.uis.length; i++) {
				if(this.isVisible(this.uis[i])) {
					uis.push(this.uis[i]);
				}
			}
			
			for(var i=0; i<uis.length; i++) {
				if(this.isVisible(uis[i])) {
					uis[i].KeyHandler.keyDown.call(uis[i], keyEvent);
				}
			}
		};
		HeptiHex.UI.GameUIContainer.prototype.tick = function() {
			var uis = [];
			
			for(var i=0; i<this.uis.length; i++) {
				if(this.isVisible(this.uis[i])) {
					uis.push(this.uis[i]);
				}
			}
			
			for(var i=0; i<uis.length; i++) {
				if(this.isVisible(uis[i])) {
					uis[i].tick();
				}
			}
		};
		HeptiHex.UI.GameUIContainer.prototype.isVisible = function(ui) {
			if(ui.getDomElement().style.visibility == "visible")
				return true;
			
			return false;
		}
		HeptiHex.UI.GameUIContainer.prototype.trap = function(ui) {};
		
		
	/** Interface for all UI.
	 */
	HeptiHex.UI.GameUI = function() {}

		/** returns parent container
		 */
		HeptiHex.UI.GameUI.prototype.parentContainer;
	
		/** returns DOM Object of the user interface
		 */
		HeptiHex.UI.GameUI.prototype.getDomElement =  function() {};

		/** Sets the visibility of the user interface
		 *  isVisible boolean shows or hides the DOM element on the page
		 */
		HeptiHex.UI.GameUI.prototype.setVisible = function(isVisible) {
			
			if(this.getDomElement() != null) {
				if(isVisible == true)
					this.getDomElement().style.visibility = "visible";
				else
					this.getDomElement().style.visibility = "hidden";
			}
			
		};
		
		/** Object that stores all key specific actions that are inheritable
		 */
		HeptiHex.UI.GameUI.prototype.KeyHandler = {};
		
		/** Defines what happens when a key is released.
		 *  keyEvent {object} event information from key release.   
		 */
		HeptiHex.UI.GameUI.prototype.KeyHandler.keyUp = function(keyEvent){};
		
		/** Defines what happens when a key is down.
		 *  keyEvent {object} event information from key down.   
		 */
		HeptiHex.UI.GameUI.prototype.KeyHandler.keyDown = function(keyEvent){};
		
		/** Called every game tick. Updates rendered objects on the screen. This is not visible until the next screen render.
		 */
		HeptiHex.UI.GameUI.prototype.tick = function() {};

	
	/** MainMenu Container
	 *  @extends GameUIContainer
	 */
	HeptiHex.UI.MainMenuContainer = function() {
		
		//init objects for screen
		var innerHex;
		var outerHex;
		
		innerHex = this.createInnerPolygon(6, 0xff0000);
		outerHex = this.createOuterPolygon(6, 0xff0000, 0x666666);
		
		innerHex.position.z = -5;
		outerHex.position.z = 0;
		outerHex.rotation.x = Math.PI / 2;
		outerHex.rotation.y = Math.PI / 6;

		HeptiHex.Screen.scene.add(innerHex);
		HeptiHex.Screen.scene.add(outerHex);
		
		//rotate camera to an 'appealing' area
		HeptiHex.Screen.camera.rotation.x = Math.PI / 3;
		
		this.innerHex = innerHex;
		this.outerHex = outerHex;
		
		//init menus
		this.titleMenu = new HeptiHex.UI.TitleMenu();
		this.titleMenu.setVisible(true);
		
		this.mainMenu = new HeptiHex.UI.MainMenu();
		
		this.addUI(this.titleMenu);
		this.addUI(this.mainMenu);
		
	};
	HeptiHex.UI.MainMenuContainer.prototype = new HeptiHex.UI.GameUIContainer();

		HeptiHex.UI.MainMenuContainer.prototype.innerHex = undefined;
		HeptiHex.UI.MainMenuContainer.prototype.outerHex = undefined;
	
		/** @override
		 */ 
		HeptiHex.UI.MainMenuContainer.prototype.trap = function(ui, message) {
			if(message == "openMainMenu") {
				ui.setVisible(false);
				this.mainMenu.setVisible(true);
			}
			
			if(message == "startSinglePlayer") {
				ui.setVisible(false);
			}
		}
		
		/** @override
		 */ 
		HeptiHex.UI.MainMenuContainer.prototype.tick = function() {
			HeptiHex.UI.GameUIContainer.prototype.tick.call(this);
			
			this.innerHex.rotation.z += Math.PI / 200;
			this.outerHex.rotation.y += Math.PI / 200;
		}
		
		HeptiHex.UI.MainMenuContainer.prototype.createInnerPolygon = function(sides, color) {
			var radius = 1;
			
			var geometry = new THREE.CircleGeometry(radius, sides);
			var material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, color: color} );
			
			return new THREE.Mesh(geometry, material);
		},

		HeptiHex.UI.MainMenuContainer.prototype.createOuterPolygon = function(sides, firstColor, secondColor) {
			
			var geometry = new THREE.CylinderGeometry(1.05, 1.05, 10, sides, 1, true);
			
			var colorToDraw;
			for(var i=0; i<geometry.faces.length; i++) {
				if(i%4 == 0 || i%4 == 1)
					colorToDraw = firstColor;
				else
					colorToDraw = secondColor;
				
				geometry.faces[i].color.setHex(colorToDraw);
			}
			
			var material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, vertexColors: THREE.FaceColors} );
			
			return new THREE.Mesh(geometry, material);

		}
	
	
	/** TitleMenu GUI
	 *  @extends GameUI
	 */
	HeptiHex.UI.TitleMenu = function() {};
	HeptiHex.UI.TitleMenu.prototype = new HeptiHex.UI.GameUI();

		/** @override
		 */                                                           
		HeptiHex.UI.TitleMenu.prototype.getDomElement = function() {
			return document.getElementById('hh-title-screen');
		};
	
		/** @override
		 */ 
		HeptiHex.UI.TitleMenu.prototype.KeyHandler = {};
		
		/** @override
		 */
		HeptiHex.UI.TitleMenu.prototype.KeyHandler.keyUp = function(keyEvent) {
			
			var keyHandlerObject = HeptiHex.KeyHandler;
			var keyBinds = keyHandlerObject.KeyBinds;
			
			var screenObject = HeptiHex.Screen;
				
			switch(keyEvent.keyCode) {
				
				case keyBinds.selectItem:
					this.parentContainer.trap(this, "openMainMenu");
					break;
					
			}
			
		};
		
		/** @override
		 */
		HeptiHex.UI.TitleMenu.prototype.KeyHandler.keyDown = function(keyEvent) {}
	
	
	/** MainMenu GUI
	 *  @extends GameUI
	 */
	HeptiHex.UI.MainMenu = function() {
		this.highlightOption(this.optionSelected);
	};
	HeptiHex.UI.MainMenu.prototype = new HeptiHex.UI.GameUI();

		HeptiHex.UI.MainMenu.prototype.optionLength = 5;
		HeptiHex.UI.MainMenu.prototype.optionSelected = 0;
	
		/** @override
		 */                                                           
		HeptiHex.UI.MainMenu.prototype.getDomElement = function() {
			return document.getElementById('hh-main-menu');
		};
	
		/** @override
		 */ 
		HeptiHex.UI.MainMenu.prototype.KeyHandler = {};
		
		/** @override
		 */
		HeptiHex.UI.MainMenu.prototype.KeyHandler.keyUp = function(keyEvent) {
			
			var keyHandlerObject = HeptiHex.KeyHandler;
			var keyBinds = keyHandlerObject.KeyBinds;
			
			var screenObject = HeptiHex.Screen;
			
			switch(keyEvent.keyCode) {
				
				case keyBinds.selectItem:
				
					if(this.optionSelected == 0) {
						console.log("We are playing singleplayer now.");
						HeptiHex.Screen.camera.rotation.x -= Math.PI / 3;
						this.setVisible(false);
					}
					break;
				
			}
		};
	
		/** @override
		 */
		HeptiHex.UI.MainMenu.prototype.KeyHandler.keyDown = function(keyEvent) {
			
			var keyHandlerObject = HeptiHex.KeyHandler;
			var keyBinds = keyHandlerObject.KeyBinds;
			
			var screenObject = HeptiHex.Screen;
				
			switch(keyEvent.keyCode) {
				
				case keyBinds.down:
					this.highlightOption((this.optionSelected + 1)%this.optionLength);
					break;
					
			}
		
		};
		
		HeptiHex.UI.MainMenu.prototype.highlightOption = function(optionNumber) {
			document.getElementById("hh-main-menu-" + this.optionSelected).style.backgroundColor = "gray";
			document.getElementById("hh-main-menu-" + optionNumber).style.backgroundColor = "red";
			this.optionSelected = optionNumber;
		};

	
/** Screen object which handles rendering and canvas dimensions
 */
HeptiHex.Screen = {
	
	width: undefined,
	height: undefined,
	
	renderer: undefined,
	camera: undefined,
	scene: undefined,
	
	menuContainer: undefined,
	
	/** Draws the canvas to the screen.
	 */
	init: function() {
		
		var renderer = new THREE.WebGLRenderer({antialias: true}); 
		var screenWidth = window.innerWidth;
		var screenHeight = window.innerHeight;
		
		//init camera
		var viewAngle = 75;
		var aspect = screenWidth/screenHeight;
		var near = .1;
		var far = 100;
		
		var camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
		
		//init scene
		var scene = new THREE.Scene();
		scene.add(camera);
		
		//start the renderer
		renderer.setSize(screenWidth, screenHeight);
		renderer.setClearColor( 0xffffff );

		//attach the render-supplied DOM element
		document.body.appendChild(renderer.domElement);
		
		this.renderer = renderer;
		this.camera = camera;
		this.scene = scene;
		this.width = screenWidth;
		this.height = screenHeight;
		
		setInterval(this.tick, HeptiHex.LOCAL_TICK_RATE);
		this.render();
		
		window.addEventListener("resize", function() {
			
			var screenObject = HeptiHex.Screen;
			
			var width = window.innerWidth;
			var height = window.innerHeight;
			
			screenObject.camera.aspect = width/height;
			screenObject.camera.updateProjectionMatrix();
				
			screenObject.renderer.setSize(width, height);
			
			screenObject.width = width;
			screenObject.height = height;
			
		});
	
	},
	
	tick : function() {
		var screenObject = HeptiHex.Screen;
		
		if(screenObject.menuContainer != undefined) {
			screenObject.menuContainer.tick();
		}
	},
	
	render : function() {
		var screenObject = HeptiHex.Screen;
		
		requestAnimationFrame(screenObject.render);
		screenObject.renderer.render(screenObject.scene, screenObject.camera);
	},
	
	setMenuContainer : function(menuContainer) {
		this.menuContainer = menuContainer;
	},
	
	getMenuContainer : function() {
		return this.menuContainer;
	}
	
};

/** Contains important networking for game.
 */
HeptiHex.Network = {
	
	socket : undefined,
	
	start : function() {
		this.socket = socket.io();
	} 
	
};





