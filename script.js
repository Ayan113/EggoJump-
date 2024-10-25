//we are declaring the variables here of the board or we can say screen.
let board;
let boardWidth=360;
let boardHeight=640;
let context;//context is used to draw the images on the board

//here we are declaring the variables of the egg
let eggWidth=27;
let eggHeight=34;
let eggX=boardWidth/8;
let eggY=boardHeight/2;

let egg={
    x:eggX,
    y:eggY,
    width:eggWidth,
    height:eggHeight
}
//pipes
let pipeArray=[];
let pipeWidth=64;
let pipeHeight=512;
let pipeX=boardWidth;
let pipeY=0;
//creating the variables for the pipes
let topPipeImg;
let bottomPipeImg;

//game physics 
let velocityX=-2; //pipes moving left speed
let velocityY=0;//egg jump speed
let gravity=0.2;
let gameOver=false;
let score=0;

window.onload=function(){
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");

    //drawing egg
   // context.fillStyle="green";
    //context.fillRect(egg.x,egg.y,egg.width,egg.height);

    //loading the images
    eggImg=new Image();
    eggImg.src="./egg.png"
    eggImg.onload=function(){
    context.drawImage(eggImg,egg.x,egg.y,egg.width,egg.height);

    }
        //loading the images of the pipes here
        topPipeImg=new Image();
        topPipeImg.src = "./toppipe.png";
        bottomPipeImg=new Image();  
        bottomPipeImg.src = "./bottompipe.png";



        requestAnimationFrame(update);
        setInterval(placePipes,1500);
        document.addEventListener("keydown",moveegg);

    }
    function update(){
        requestAnimationFrame(update);
        if(gameOver){
            return;
        }
        context.clearRect(0,0,board.width,board.height)

        //egg
        velocityY+=gravity;
        egg.y=Math.max(egg.y+velocityY,0);
        context.drawImage(eggImg,egg.x,egg.y,egg.width,egg.height);
        if(egg.y>board.height){
            gameOver=true;
        }
        //pipes
        for(let i=0;i< pipeArray.length;i++){
            let pipe=pipeArray[i];
            pipe.x  += velocityX;
            context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
            if(!pipe.passed && egg.x>pipe.x+pipe.width){
                score+=0.5;//cause there are two pipes so 0.5*2=1 which is the score for passing each set of pipes.
                pipe.passed=true;
            }
            if (detectCollision(egg,pipe)){
                gameOver=true;
            }
        }
        //clear pipes
        while(pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
            pipeArray.shift();
        }
        //score
        context.fillStyle="white";
        context.font="45px sans-serif";
        context.fillText(score,5,45);
        if(gameOver){
            context.fillText("GAME OVER",5,90);
        }   

    }
    function placePipes(){
        if(gameOver){
            return;
        }
        let randomPipeY=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
        let openingSpace=board.height/4;
        let topPipe={
            img:topPipeImg,
            x:pipeX,
            y:randomPipeY,
            width:pipeWidth,
            height:pipeHeight,
            passed:false
        }
        pipeArray.push(topPipe);
        
        let bottomPipe={
            img:bottomPipeImg,
            x:pipeX,
            y:randomPipeY +pipeHeight+openingSpace,
            width:pipeWidth,
            height:pipeHeight,

        }
        pipeArray.push(bottomPipe);

    }
    function moveegg(e){
        if(e.code=="Space"|| e.code=="ArrowUp"||e.code=="KeyX"){
            velocityY=-6;//jumping speed

            if(gameOver){
                egg.y=eggY;
                pipeArray=[];
                score=0;
                gameOver=false;
            }

        }
    }

    function detectCollision(a,b){
        return a.x < b.x +b.width &&
        a.x + a.width >b.x &&
        a.y < b.y +b.height && 
        a.y +a.height > b.y; 
    }

