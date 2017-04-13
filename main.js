

(function () {
	var mode;
	var fish
	var fishs = [];

	// Green RGBA is to obtain a trail after fishes
	var colors = ["#E1fish7", "#F48FB1", "#B2EBF2", "#81D4FA"];

	// Aliases
	var M = Math;
	var pow = M.pow;
	var random = M.random;
	// Configuration
	var turnRateChangeOccurence = 0.5;
	var tempMaxTurnRate;
	var maxTurnRate = 0.10;
	var maxTurnRateChange = 0.9;
	var stageSize = c.width = c.height = window.innerWidth;
	var fishWidth = 34;
	var speed = 3; // Distance run on each step
	var fishLength = 22;
	var fishTarget;
	var fishcount = 18;
	var i = fishcount; // First iteration will be on fishcount
	var isTargetRepulsing = 0;
	var repulseCycles = 1200;
	var repulseStrengh = 2;

	// fish  = [positions, direction, speed, turn rate, health]
	// position is an array of [posX, posY]
	// Speed is units per cycle
	// Turn rate is how much the direction shifts at every cycle
	/*
	fish
		.c = coordinates
		.d = direction
		.t = turn rate
		.h = health
	*/


	onmousemove = onclick = polyFunc;
	function polyFunc(mode, a, b, c, value) {

		// mode = event
		if (mode.x) {
 		   	fishTarget = polyFunc(4, mode.x, mode.y);
			// onclick event
	    	if (mode.which) {
	    		isTargetRepulsing = repulseCycles;
	    	}
		}

		// function distanceToTarget (x1, y1) {
		if (mode == 1) {
			value = M.sqrt( pow(fishTarget.x - a, 2) + pow(fishTarget.y - b, 2) );
		}
		//function forwardPos(angle, length, pos) {
		if (mode == 2) {
			// polyFunc = Coord
			value = polyFunc(4,
				c.x + M.cos(a) * b,
				c.y + M.sin(a) * b
			);
		}
		//function fish() {
		if (mode == 3) {
			value = {
					// polyFunc = Coord
					c:[polyFunc(4, stageSize * random(), stageSize * random())],
					d:0.5,
					t:0,
					h:0.5 + random()
				}
		}
		//function Coord (x, y);
		if (mode == 4) {
			value = {x:a, y:b} 
		}
		return value;
	};



	// Spawn X ammount of fishs
	// polyFunc = fish
	for (;i--;) fishs[i] = polyFunc(3);


	(function loop() {
		// Shorthands for fish attributes
		var health;
		var turnRate;
		var direction;
		var positions;

		var posIndex;
		var positions;

		// Fill the canvas with green
		a.fillStyle = colors[3];
		a.fillRect(0, 0, stageSize, stageSize);

		for (i = fishcount; i--;) {
			fish = fishs[i];

			turnRate = fish.t;
			direction = fish.d;
			health = fish.h;
			positions = fish.c;

			for (posIndex = 0; posIndex < (fishLength * health) && posIndex < positions.length-1; posIndex++) {
				a.beginPath();
				a.lineWidth = fishWidth * health * (1-(posIndex/fishLength)); // According to health
				a.lineCap = (posIndex == 0) ? "round" : "butt";
				a.quadraticCurveTo(
					positions[posIndex].x,
					positions[posIndex].y,
					positions[posIndex+1].x,
					positions[posIndex+1].y);
				a.strokeStyle = colors[posIndex%3];
				a.stroke();

			}


			/* MOVE ROUTINE */
			var pos2;
			var distA;
			var distB;
			var change
			// Speed is according to health
			// polyFunc = forwardPos
			var pos = polyFunc(2, direction, (isTargetRepulsing ? speed * repulseStrengh : speed) * health, positions[0] );
			positions.unshift(pos);
			direction += turnRate;

			// One in a while, the turn rate changes
			// Force turn change if a target is in sight
			if (random() < turnRateChangeOccurence || isTargetRepulsing || !fishTarget%80) {

				change = (random() - 0.5) * 2 * maxTurnRateChange * (isTargetRepulsing ? repulseStrengh : 1);
				turnRate += change;

				// Test future position with both angles
				if (fishTarget) {
					// polyFunc = forwardPos
					pos2 = polyFunc(2, direction + change, speed * health, pos );
					// polyFunc = distanceToTarget
					distA = polyFunc(1, pos2.x, pos2.y);
					// polyFunc = forwardPos
					pos2 = polyFunc(2, direction - change, speed * health, pos );
					// polyFunc = distanceToTarget
					distB = polyFunc(1, pos2.x, pos2.y);
				}


				// If the directon change takes the fish's angle of attack away from the tarket
				// inverse the adjustment
				if (distA > distB && fishTarget) {
					turnRate += (isTargetRepulsing ? change : -change) * 2;
				}

				tempMaxTurnRate = maxTurnRate * (isTargetRepulsing ? repulseStrengh : 1);
				// Enforce maxTurnRate
				if (turnRate > tempMaxTurnRate) turnRate = tempMaxTurnRate;
				if (turnRate < - tempMaxTurnRate) turnRate = -tempMaxTurnRate;
				// Decrement repulse if not already at 0
				isTargetRepulsing && isTargetRepulsing--;

				// Reeasing shortcut vars to fish object
				fish.t = turnRate;
				fish.d = direction;


			}


		}

		requestAnimationFrame(loop);
	})();






})();

