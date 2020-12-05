var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2,
    obstacle3, obstacle4, obstacle5, obstacle6;

var score, gameOverImage, retryImage, retry, gameOver;

//var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImage = loadImage("gameOver.png");
  retryImage = loadImage("restart.png");

  jumpSound=loadSound("jump.mp3");
  checkPointSound=loadSound("checkPoint.mp3");
  dieSound=loadSound("die.mp3");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  trex.setCollider("circle",0,0,40);
  //trex.debug = true;

  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;

  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  score = 0;

  gameOver = createSprite(300,75)
  gameOver.addImage("gamaOver", gameOverImage);
  gameOver.scale=2;

  retry = createSprite(300,130)
  retry.addImage("gamaOver", retryImage);
  retry.scale=0.5;
}

function draw() {
  background("white");

  fill("black");
  text("Score: "+ score, 500,25);

  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(4*score/100);

    //Move Cactus
    obstaclesGroup.setVelocityXEach(-(4*score/100));

    //Add Score
    score = score + Math.round(getFrameRate()/60);
    //console.log(getFrameRate()/60);

    if (score%100==0 && score != 0){
      checkPointSound.play();
    }

    //Jump
    if(keyDown("space")&& trex.y >= 165) {
      trex.velocityY = -13;
      jumpSound.play();
    }

    //Gravity
    trex.velocityY = trex.velocityY + 0.8

    //Reset Ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();


    //If touching trex touching obstacles change gameState to end
    if (obstaclesGroup.isTouching(trex)){
      dieSound.play();
      gameState = END;
    }


    //hide the game over screen in the play state
    gameOver.visible=false;
    retry.visible=false;

    //trex.changeAnimation("running",trex_running);
  }
  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0;


    //stop the cloud and the cactus from moving in the end state
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //stop the cloud and cactus from disapearing in the end state
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    //change the image when collided
    trex.changeImage("collided",trex_collided);

    //reset the y velocity to 0
    trex.velocityY = 0;

    //Make the gameover screen visible on collision
    gameOver.visible=true;
    retry.visible=true;
  }


  trex.collide(invisibleGround);

  //Retry
  if (mousePressedOver(retry)){
    restart();
  }



  drawSprites();
}

function spawnObstacles(){

  //Spawn the Obstacles every 60 frames
  if (frameCount % 60 === 0){
    var obstacle = createSprite(600,165,10,40);

    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = width/4;

   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}

//Retry Function
function restart(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
  //hide the game over screen in the play state
  gameOver.visible=false;
  retry.visible=false;
}

function spawnClouds() {

  //spawn the clouds every 80 frames
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

     //assign lifetime to the variable
    cloud.lifetime = width/3;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }

}
