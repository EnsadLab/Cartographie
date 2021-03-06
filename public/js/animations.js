

class Anim {

    constructor(id,radius,tmin,tmax){
      this.id = id;
      this.dt = 0.0;
      this.dx = 0.0;
      this.dy = 0.0;
      this.t = 0.0;
      this.radius = radius;
      //this.x = getRandomInt(-this.radius,this.radius);
      //this.y = getRandomInt(-this.radius,this.radius);
      this.x = 0;
      this.y = 0;
      this.tmin = tmin;
      this.tmax = tmax;
      this.fps = 60;
      this.node = d3.select(id).select("g");
    }

    update(){
      if(this.t < 1.0){
        this.t += this.dt;
        this.x += this.dx;
        this.y += this.dy;
        //console.log("update",this.id,this.x, this.y);
        this.node.attr("transform",'translate('+ this.x + ',' + this.y + ')');
        this.t += this.dt;
      }else {
        this.start();
      }
      return [this.x,this.y];
    }

    start(){
      this.nbFrames = getRandomInt(this.tmin,this.tmax)*this.fps;
      this.deltaX = getRandomInt(-this.radius,this.radius);
      this.deltaY = getRandomInt(-this.radius,this.radius);
      this.dx = (this.deltaX-this.x)/this.nbFrames;
      this.dy = (this.deltaY-this.y)/this.nbFrames;
      this.dt = 1.0/this.nbFrames;
      this.t = 0.0;
    }

  };

  class AnimAlpha {

    constructor(alphaStart,alphaEnd,time){
      this.alphaStart = alphaStart;
      this.alphaEnd = alphaEnd;
      this.alpha = this.alphaStart;
      this.time = time;
      this.t = 0.0;
      this.dt = 0.0;
      this.fps = 60;
    }

    update(){
      if(this.t < 1.0){
        this.t += this.dt;
        this.alpha += this.deltaAlpha;
      }
      return this.alpha;
    }
    
    start(alphaStart,alphaEnd,time){
        this.alphaStart = alphaStart;
        this.alphaEnd = alphaEnd;
        this.alpha = this.alphaStart;
        this.nbFrames = this.fps*time;
        this.deltaAlpha = (this.alphaEnd-this.alphaStart)/this.nbFrames;
        this.dt = 1.0/this.nbFrames;
        this.t = 0.0;
    }

  };