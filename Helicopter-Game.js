var DELAY = 40;
var SPEED = 5;
var MAX_DY = 12;
var OBSTACLE_WIDTH = 30;
var OBSTACLE_HEIGHT = 100;

var TERRAIN_WIDTH = 10;
var MIN_TERRAIN_HEIGHT = 20;
var MAX_TERRAIN_HEIGHT = 50;

var POINTS_PER_ROUND = 5;

var DUST_RADIUS = 3;
var DUST_BUFFER = 10;

var NUM_OBSTACLES = 3;

var copter;
var dy = 0;
var clicking = false;

var points = 0;
var score;

var obstacles = [];
var top_terrain = [];
var bottom_terrain = [];
var dust = [];
function start() {
    setup();
    setTimer(game, DELAY);
    mouseDownMethod(onMouseDown);
    mouseUpMethod(onMouseUp);
}

function setup() {
    setBackgroundColor(Color.green);
    copter = new WebImage(ImageLibrary.Objects.helicopter);
    copter.setSize(50, 25);
    copter.setPosition(getWidth()/3, getHeight()/2);
    copter.setColor(Color.black);
    add(copter);
    
    addObstacles();
    addTerrain();
    
    score = new Text("0");
    score.setColor(Color.white);
    score.setPosition(10, 30);
    add(score);
}

function updateScore() {
    points += POINTS_PER_ROUND;
    score.setText(points);
}

function game() {
    updateScore();
    if (hitWall()) {
        lose();
        return;
    }
    var collider = getCollider();
    if (collider != null && collider != copter) {
        lose();
        return;
    }
    if(clicking) {
        dy -= 1;
        if (dy < -MAX_DY) {
         dy = -MAX_DY;
        }
    } else {
     dy += 1;
     if (dy > MAX_DY) {
         dy = MAX_DY;
     }
    }
    copter.move(0, dy);
    moveObstacles();
    moveTerrain();
    moveDust();
    addDust();
}

function onMouseDown(e) {
 clicking = true;
}
function onMouseUp(e) {
    clicking = false;
}

function addObstacles() {
   for (var i = 0; i < NUM_OBSTACLES; i++) {
   var obstacle = new Rectangle(OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
    
    obstacle.setColor(Color.blue);
    obstacle.setPosition(getWidth() + i * (getWidth()/NUM_OBSTACLES),
    Randomizer.nextInt(0, getHeight() - OBSTACLE_HEIGHT));
    obstacles.push(obstacle);
    add(obstacle);
}
}

function moveObstacles() { 
    for (var i = 0; i < obstacles.length; i++) {
    var obstacle = obstacles[i];
    obstacle.move(-SPEED, 0);
    if(obstacle.getX() < 0) {
        
        obstacle.setPosition(getWidth(),
        Randomizer.nextInt(0, getHeight() - OBSTACLE_HEIGHT));
    }
}
}

function hitWall() {
    var hit_top = copter.getY() < 0;
    var hit_bottom = copter.getY() + copter.getHeight() > getHeight();
    return hit_top || hit_bottom;
}


function lose() {
    stopTimer(game);
    var text = new Text("You Lost!");
    text.setColor(Color.red);
    text.setPosition(getWidth()/2 - text.getWidth()/2,
    getHeight()/2);
    add(text);
}

function getCollider() {
    var topLeft = getElementAt(copter.getX()-1, copter.getY()-1);
    if (topLeft != null) {
        return topLeft;
    }    

var topRight = getElementAt(copter.getX() + copter.getWidth() + 1,
copter.getY() - 1);

if (topRight != null) {
    return topRight;
}

var bottomLeft = getElementAt(copter.getX()-1,
copter.getY() + copter.getHeight() + 1);

if(bottomLeft != null) {
    return bottomLeft;
}

var bottomRight = getElementAt(copter.getX() + copter.getWidth() + 1,
copter.getY() + copter.getHeight() +1);

if(bottomRight != null) {
    return bottomRight;
}

return null;
}


function addTerrain() {
    for (var i=0; i <= getWidth() / TERRAIN_WIDTH; i++) {
        var height = Randomizer.nextInt(MIN_TERRAIN_HEIGHT, MAX_TERRAIN_HEIGHT);
        var terrain = new Rectangle(TERRAIN_WIDTH, height);
        terrain.setPosition(TERRAIN_WIDTH * i, 0);
        terrain.setColor(Color.blue);
        top_terrain.push(terrain);
        add(terrain);
        
        height = Randomizer.nextInt(MIN_TERRAIN_HEIGHT, MAX_TERRAIN_HEIGHT);
        var bottomTerrain = new Rectangle(TERRAIN_WIDTH, height);
        bottomTerrain.setPosition(TERRAIN_WIDTH * i,
        getHeight() - bottomTerrain.getHeight());
        bottomTerrain.setColor(Color.blue);
        bottom_terrain.push(bottomTerrain);
        add(bottomTerrain);
    }
    
}

function moveTerrain() {
    for (var i=0; i < top_terrain.length; i++) {
        var obj = top_terrain[i];
        obj.move(-SPEED, 0);
        if (obj.getX() < -obj.getWidth()) {
            obj.setPosition(getWidth(), 0);
        }
    }
    
        for (var i=0; i < bottom_terrain.length; i++) {
        var obj = bottom_terrain[i];
        obj.move(-SPEED, 0);
        if (obj.getX() < -obj.getWidth()) {
            obj.setPosition(getWidth(), getHeight() - obj.getHeight());
        }
    }
}



function addDust() {
    var d = new Circle(DUST_RADIUS);
    d.setColor("#cccccc");
    d.setPosition(copter.getX() - d.getWidth(),
    copter.getY() + DUST_BUFFER);
    
    dust.push(d);
    add(d);
}
 
function moveDust() {
    for (var i=0; i < dust.length; i++) {
        var d = dust[i];
        d.move(-SPEED, 0);
        d.setRadius(d.getRadius() - 0.1);
        if (d.getX() < 0) {
            remove(d);
            dust.remove(i);
            i--;
        }
    }
}