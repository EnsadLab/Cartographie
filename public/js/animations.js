

class Anim {

    constructor(id,id_pure,radius,tmin,tmax,absX,absY,parentAbsX,parentAbsY){
      this.id = id;
      this.id_pure = id_pure;
      this.dt = 0.0;
      this.dx = 0.0;
      this.dy = 0.0;
      this.t = 0.0;
      this.radius = radius;
      //this.x = getRandomInt(-this.radius,this.radius);
      //this.y = getRandomInt(-this.radius,this.radius);
      this.x = 0;
      this.y = 0;
      this.absX = absX;
      this.absY = absY;
      this.tmin = tmin;
      this.tmax = tmax;
      this.fps = 60;
      this.node = d3.select("#nodes").select(id).select("g"); // TO DO: to check bug!!!
      var res = allNodes_flat.find( function(data) { return data.id == id_pure; });
      res.xStart = parentAbsX + absX;
      res.yStart = parentAbsY + absY;
    }

    resetNode(xParent,yParent){
      var absPosition = [0,0];
      this.node = d3.select("#nodes").select(this.id).select("g");
      this.x = 0;
      this.y = 0;
      var id = this.id_pure;
      var res = allNodes_flat.find( function(data) { return data.id == id; });
      res.x = xParent + this.absX + this.x;
      res.y = yParent + this.absY + this.y;
      absPosition[0] = res.x;
      absPosition[1] = res.y;
      this.start();
      return absPosition;
    }

    update(xParent,yParent,debug){
      var absPosition = [0,0];
      if(this.t < 1.0){
        this.t += this.dt;
        this.x += this.dx;
        this.y += this.dy;
        //if(debug) console.log("update",this.id,this.x, this.y);
        
        this.node.attr("transform",'translate('+ this.x + ',' + this.y + ')');
        //console.log("id",this.id_pure);
        var id = this.id_pure
        var res = allNodes_flat.find( function(data) { return data.id == id; });
        res.x = xParent + this.absX + this.x;
        res.y = yParent + this.absY + this.y;
        res.xRel = this.absX;
        res.yRel = this.absY;
        absPosition[0] = res.x;
        absPosition[1] = res.y;
        //if(debug) console.log("update absPosition",this.id,absPosition[0], absPosition[1]);
        this.t += this.dt;
      }else {
        //console.log("restart?");
        var id = this.id_pure
        var res = allNodes_flat.find( function(data) { return data.id == id; });
        res.x = xParent + this.absX + this.x;
        res.y = yParent + this.absY + this.y;
        res.xRel = this.absX;//this.absX + this.x;
        res.yRel = this.absY;//this.absY + this.y;
        absPosition[0] = res.x;
        absPosition[1] = res.y;
        this.start();
      }
      //return [this.x,this.y];
      return absPosition;
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
      this.delay = 0.0;
      this.nbFramesDelay = 0;
      this.dtDelay = 0;
      this.running = false;
    }

    update(){

      if(this.runningTheDelay && this.t <= 1.0){
         this.t += this.dtDelay;
         if(this.t >= 1.0){
           this.t = 0;
           this.nbFramesDelay = 0;
           this.running = true;
         }
      } 

      if(this.running && this.t < 1.0){
        this.t += this.dt;
        this.alpha += this.deltaAlpha;
      } else {
        this.running = false;
      }
      //console.log("alpha",this.alpha,this.t);
      return this.alpha;
    }
    
    start(alphaStart,alphaEnd,time,delay){
        this.alphaStart = alphaStart;
        this.alphaEnd = alphaEnd;
        this.alpha = this.alphaStart;
        this.nbFrames = this.fps*time;
        this.nbFramesDelay = this.fps*delay;
        this.dtDelay = 1.0/this.nbFramesDelay;
        this.deltaAlpha = (this.alphaEnd-this.alphaStart)/this.nbFrames;
        this.dt = 1.0/this.nbFrames;
        this.t = 0.0;
       // this.running = false;
        if(delay == 0) {this.running = true; this.runningTheDelay = false;}
        else {this.running = false; this.runningTheDelay = true;}
        //console.log("alpha START",alphaStart,alphaEnd,this.fps,delay,this.dtDelay,this.nbFramesDelay);
    }

  };