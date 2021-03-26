var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound, backgroundIMG;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  

  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");

  backgroundIMG = loadImage("desert bg image.png");
}


function setup() {
  createCanvas(displayWidth-100, displayHeight-300);
  
  trex = createSprite(50,displayHeight/2+60,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);

  trex.scale = 0.6;
  
  ground = createSprite(displayWidth/2,displayHeight/2+70,displayWidth*20,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  
  gameOver = createSprite(displayWidth/2,displayHeight/2-30);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,displayHeight/2+10);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(displayWidth,displayHeight/2+90,displayWidth*4,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true
  
  score = 0;
}


function draw() {
  
  background(backgroundIMG);
  //displaying score
  text("Score: "+ score, displayWidth/2,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < displayWidth/4){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") && trex.y > 140) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    if(keyDown(UP_ARROW) && trex.y > 140) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play()
      
    }
  } else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
  
      ground.velocityX = 0;
      trex.velocityY = 0
      
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
     
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);    
    }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);

  //Make the game restart by clicking the restart sprite
  if(mousePressedOver(restart) && gameState===END) {
    reset();
  }

  drawSprites();
}




//reset function
function reset(){
  
  gameState=PLAY;
  
  gameOver.visible=false;
  restart.visible=false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score=0;
}




function spawnObstacles(){
 if (frameCount % 120 === 0){
   var obstacle = createSprite(displayWidth,(displayHeight/2)+80,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 1200;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth,displayHeight/2.5,40,10);
    cloud.y = Math.round(random(displayHeight/3,displayHeight/2));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 1200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

