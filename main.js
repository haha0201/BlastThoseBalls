var canvas = document.getElementById('Game');
var ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 500;
//LOl

var x = 150,
    y = 150,
    velY = 2,
    velX = 2,
    speed = 2,
    friction = 0.77,
    slowed = 0,
    keys = [],
    clicknumberkey = false;

var autofire = 0;
var intheaura = 0;

var playersize = 8;

var bulletSpeed = 5,
    reloadTimer = 0,
    bulletDamage = 10,
    bulletReload = 15,
    bullets = [],
    wave = 1,
    chosen = 0,
    slowingamount = 1;

var frozen = false;
var frozentimer = 0;

var needed = [1, 2, 3, 4, 6, 8, 11, 15, 90, 180, 270, 360, 540, 720, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000, 21000, 21000, 21000, 21000, 21000, 21000, 21000, 21000, 21000, 21000, 21000, 21000, 21000, 21000, 21000];
var tokenneeded = [0, 0, 0, 0, 0, 0, 1, 1, 6, 12, 18, 24, 30, 36, 42, 66, 100, 133, 166, 200, 233, 266, 300, 333, 366, 400, 433, 466, 500, 533, 566, 600, 633, 666, 666, 666, 666, 666, 666, 666, 666, 666, 666, 666, 666, 666, 666, 666, 666, 666];


var powerups = [];
var attributes = [0, 0, 0, 0, 0, 0, 0];

var hp = 70,
    maxhp = 70,
    hpregen = 1;
var canShoot = 1;

var enemies = [];
var borderballs = [];
var regularEnemySpawnRate = 1000;
var upgradepoints = 0,
    bosstokens = 0;

var time = 0;
var mouseX = 0,
    mouseY = 0;


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function HealthPowerup() {
  this.x = getRandomInt(1, 3);
  this.y = getRandomInt(1, 3);
  if (this.x == 1){
    this.x = 350 + getRandomInt(100, 210);
  } else if (this.x == 2){
    this.x = 350 - getRandomInt(100, 210);
  }
  if (this.y == 1){
    this.y = 250 + getRandomInt(100, 210);
  } else if (this.y == 2){
    this.y = 250 - getRandomInt(100, 210);
  }
   this.delete = 0;
}

HealthPowerup.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "lightgray";
    ctx.arc(this.x, this.y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(this.x-7, this.y-3, 14, 6);
    ctx.fill();
    ctx.fillStyle = "red";
    ctx.fillRect(this.x-3, this.y-7, 6, 14);
    ctx.fill();
    
    if (Math.sqrt(Math.pow((this.x-x), 2) + Math.pow((this.y-y), 2)) <= 15+playersize){
        hp += 50
        if (hp > maxhp){
            hp = maxhp;
        }
        this.delete = 1;
    }
}
function SniperBullet(bulletx, bullety, bulletDamage, bulletSpeed, bulletSize, dirX, dirY){
    this.damage = bulletDamage;
    this.speed = bulletSpeed;
    this.x = bulletx;
    this.y = bullety;
    this.size = bulletSize
    this.delete = 0;
    this.dirX = (this.speed/Math.sqrt(Math.pow((this.x-x), 2) + Math.pow((this.y-y), 2)))*(this.x-x);
    this.dirY = this.speed/Math.sqrt(Math.pow((this.x-x), 2) + Math.pow((this.y-y), 2))*(this.y-y);
}

SniperBullet.prototype.draw = function(){
    this.x -= this.dirX
    this.y -= this.dirY
    if (Math.sqrt(Math.pow((this.x-x), 2) + Math.pow((this.y-y), 2)) <= this.size+playersize){
        hp -= this.damage;
        this.delete = 1;
    }
    if (this.x > 600 || this.x < 100 || this.y > 500 || this.y < 0){    
        this.delete = 1;
    }
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "lightgreen";
    ctx.arc(this.x, this.y, this.size - 1, 0, Math.PI * 2);
    ctx.fill();
}

function RadiatorEnemy(hp, size, speed, reload, bulletDamage, bulletCount){
  this.maxhp = hp;
    this.hp = this.maxhp;
    this.size = size;
    this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    this.speedx = Math.random() + 0.5;
    this.speedy = Math.random() + 0.5;
    this.speed = speed;
    this.basespeedx = this.speedx;
    this.basespeedy = this.speedy;
    this.speedx*=this.speed;
    this.speedy*=this.speed;
    this.goingright = Math.round(Math.random());
    this.goingup = Math.round(Math.random());
    this.delete = 0;
    this.reload = reload;
    this.bulletDamage = bulletDamage;
    this.bulletCount = bulletCount;
    this.timer = 0;
    this.spawntimer = 0;
    
}

RadiatorEnemy.prototype.draw = function() {
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 125 + attributes[6]*9 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }
    if (this.timer >= this.reload && this.spawntimer > 50){
        for(var i = 1; i < this.bulletCount+1; i++){
        enemies.push(new RadiatorBullet(this.x, this.y, this.bulletDamage, i, this.bulletCount));
        }
        this.timer = 0;
    } else if (this.timer < this.reload){
        this.timer++
    }
    if (this.spawntimer > 50){
    if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }
    
    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
             this.hp -= bulletDamage;
             bullets[i].delete = 1;
         }
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }
    

    
    
    ctx.beginPath();
    ctx.fillStyle = "firebrick";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "black";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "firebrick";
    ctx.fill();
    
    
    if (this.hp <= 0){
       this.delete = 1;
    }
    
    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;
    this.spawntimer++;
    
};

function RadiatorBullet(bulletx, bullety, bulletDamage, bulletNumber, totalBullets){
    this.damage = bulletDamage;
    this.x = bulletx;
    this.y = bullety;
    this.delete = 0;
    this.bulletDegree = 360 * bulletNumber/totalBullets;
    if (this.bulletDegree == 360){
      this.dirX = -4;
      this.dirY = 0;
    }
    if(this.bulletDegree == 90){
      this.dirX = 0;
      this.dirY = 4;
    }
    if(this.bulletDegree == 180){
      this.dirX = 4;
      this.dirY = 0;
    }
    if(this.bulletDegree == 270){
      this.dirX = 0;
      this.dirY = -4;
    }
    if (this.bulletDegree%90 != 0){
      if(this.bulletDegree>270 && this.bulletDegree<360){
        this.dirX = ((this.bulletDegree-270)/90)*5
        this.dirY = ((360-this.bulletDegree)/90)*5
      } else if(this.bulletDegree>0 && this.bulletDegree<90){
        this.dirX = ((this.bulletDegree-0)/90)*5
        this.dirY = -((90-this.bulletDegree)/90)*5
      } else if(this.bulletDegree>90 && this.bulletDegree<180){
        this.dirX = -((this.bulletDegree-90)/90)*5
        this.dirY = -((180-this.bulletDegree)/90)*5
      } else if(this.bulletDegree>180 && this.bulletDegree<270){
        this.dirX = -((this.bulletDegree-180)/90)*5
        this.dirY = ((270-this.bulletDegree)/90)*5
      }
    }
}

RadiatorBullet.prototype.draw = function(){
    this.x -= this.dirX
    this.y -= this.dirY
    if (Math.sqrt(Math.pow((this.x-x), 2) + Math.pow((this.y-y), 2)) <= 6 + playersize){
        hp -= this.damage;
        this.delete = 1;
    }
    if (this.x > 600 || this.x < 100 || this.y > 500 || this.y < 0){    
        this.delete = 1;
    }
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(this.x, this.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "crimson";
    ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
    ctx.fill();
}

function SniperEnemy(hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize){
  this.maxhp = hp;
    this.hp = this.maxhp;
    this.size = size;
    this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    this.speedx = Math.random() + 0.5;
    this.speedy = Math.random() + 0.5;
    this.speed = speed;
    this.basespeedx = this.speedx;
    this.basespeedy = this.speedy;
    this.speedx*=this.speed;
    this.speedy*=this.speed;
    this.goingright = Math.round(Math.random());
    this.goingup = Math.round(Math.random());
    this.delete = 0;
    this.reload = reload;
    this.bulletDamage = bulletDamage;
    this.bulletSpeed = bulletSpeed;
    this.timer = 0;
    this.spawntimer = 0;
    this.bulletSize = bulletSize
    
}

SniperEnemy.prototype.draw = function() {
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 125 + attributes[6]*9 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }
    if (this.timer >= this.reload && this.spawntimer > 50){
        enemies.push(new SniperBullet(this.x, this.y, this.bulletDamage, this.bulletSpeed, this.bulletSize, 0, 0));
        this.timer = 0;
    } else if (this.timer < this.reload){
        this.timer++
    }
    if (this.spawntimer > 50){
    if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }
    
    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
             this.hp -= bulletDamage;
             bullets[i].delete = 1;
         }
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }
    

    
    
    ctx.beginPath();
    ctx.fillStyle = "lightgreen";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "darkgreen";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "lightgreen";
    ctx.fill();
    
    
    if (this.hp <= 0){
       this.delete = 1;
    }
    
    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;
    this.spawntimer++;
    
};

function ExploderEnemy(hp, size, speed, reload) {
    this.maxhp = hp;
    this.hp = this.maxhp;
    this.size = size;
    this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    this.speedx = Math.random() + 0.5;
    this.speedy = Math.random() + 0.5;
    this.speed = speed;
    this.basespeedx = this.speedx;
    this.basespeedy = this.speedy;
    this.speedx*=this.speed;
    this.speedy*=this.speed;
    this.goingright = Math.round(Math.random());
    this.goingup = Math.round(Math.random());
    this.spawntimer = 0;
    this.delete = 0;

    this.reloadtime = 0;
    this.reload = reload;
    this.reloadtype = 0;
}
ExploderEnemy.prototype.draw = function() {
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }

    if (this.spawntimer > 50){
    if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }

    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
             this.hp -= bulletDamage;
             bullets[i].delete = 1;
         }
    }

    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }


    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "darkgoldenrod";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();


    if (this.hp <= 0){
       this.delete = 1;
    }

    if (this.reloadtime > this.reload && this.spawntimer > 50){
      this.reloadtime = 0;
      if (this.reloadtype == 0){
      enemies.push(new ExploderBullet(this.x, this.y, 0))
      enemies.push(new ExploderBullet(this.x, this.y, 90))
      enemies.push(new ExploderBullet(this.x, this.y, 180))
      enemies.push(new ExploderBullet(this.x, this.y, 270))
      this.reloadtype = 1;
      }
      else if (this.reloadtype == 1){
      enemies.push(new ExploderBullet(this.x, this.y, 45))
      enemies.push(new ExploderBullet(this.x, this.y, 135))
      enemies.push(new ExploderBullet(this.x, this.y, 225))
      enemies.push(new ExploderBullet(this.x, this.y, 315))
      this.reloadtype = 0;
      }
    }

    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;

    this.spawntimer++;
    this.reloadtime++;
};
function ExploderBullet(x, y, direction){
  this.direction = direction;
  if (this.direction == 0){
    this.dirX = 0;
    this.dirY = -4;
  }
  if (this.direction == 90){
    this.dirX = 4;
    this.dirY = 0;
  }
  if (this.direction == 180){
    this.dirX = 0;
    this.dirY = 4;
  }
  if (this.direction == 270){
    this.dirX = -4;
    this.dirY = 0;
  }
  if (this.direction == 45){
    this.dirX = 2.82;
    this.dirY = -2.82;
  }
  if (this.direction == 135){
    this.dirX = 2.82;
    this.dirY = 2.82;
  }
  if (this.direction == 225){
    this.dirX = -2.82;
    this.dirY = 2.82;
  }
  if (this.direction == 315){
    this.dirX = -2.82;
    this.dirY = -2.82;
  }
  this.x = x;
  this.y = y;
}
ExploderBullet.prototype.draw = function(){
  this.x += this.dirX;
  this.y += this.dirY;
  if (Math.sqrt(Math.pow((this.x-x), 2) + Math.pow((this.y-y), 2)) <= 6 + playersize){
    hp -= 25;
    this.delete = 1;
  }
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(this.x, this.y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "orange";
  ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
  ctx.fill();
    
  if (this.x > 600 || this.x < 0 || this.y > 500 || this.y < 0){this.delete = 1;}
}

function HomingEnemy(hp, size, speed, range){
   this.maxhp = hp;
   this.hp = this.maxhp;
   this.size = size;
      this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
   this.speedx = Math.random() + 0.5;
   this.speedy = Math.random() + 0.5;
   this.speed = speed;
   this.basespeedx = this.speedx;
   this.basespeedy = this.speedy;
   this.speedx*=this.speed;
   this.speedy*=this.speed;
   this.spawntimer = 0;
   this.goingright = Math.round(Math.random());
   this.goingup = Math.round(Math.random());
   this.delete = 0;
  this.range = range;
}

function Borderball(x, y, speed, size){
  this.x = x;
  this.y = y;
  this.size = size;
  this.speed = speed;
}

function Bullet(x, y) {
  this.x = x;
  this.y = y;
  this.dirX = this.x - mouseX;
  this.dirY = this.y - mouseY;
  this.delete = 0;
    
}

HomingEnemy.prototype.draw = function(){
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }
  this.distance = Math.sqrt(Math.pow(Math.abs(this.x - x), 2) + Math.pow(Math.abs(this.y - y), 2));
  if (this.distance <= this.range){
    if (this.spawntimer > 50){
    this.x = this.x - (this.speed/this.distance) * slowingamount*(this.x - x);
    this.y = this.y - (this.speed/this.distance) * slowingamount*(this.y - y);
    }
  }
    
  else{
    if (this.spawntimer > 50){
      if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }
    
  }
  if (this.x - this.size < 100){
    this.x = 100+this.size
  } else if (this.x + this.size > 600){
    this.x = 600 - this.size
  }
  if (this.y - this.size < 0){
    this.y = 0+this.size
  } else if (this.y + this.size > 500){
    this.y = 500 - this.size
  }

      
      for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
             this.hp -= bulletDamage;
             bullets[i].delete = 1;
         }
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }
    


    ctx.beginPath();
    ctx.fillStyle = "brown";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "white";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "brown";
    ctx.fill();
    
    
    if (this.hp <= 0){
       this.delete = 1;
    }
    
    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;

    this.spawntimer++;
}

Borderball.prototype.draw = function() {
  this.speed = -1 * (1/(1/18*(wave + 6))) + 3;
  if (this.y - this.size < 0){
    this.y = 0 + this.size
  } else if (this.y + this.size > 500){
    this.y = 500 - this.size
  }
  if (this.x - this.size < 100){
    this.x = 100 + this.size
  } else if (this.x + this.size > 600){
    this.x = 600 - this.size
  }
  
  if (this.x != 600-this.size && this.y == 0+this.size){
    this.x = this.x + this.speed
  } else if (this.x != 100+this.size && this.y == 500-this.size){
    this.x = this.x - this.speed
  } else if (this.x == 100+this.size && this.y != 0+this.size){
    this.y = this.y - this.speed
  } else if (this.x == 600-this.size && this.y != 500-this.size){
    this.y = this.y + this.speed
  }

  if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      this.damage = Math.sqrt(this.speed * wave);
      if (this.damage > 10){
        this.damage = 10;
      }
      hp -= this.damage
      if (hp <= 0){
        hp = 0;
      }
    }

  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
};

Bullet.prototype.draw = function() {
    if (this.dirX != 0){
    this.x += -1*(bulletSpeed/Math.sqrt(Math.abs(Math.pow(this.dirX, 2) + Math.pow(this.dirY, 2))))*this.dirX;
    this.y += -1*(bulletSpeed/Math.sqrt(Math.abs(Math.pow(this.dirX, 2) + Math.pow(this.dirY, 2))))*this.dirY;

    console.log(this.dirX)
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    }
    if (this.x > 600 || this.x < 100 || this.y > 500 || this.y < 0){
       this.delete = 1;
    }
    
    
};

function Enemy(hp, size, speed) {
    this.maxhp = hp;
    this.hp = this.maxhp;
    this.size = size;
        this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    this.speedx = Math.random() + 0.5;
    this.speedy = Math.random() + 0.5;
    this.speed = speed;
    this.basespeedx = this.speedx;
    this.basespeedy = this.speedy;
    this.speedx*=this.speed;
    this.speedy*=this.speed;
    this.goingright = Math.round(Math.random());
    this.goingup = Math.round(Math.random());
    this.spawntimer = 0;
    this.delete = 0;
}
Enemy.prototype.draw = function() {
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }
    
    if (this.spawntimer > 50){
    if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }
    
    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
             this.hp -= bulletDamage;
             bullets[i].delete = 1;
         }
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }
    

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "grey";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    
    
    if (this.hp <= 0){
       this.delete = 1;
    }
    
    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;

    this.spawntimer++;
};



function LiquidEnemy(hp, size, speed) {
    this.maxhp = hp;
    this.hp = this.maxhp;
    this.size = size;
        this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    this.speedx = Math.random() + 0.5;
    this.speedy = Math.random() + 0.5;
    this.speed = speed;
    this.basespeedx = this.speedx;
    this.basespeedy = this.speedy;
    this.speedx*=this.speed;
    this.speedy*=this.speed;
    this.goingright = Math.round(Math.random());
    this.goingup = Math.round(Math.random());
    this.spawntimer = 0;
    this.delete = 0;
}
LiquidEnemy.prototype.draw = function() {
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 170){
      this.speedx = this.basespeedx * this.speed * 4;
      this.speedy = this.basespeedy * this.speed * 4;
      if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
        this.speedx = this.basespeedx * this.speed * slowingamount * 4;
        this.speedy = this.basespeedy * this.speed * slowingamount * 4;
      }
    }
    
    if (this.spawntimer > 50){
    if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }
    
    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
             this.hp -= bulletDamage;
             bullets[i].delete = 1;
         }
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed * 4;
      if (hp <= 0){
        hp = 0;
      }
    }
    

    ctx.beginPath();
    ctx.fillStyle = "navy";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "lightskyblue";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "navy";
    ctx.fill();
    
    
    if (this.hp <= 0){
       this.delete = 1;
    }
    
    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;

    this.spawntimer++;
};

function SlowerEnemy(hp, size, speed, range) {
    this.maxhp = hp;
    this.range = range;
    this.hp = this.maxhp;
    this.size = size;
       this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    this.speedx = Math.random() + 0.5;
    this.speedy = Math.random() + 0.5;
    this.speed = speed;
    this.basespeedx = this.speedx;
    this.basespeedy = this.speedy;
    this.speedx*=this.speed;
    this.speedy*=this.speed;
    this.spawntimer = 0;
    this.goingright = Math.round(Math.random());
    this.goingup = Math.round(Math.random());
    this.delete = 0;
}
SlowerEnemy.prototype.draw = function() {
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }
    if (this.spawntimer > 50){
    if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }
    
    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
             this.hp -= bulletDamage;
             bullets[i].delete = 1;
         }
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.range){
      if (this.spawntimer > 50){
      slowed = 1;
      }
    }


    
    
    ctx.beginPath();
    ctx.fillStyle = "rgba(147, 219, 224, 0.3)";
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.fillStyle = "rgba(147, 219, 224, 1)";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "darkblue";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(147, 219, 224, 1)";
    ctx.fill();
    
    
    if (this.hp <= 0){
       this.delete = 1;
    }
    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;

    this.spawntimer++;
};

function DisablingEnemy(hp, size, speed, range) {
    this.maxhp = hp;
    this.range = range;
    this.hp = this.maxhp;
    this.size = size;
       this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    this.speedx = Math.random() + 0.5;
    this.speedy = Math.random() + 0.5;
    this.speed = speed;
    this.basespeedx = this.speedx;
    this.basespeedy = this.speedy;
    this.speedx*=this.speed;
    this.speedy*=this.speed;
    this.spawntimer = 0;
    this.goingright = Math.round(Math.random());
    this.goingup = Math.round(Math.random());
    this.delete = 0;
}
DisablingEnemy.prototype.draw = function() {
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }
    if (this.spawntimer > 50){
    if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }
    
    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
             this.hp -= bulletDamage;
             bullets[i].delete = 1;
         }
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.range){
      if (this.spawntimer > 50){
      canShoot = 0;
      intheaura = 1;
      }
    }


    
    
    ctx.beginPath();
    ctx.fillStyle = "rgba(233, 11, 11, 0.3)";
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.fillStyle = "rgb(238, 93, 93)";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "black";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(238, 93, 93)";
    ctx.fill();
    
    
    if (this.hp <= 0){
       this.delete = 1;
    }
    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;

    this.spawntimer++;
};

function ShieldEnemy(hp, size, speed, shieldTime, noShieldTime) {
    this.maxhp = hp;
    this.hp = this.maxhp;
    this.size = size;
        this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    this.speedx = Math.random() + 0.5;
    this.speedy = Math.random() + 0.5;
    this.speed = speed;
    this.basespeedx = this.speedx;
    this.basespeedy = this.speedy;
    this.speedx*=this.speed;
    this.speedy*=this.speed;
    this.goingright = Math.round(Math.random());
    this.goingup = Math.round(Math.random());
    this.timer = 0;
    this.spawntimer = 0;
    this.shieldTime = shieldTime;
    this.noShieldTime = noShieldTime;
    this.shield = 0;
    this.delete = 0;
}
ShieldEnemy.prototype.draw = function() {

    if (this.shield == 0){
      if (this.timer >= this.noShieldTime){
        this.shield = 1;
        this.timer = 0;
      } 
    } 
    if (this.shield == 1){
      if (this.timer >= this.shieldTime){
        this.shield = 0;
        this.timer = 0;
      } 
    }
    this.timer ++; 
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }
    
    if (this.spawntimer > 50){
    if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }

    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
            if (this.shield == 0){
              this.hp -= bulletDamage;
            }
             bullets[i].delete = 1;
         }
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }
    


     if (this.shield == 1){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size*10/9, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.fillStyle = "silver";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "white";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "silver";
    ctx.fill();
    
    
    
    if (this.hp <= 0){
       this.delete = 1;
    }
    
    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;

    this.spawntimer++;
};
function DelayShieldEnemy(hp, size, speed, shieldTime, noShieldTime, delay) {
    this.maxhp = hp;
    this.hp = this.maxhp;
    this.size = size;
        this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    this.speedx = Math.random() + 0.5;
    this.speedy = Math.random() + 0.5;
    this.speed = speed;
    this.basespeedx = this.speedx;
    this.basespeedy = this.speedy;
    this.speedx*=this.speed;
    this.speedy*=this.speed;
    this.goingright = Math.round(Math.random());
    this.goingup = Math.round(Math.random());
    this.timer = 0;
    this.spawntimer = 0;
    this.delay = 0;
    this.delaytime = delay;
    this.shieldTime = shieldTime;
    this.noShieldTime = noShieldTime;
    this.shield = 0;
    this.delete = 0;
}
ShieldEnemy.prototype.draw = function() {

    if (this.shield == 0){
      if (this.timer >= this.noShieldTime){
        this.shield = 1;
        this.timer = 0;
      } 
    } 
    if (this.shield == 1){
      if (this.timer >= this.shieldTime){
        this.shield = 0;
        this.timer = 0;
      } 
    }
    if (this.delay >= this.delaytime){
        this.delay ++;
    }
    else{
        this.timer ++;
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }
    
    if (this.spawntimer > 50){
    if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }

    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
            if (this.shield == 0){
              this.hp -= bulletDamage;
            }
             bullets[i].delete = 1;
         }
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }
    


     if (this.shield == 1){
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size*10/9, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.fillStyle = "silver";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "white";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "silver";
    ctx.fill();
    
    
    
    if (this.hp <= 0){
       this.delete = 1;
    }
    
    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;

    this.spawntimer++;
};

function IceEnemy(hp, size, speed, reload) {
    this.maxhp = hp;
    this.hp = this.maxhp;
    this.size = size;
        this.variation = getRandomInt(1, 3);
   this.x = getRandomInt(1, 3);
    if (this.x == 1 && x - 100 > this.size * 2){
      this.x = 100 + this.size;
      if (this.variation == 1){
      this.x += getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x > this.size * 2){
      this.x = 600-this.size;
      if (this.variation == 1){
      this.x -= getRandomInt(0, 350-this.size)
      }
    } else if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100 + this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 1 && x - 100 <= this.size * 2){
      if (600 - x > this.size * 2){
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      }
    }
    if (this.x == 2 && 600 - x <= this.size * 2){
      if (x - 100 > this.size * 2){
        this.x = 100+this.size;
        if (this.variation == 1){
        this.x += getRandomInt(0, 350-this.size)
        }
      } else {
        this.x = 600-this.size;
        if (this.variation == 1){
        this.x -= getRandomInt(0, 350-this.size)
        }
      }
    }
    this.y = getRandomInt(1, 3);
    if (this.y == 1 && y > this.size * 2){
      this.y = this.size;
      if (this.variation == 2){
      this.y += getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y > this.size * 2){
      this.y = 500-this.size;
      if (this.variation == 2){
      this.y -= getRandomInt(0, 250-this.size)
      }
    } else if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 1 && y <= this.size * 2){
      if (500 - y > this.size * 2){
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      }
    }
    if (this.y == 2 && 500 - y <= this.size * 2){
      if (y > this.size * 2){
        this.y = this.size;
        if (this.variation == 2){
        this.y += getRandomInt(0, 250-this.size)
        }
      } else {
        this.y = 500-this.size;
        if (this.variation == 2){
        this.y -= getRandomInt(0, 250-this.size)
        }
      }
    }
    this.speedx = Math.random() + 0.5;
    this.speedy = Math.random() + 0.5;
    this.speed = speed;
    this.basespeedx = this.speedx;
    this.basespeedy = this.speedy;
    this.speedx*=this.speed;
    this.speedy*=this.speed;
    this.goingright = Math.round(Math.random());
    this.goingup = Math.round(Math.random());
    this.spawntimer = 0;
    this.delete = 0;
    this.reloadtime = 0;
    this.reload = reload;
}
IceEnemy.prototype.draw = function() {
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
      this.speedx = this.basespeedx * this.speed * slowingamount;
      this.speedy = this.basespeedy * this.speed * slowingamount;
    }

    if (this.spawntimer > 50){
    if (this.goingright == 1){
        this.x+=this.speedx;
    }
    else{
        this.x-=this.speedx;
    }
    if (this.goingup == 1){
        this.y-=this.speedy;
    }
    else{
        this.y+=this.speedy;
    }
    }
    if (this.x>600-this.size){
        this.goingright = 0;
    }
    if (this.y>500-this.size){
        this.goingup = 1;
    }
    if (this.x<100+this.size){
        this.goingright = 1;
    }
    if (this.y<0+this.size){
        this.goingup = 0;
    }

    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
             this.hp -= bulletDamage;
             bullets[i].delete = 1;
         }
    }

    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }


    ctx.beginPath();
    ctx.fillStyle = "darkviolet";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "rgb(35, 25, 96)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "darkviolet";
    ctx.fill();


    if (this.hp <= 0){
       this.delete = 1;
    }

    this.speedx = this.basespeedx * this.speed;
    this.speedy = this.basespeedy * this.speed;

    if (this.reloadtime>this.reload){
        this.reloadtime = 0;
        enemies.push(new IceBullet(this.x, this.y))
    }
    this.spawntimer++;
    this.reloadtime ++;
};

function IceBullet(bulletx, bullety){
    this.x = bulletx;
    this.y = bullety;
    this.delete = 0;
    this.dirX = 7.5/Math.sqrt(Math.pow((this.x-x), 2) + Math.pow((this.y-y), 2))*(this.x-x);
    this.dirY = 7.5/Math.sqrt(Math.pow((this.x-x), 2) + Math.pow((this.y-y), 2))*(this.y-y);
}

IceBullet.prototype.draw = function(){
    this.x -= this.dirX;
    this.y -= this.dirY;
    if (Math.sqrt(Math.pow((this.x-x), 2) + Math.pow((this.y-y), 2)) <= 7+playersize){
        if (frozentimer > 110){
        frozen = true;
        frozentimer = 0;
        }
        this.delete = 1;
    }
    if (this.x > 600 || this.x < 100 || this.y > 500 || this.y < 0){    
        this.delete = 1;
    }

    ctx.beginPath();
    ctx.fillStyle = "darkviolet";
    ctx.arc(this.x, this.y, 7, 0, Math.PI * 2);
    ctx.fill();
}

function IcicleEnemy(hp, size, speed, delay) {
    this.maxhp = hp;
    this.hp = this.maxhp;
    this.size = size;
    this.speed = speed;
    this.delay = delay;
    this.switch = 1;
    this.delaytimer = 0;
    this.basespeed = this.speed;
    this.direction = getRandomInt(1, 5);
    if (this.direction == 1){
        this.x = getRandomInt(125, 575);
        this.y = this.size;
    } else if (this.direction == 2){
        this.x = 600-this.size;
        this.y = getRandomInt(25, 475);
    } else if (this.direction == 3){
        this.x = getRandomInt(125, 575);
        this.y = 500-this.size;   
    } else if (this.direction == 4){
        this.x = 100+this.size;
        this.y = getRandomInt(25, 475)
    }
    this.spawntimer = 0;
    this.delete = 0;
}
IcicleEnemy.prototype.draw = function() {
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= 100 + attributes[6]*7 + this.size && attributes[6]>0){
      this.speed = this.basespeed * slowingamount;
    }
    
    if (this.spawntimer > 50 && this.delaytimer > this.delay){
        if (this.direction == 1){
            this.y += this.speed * this.switch
        }
        if (this.direction == 2){
            this.x += this.speed * this.switch
        }
        if (this.direction == 3){
            this.y += -this.speed * this.switch
        }
        if (this.direction == 4){
            this.x += -this.speed * this.switch
        }
    }
    
    if (this.x > 600-this.size || this.x < 100+this.size || this.y > 500-this.size || this.y < this.size){
        this.switch *= -1;
        this.delaytimer = 0;
        if (this.x > 600-this.size){
            this.x = 600-this.size;
        }
         if (this.x < 100+this.size){
            this.x = 100+this.size;
        }
         if (this.y > 500-this.size){
            this.y = 500-this.size;
        }
         if (this.y < this.size){
            this.y = this.size;
        }
    }
    
    for (var i = 0; i < bullets.length; i++) {
         var distx = bullets[i].x - this.x;
         var disty = bullets[i].y - this.y;
         var dist = Math.pow(Math.pow(distx, 2) + Math.pow(disty, 2), 0.5);
         if (dist<this.size + 2){
             this.hp -= bulletDamage;
             bullets[i].delete = 1;
         }
    }
    
    if (Math.sqrt(Math.pow(this.x-x ,2) + Math.pow(this.y-y, 2)) <= this.size + playersize){
      hp -= this.speed;
      if (hp <= 0){
        hp = 0;
      }
    }
    

    ctx.beginPath();
    ctx.fillStyle = "rgb(80, 63, 191)";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*8/9, 0, Math.PI * 2 * this.hp/this.maxhp);
    ctx.fillStyle = "cyan";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size*7/9, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(80, 63, 191)";
    ctx.fill();
    
    
    if (this.hp <= 0){
       this.delete = 1;
    }
    
    this.speed = this.basespeed;

    this.spawntimer++;
    this.delaytimer++;
};























canvas.addEventListener("click", function(event){
    if (reloadTimer<0 && autofire%2 != 1){
        if (canShoot == 1){
            bullets.push(new Bullet(x, y));
            reloadTimer = bulletReload;
        }
    }
});
canvas.addEventListener("mousemove", function(e){
  mouseX = e.clientX - canvas.offsetLeft;
  mouseY = e.clientY - canvas.offsetTop;
});

function update() {
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, 700, 500);

    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    if (wave%6!=0){
    ctx.fillText("Wave "+wave, canvas.width/2, canvas.height/2);
    } else if (wave%6 == 0 && wave%30 != 0){
    ctx.fillText("BOSS Wave "+wave, canvas.width/2, canvas.height/2);
    } else if (wave%30 == 0){
    ctx.fillText("MEGA BOSS Wave "+wave, canvas.width/2, canvas.height/2);
    }
    ctx.beginPath();
    ctx.fillRect(98, 0, 2, 600);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.fillRect(600, 0, 2, 600);
    ctx.fillStyle = "black";
    ctx.fill();
    
    
    
    //Slowing Amount
    slowingamount = (Math.pow(0.96, attributes[6]))/2 + 0.35;
    
    
    
    
    
    if (autofire%2 == 1 &&reloadTimer < 0){
        if (canShoot == 1){
        reloadTimer = bulletReload;
        bullets.push(new Bullet(x, y));
        }
    }


    
        ctx.font = "18px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Attributes", 50, 40);
    ctx.font = "12px Comic Sans MS";
    ctx.fillText("Points: "+upgradepoints, 46, 60);
    ctx.fillText("Tokens: "+bosstokens, 45, 75);
    ctx.fillStyle = "rgba(255, 255, 255, 0.001)";
    ctx.strokeStyle = "black";
        
    ctx.beginPath();
    ctx.arc(30, 110, 27, 27, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, 190, 27, 27, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, 270, 27, 27, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, 350, 27, 27, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(70, 150, 27, 27, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(70, 230, 27, 27, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(70, 310, 27, 27, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
        
        
    ctx.beginPath();
    ctx.arc(30, 110, 25, 25, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, 190, 25, 25, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, 270, 25, 25, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, 350, 25, 25, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(70, 150, 25, 25, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(70, 230, 25, 25, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(70, 310, 25, 25, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    
    if (keys[69] && clicknumberkey === true){
        autofire ++;
        clicknumberkey = 0;
    }

    for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(30, 110, 25 - i/2, 0, 2 * Math.PI * upgradepoints/needed[attributes[0]]);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
    for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(70, 150, 25 - i/2, 0, 2 * Math.PI * upgradepoints/needed[attributes[1]]);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
    for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(30, 190, 25 - i/2, 0, 2 * Math.PI * upgradepoints/needed[attributes[2]]);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
    for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(70, 230, 25 - i/2, 0, 2 * Math.PI * upgradepoints/needed[attributes[3]]);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
    for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(30, 270, 25 - i/2, 0, 2 * Math.PI * upgradepoints/needed[attributes[4]]);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
    for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(70, 310, 25 - i/2, 0, 2 * Math.PI * upgradepoints/needed[attributes[5]]);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }
    for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(30, 350, 25 - i/2, 0, 2 * Math.PI * upgradepoints/needed[attributes[6]]);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }

    if (attributes[0]>5){
        for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(30, 110, 12.5 - i/4, 0, 2 * Math.PI * bosstokens/tokenneeded[attributes[0]]);
        ctx.strokeStyle = "rgba(219, 223, 255, 1)";
        ctx.stroke();
        }
    }
    if (attributes[1]>5){
        for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(70, 150, 12.5 - i/4, 0, 2 * Math.PI * bosstokens/tokenneeded[attributes[1]]);
        ctx.strokeStyle = "rgba(219, 223, 255, 1)";
        ctx.stroke();
        }

    }
    if (attributes[2]>5){
        for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(30, 190, 12.5 - i/4, 0, 2 * Math.PI * bosstokens/tokenneeded[attributes[2]]);
        ctx.strokeStyle = "rgba(219, 223, 255, 1)";
        ctx.stroke();
        }
    }
    if (attributes[3]>5){
        for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(70, 230, 12.5 - i/4, 0, 2 * Math.PI * bosstokens/tokenneeded[attributes[3]]);
        ctx.strokeStyle = "rgba(219, 223, 255, 1)";
        ctx.stroke();
        }
    }
    if (attributes[4]>5){
        for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(30, 270, 12.5 - i/4, 0, 2 * Math.PI * bosstokens/tokenneeded[attributes[4]]);
        ctx.strokeStyle = "rgba(219, 223, 255, 1)";
        ctx.stroke();
        }
    }
    if (attributes[5]>5){
        for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(70, 310, 12.5 - i/4, 0, 2 * Math.PI * bosstokens/tokenneeded[attributes[5]]);
        ctx.strokeStyle = "rgba(219, 223, 255, 1)";
        ctx.stroke();
        }
    }
    if (attributes[6]>5){
        for (var i = 50; i--;){
        ctx.beginPath();
        ctx.arc(30, 350, 12.5 - i/4, 0, 2 * Math.PI * bosstokens/tokenneeded[attributes[6]]);
        ctx.strokeStyle = "rgba(219, 223, 255, 1)";
        ctx.stroke();
        }
    }
    
    
    

    
    ctx.font = "9px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.fillText("< MaxHP", 79, 108);
    ctx.fillText("Regen >", 25, 149);
    ctx.fillText("<", 63, 192);
    ctx.fillText("   Bullet", 77, 186);
    ctx.fillText("   Speed", 77, 198);
    ctx.fillText("Dmg >", 25, 228);
    ctx.fillText("< Reload", 79, 270);
    ctx.fillText("Speed >", 24, 310);
    ctx.fillText("<", 63, 354);
    ctx.fillText("   Slow", 75, 348);
    ctx.fillText("   Aura", 75, 360);

    

   
    
    if (upgradepoints>=needed[attributes[0]]&&bosstokens>=tokenneeded[attributes[0]]){
        ctx.beginPath();
        ctx.arc(30, 110, 25, 25, 0, Math.PI * 2);
        ctx.fillStyle = "lime";
        ctx.fill();
        
        ctx.fillStyle = "black";
        ctx.fillText("Click 1", 30, 110);
        ctx.fillText("[Tier "+attributes[0]+"]", 30, 122);
        if (keys[49] && clicknumberkey === true){
            upgradepoints -= needed[attributes[0]];
            bosstokens -= tokenneeded[attributes[0]];
            attributes[0] = attributes[0] + 1;
            maxhp*=1.05;
            clicknumberkey = 0;
        }
    }
    else{
        ctx.font = "10px Comic Sans MS";
        ctx.fillStyle = "black";
        ctx.fillText("Tier "+attributes[0], 30, 110);
    }
    
    
    if (upgradepoints>=needed[attributes[1]]&&bosstokens>=tokenneeded[attributes[1]]){
        ctx.beginPath();
        ctx.arc(70, 150, 25, 25, 0, Math.PI * 2);
        ctx.fillStyle = "lime";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText("Click 2", 70, 150);
        ctx.fillText("[Tier "+attributes[1]+"]", 70, 162);
        if (keys[50] && clicknumberkey === true){
            upgradepoints -= needed[attributes[1]];
            bosstokens -= tokenneeded[attributes[1]];
            attributes[1] = attributes[1] + 1;
            hpregen *= 1.05;
            clicknumberkey = 0;
        }
    }
    else{
        ctx.fillStyle = "black";
        ctx.fillText("Tier "+attributes[1], 70, 150);
    }

    if (upgradepoints>=needed[attributes[2]]&&bosstokens>=tokenneeded[attributes[2]]){
        ctx.beginPath();
        ctx.arc(30, 190, 25, 25, 0, Math.PI * 2);
        ctx.fillStyle = "lime";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText("Click 3", 30, 190);
        ctx.fillText("[Tier "+attributes[2]+"]", 30, 202);
        if (keys[51] && clicknumberkey === true){
            upgradepoints -= needed[attributes[2]];
            bosstokens -= tokenneeded[attributes[2]];
            attributes[2] = attributes[2] + 1;
            bulletSpeed *= 1.05;
            clicknumberkey = 0;
        }
    }
    else{
        ctx.fillStyle = "black";
        ctx.fillText("Tier "+attributes[2], 30, 190);
    }

    if (upgradepoints>=needed[attributes[3]]&&bosstokens>=tokenneeded[attributes[3]]){
        ctx.beginPath();
        ctx.arc(70, 230, 25, 25, 0, Math.PI * 2);
        ctx.fillStyle = "lime";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText("Click 4", 70, 230);
        ctx.fillText("[Tier "+attributes[3]+"]", 70, 242);
        if (keys[52] && clicknumberkey === true){
            upgradepoints -= needed[attributes[3]];
            bosstokens -= tokenneeded[attributes[3]];
            attributes[3] = attributes[3] + 1;
            bulletDamage *= 1.1;
            clicknumberkey = 0;
        }
    }
    else{
        ctx.fillStyle = "black";
        ctx.fillText("Tier "+attributes[3], 70, 230);
    }
    
    if (upgradepoints>=needed[attributes[4]]&&bosstokens>=tokenneeded[attributes[4]]){
        ctx.beginPath();
        ctx.arc(30, 270, 25, 25, 0, Math.PI * 2);
        ctx.fillStyle = "lime";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText("Click 5", 30, 270);
        ctx.fillText("[Tier "+attributes[4]+"]", 30, 282);
        if (keys[53] && clicknumberkey === true){
            upgradepoints -= needed[attributes[4]];
            bosstokens -= tokenneeded[attributes[4]];
            attributes[4] = attributes[4] + 1;
            bulletReload *= 0.96;
            clicknumberkey = 0;
        }
    }
    else{
        ctx.fillStyle = "black";
        ctx.fillText("Tier "+attributes[4], 30, 270);
    }
        
    if (upgradepoints>=needed[attributes[5]]&&bosstokens>=tokenneeded[attributes[5]]){
        ctx.beginPath();
        ctx.arc(70, 310, 25, 25, 0, Math.PI * 2);
        ctx.fillStyle = "lime";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText("Click 6", 70, 310);
        ctx.fillText("[Tier "+attributes[5]+"]", 70, 322);
        if (keys[54] && clicknumberkey === true){
            upgradepoints -= needed[attributes[5]];
            bosstokens -= tokenneeded[attributes[5]];
            attributes[5] = attributes[5] + 1;
            speed *= 1.05;
            clicknumberkey = 0;
        }
    }
    else{
        ctx.fillStyle = "black";
        ctx.fillText("Tier "+attributes[5], 70, 310);
    }
    

    if (upgradepoints>=needed[attributes[6]]&&bosstokens>=tokenneeded[attributes[6]]){
        ctx.beginPath();
        ctx.arc(30, 350, 25, 25, 0, Math.PI * 2);
        ctx.fillStyle = "lime";
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.fillText("Click 7", 30, 350);
        ctx.fillText("[Tier "+attributes[6]+"]", 30, 362);
        if (keys[55] && clicknumberkey === true){
            upgradepoints -= needed[attributes[6]];
            bosstokens -= tokenneeded[attributes[6]];
            attributes[6] = attributes[6] + 1;
            clicknumberkey = 0;
        }
    }
    else{
        ctx.fillStyle = "black";
        ctx.fillText("Tier "+attributes[6], 30, 350);
    }
      
    
    ctx.fillStyle = "black";

    for (var i = 0; i < bullets.length; i++) {
         bullets[i].draw();
         if(bullets[i].delete == 1){
             bullets.splice(i, 1);
         }
    }
    for (var i = 0; i < enemies.length; i++) {
         enemies[i].draw();
         if(enemies[i].delete == 1){
             enemies.splice(i, 1);
         }
    }
     for (var i = 0; i < powerups.length; i++) {
         powerups[i].draw();
         if(powerups[i].delete == 1){
             powerups.splice(i, 1);
         }
     }
    for (var i = 0; i < borderballs.length; i++) {
         borderballs[i].draw();
     }

    if (frozen == false){
    if (keys[38] || keys[87]) {
        if (slowed == 0){
          velY = -speed;
        } else if (slowed == 1){
          velY = -speed/2;
        }
    }
    
    if (keys[40] || keys[83]) {
        if (slowed == 0){
          velY = speed;
        } else if (slowed == 1){
          velY = speed/2;
        }
    }
    if (keys[39] || keys[68]) {
        if (slowed == 0){
          velX = speed;
        } else if (slowed == 1){
          velX = speed/2;
        }
    }
    if (keys[37] || keys[65]) {
        if (slowed == 0){
          velX = -speed;
        } else if (slowed == 1){
          velX = -speed/2;
        }
    }
    }
    if (keys[81]) {
        time = regularEnemySpawnRate - 1;
        enemies = [];
    }
    if (keys[189]) {
        time = regularEnemySpawnRate;
        enemies = [];
    }
    if (keys[186]) {
        upgradepoints++;
    }
    if (keys[220]){
        upgradepoints+=540;
        bosstokens+=36;
    }
    if (keys[222]) {
        bosstokens++;
    }
    if (keys[191]) {
        attributes = [50, 50, 50, 50, 50, 50, 50];
    }
    
    velY *= friction;
    y += velY;
    velX *= friction;
    x += velX;

    if (x >= 592) {
        x = 592;
    } else if (x <= 108) {
        x = 108;
    }

    if (y > 492) {
        y = 492;
    } else if (y <= 8) {
        y = 8;
    }
    slowed = 0;
    if (hp != maxhp){
      hp += hpregen/10;
      if (hp > maxhp){
        hp = maxhp;
      }
    }
    ctx.beginPath();
    if (frozen == false){
    ctx.fillStyle = "black";
    }
    else{
    ctx.fillStyle = "darkviolet";
    }
    ctx.arc(x, y, playersize, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(x, y, playersize - 2, 0, Math.PI * 2 * hp/maxhp);
    ctx.fill();
    ctx.beginPath();
    if (frozen == false){
    ctx.fillStyle = "black";
    }
    else{
    ctx.fillStyle = "darkviolet";
    }
    ctx.arc(x, y, playersize - 4, 0, Math.PI * 2);
    ctx.fill();
    if (attributes[6]>0){
    ctx.beginPath();
    ctx.fillStyle = "rgba(157, 230, 180, 0.25)";
    ctx.arc(x, y, 100 + attributes[6]*7, 0, Math.PI * 2);
    ctx.fill();
    }
    
    reloadTimer --;
    

    if (time==0){
        enemies.push(new Enemy(5, 25, 1));
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        // enemies.push(new SlowerEnemy(50, 10, 1, 200));
        // enemies.push(new ShieldEnemy(25, 25, 1, 60, 60));
        borderballs.push(new Borderball(120, 20, 1, 20));
        borderballs.push(new Borderball(580, 20, 1, 20));
        borderballs.push(new Borderball(120, 480, 1, 20));
        borderballs.push(new Borderball(580, 480, 1, 20));
    }
    
    
    if (time >= regularEnemySpawnRate){
        if (wave % 30 == 0){
          regularEnemySpawnRate = 1000;
          upgradepoints+=15;
          bosstokens += 2;
        }
        upgradepoints++;
        if (wave % 6 == 0){
            upgradepoints+=4;
        }
        wave++;
        regularEnemySpawnRate += 50;

        var homingspeed = (Math.pow(time, 0.5)*1/14 + 17)/7 - 1;
        if (homingspeed>1.5){homingspeed = 1.5;}
        var multiplier = 0.8;
        var testwave = wave;
        while (testwave > 0){
        testwave -= 30;
        multiplier *= 1/((Math.ceil(testwave/30))*4.5 + 1) + 1.007;
        }
        if (multiplier<1){multiplier = 1;}
        
        if (wave == 2){
            enemies.push(new Enemy(30, 25, 1));
        } else if (wave == 3){
            enemies.push(new Enemy(50, 25, 1));
        } else if (wave == 4){
            enemies.push(new SlowerEnemy(50, 25, 1, 200));
        } else if (wave == 5){
            enemies.push(new Enemy(50, 25, 1));
            enemies.push(new SlowerEnemy(50, 25, 1, 200));
        } else if (wave == 6){
            enemies.push(new Enemy(150, 35, 1));
            enemies.push(new SlowerEnemy(150, 35, 1, 200));
        } else if (wave == 7){
            enemies.push(new Enemy(29, 25, 2));
            enemies.push(new SlowerEnemy(29, 25, 2, 200));
        } else if (wave == 8){
            enemies.push(new Enemy(35, 25, 2));
            enemies.push(new SlowerEnemy(15, 25, 0.5, 200));
            enemies.push(new SlowerEnemy(15, 25, 0.5, 200));
            enemies.push(new SlowerEnemy(15, 25, 0.5, 200));
        } else if (wave == 9){
            enemies.push(new Enemy(35, 25, 2));
            enemies.push(new Enemy(40, 30, 1.5));
            enemies.push(new Enemy(45, 35, 1));
            enemies.push(new SlowerEnemy(15, 30, 0.5, 200));
            enemies.push(new SlowerEnemy(20, 35, 0.5, 200));
            enemies.push(new SlowerEnemy(10, 25, 3, 200));
        } else if (wave == 10){
            for (var i = 0; i < 20; i++){
            enemies.push(new Enemy(11, 15, 0.5));
            }
        } else if (wave == 11){
            for (var i = 0; i < 5; i++){
            enemies.push(new SlowerEnemy(11, 15, 0.5, 200));
            }
            for (var i = 0; i < 15; i++){
            enemies.push(new Enemy(11, 15, 0.5));
            }
        } else if (wave == 12){
            for (var i = 0; i < 30; i++){
            enemies.push(new Enemy(22, 25, 1));
            }
            for (var i = 0; i < 10; i++){
            enemies.push(new SlowerEnemy(22, 25, 1, 200));
            }
        } else if (wave == 13){
            for (var i = 0; i < 50; i++){
            enemies.push(new Enemy(9, 15, 0.5));
            }
        } else if (wave == 14){
            for (var i = 0; i < 40; i++){
            enemies.push(new Enemy(9, 15, 0.5));
            }
            enemies.push(new Enemy(50, 15, 3));
        } else if (wave == 15){
            for (var i = 0; i < 5; i++){
            enemies.push(new SlowerEnemy(25, 15, 1.5, 150));
            }
            for (var i = 0; i < 25; i++){
            enemies.push(new Enemy(25, 15, 0.5));
            }
            enemies.push(new Enemy(60, 25, 3));
            enemies.push(new Enemy(60, 25, 3));
        } else if (wave == 16){
            enemies.push(new HomingEnemy(60, 25, 1, 150));
            enemies.push(new HomingEnemy(60, 25, 1, 150));
        } else if (wave == 17){
            enemies.push(new HomingEnemy(60, 25, 1, 150));
            enemies.push(new HomingEnemy(60, 25, 1, 150));
            enemies.push(new HomingEnemy(60, 25, 1, 150));
        } else if (wave == 18){
            enemies.push(new HomingEnemy(120, 25, 0.9, 150));
            enemies.push(new HomingEnemy(120, 25, 0.9, 150));
            for (var i = 0; i < 8; i++){
            enemies.push(new SlowerEnemy(25, 15, 1.5, 150));
            }
        } else if (wave == 19){
            for (var i = 0; i < 8; i++){
            enemies.push(new HomingEnemy(25, 15, 0.9, 150));
            }
        } else if (wave == 20){
            for (var i = 0; i < 8; i++){
            enemies.push(new HomingEnemy(25, 15, 0.9, 150));
            }
            enemies.push(new Enemy(80, 30, 3));
        } else if (wave == 21){
            for (var i = 0; i < 12; i++){
            enemies.push(new HomingEnemy(25, 15, 0.9, 150));
            }
            enemies.push(new Enemy(85, 32, 2.5));
        } else if (wave == 22){
            for (var i = 0; i < 9; i++){
            enemies.push(new HomingEnemy(25, 15, 0.9, 150));
            enemies.push(new SlowerEnemy(25, 15, 0.9, 200));
            }
            enemies.push(new Enemy(85, 32, 2.5));
        } else if (wave == 23){
            for (var i = 0; i < 19; i++){
            enemies.push(new HomingEnemy(25, 15, 0.9, 150));
            }
            for (var i = 0; i < 5; i++){
            enemies.push(new SlowerEnemy(25, 15, 0.9, 200));
            }
            enemies.push(new SlowerEnemy(85, 32, 3, 200));
            enemies.push(new Enemy(85, 32, 3, 200));
        } else if (wave == 24){
            for (var i = 0; i < 19; i++){
            enemies.push(new HomingEnemy(25, 15, 0.6, 150));
            }
            for (var i = 0; i < 5; i++){
            enemies.push(new SlowerEnemy(25, 15, 0.6, 200));
            }
            enemies.push(new Enemy(80, 30, 3));
            enemies.push(new Enemy(110, 35, 2.5));
            enemies.push(new Enemy(140, 40, 2));
            enemies.push(new Enemy(170, 45, 1.5));
            
        } else if (wave == 25){
            for (var i = 0; i < 11; i++){
            enemies.push(new SlowerEnemy(25, 15, 0.9, 200));
            }
            for (var i = 0; i < 11; i++){
            enemies.push(new Enemy(15, 10, 3));
            }
            
        } else if (wave == 26){
            for (var i = 0; i < 11; i++){
            enemies.push(new SlowerEnemy(25, 15, 0.9, 200));
            }
            for (var i = 0; i < 11; i++){
            enemies.push(new HomingEnemy(15, 10, 1.5, 150));
            }
            
        } else if (wave == 27){
            for (var i = 30; i--;){
            enemies.push(new Enemy(20, 15, 3));
            }
            
        }  else if (wave == 28){
            for (var i = 32; i--;){
            enemies.push(new HomingEnemy(20, 15, 1, 150));
            }
            
        }  else if (wave == 29){
            for (var i = 10; i--;){
            enemies.push(new SlowerEnemy(10, 15, 0.4, 200));
            }
            for (var i = 10; i--;){
            enemies.push(new HomingEnemy(10, 15, 0.4, 150));
            }
            for (var i = 15; i--;){
            enemies.push(new Enemy(10, 15, 2));
            }
        } else if (wave == 30){
            for (var i = 10; i--;){
            enemies.push(new SlowerEnemy(10, 15, 1.2, 200));
            }
            for (var i = 15; i--;){
            enemies.push(new HomingEnemy(20, 15, 0.6, 150));
            }
            for (var i = 20; i--;){
            enemies.push(new Enemy(30, 15, 2.4));
            }
        } else if (wave == 31){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(80, 25, 0.5, 70, 25, 6, 5));
        } else if (wave == 32){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(80, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(80, 25, 0.5, 70, 25, 6, 5));
        } else if (wave == 33){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(80, 25, 0.5, 70, 25, 6, 5));
        for (var i = 10; i--;){
            enemies.push(new SlowerEnemy(10, 15, 1.2, 200));
        }
        } else if (wave == 34){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(100, 25, 0.5, 70, 25, 6, 5));
        for (var i = 11; i--;){
            enemies.push(new SlowerEnemy(10, 15, 1.2, 200));
        }
        } else if (wave == 35){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(80, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(80, 25, 0.5, 70, 25, 6, 5));
        for (var i = 12; i--;){
            enemies.push(new SlowerEnemy(10, 15, 1.2, 200));
        }
        } else if (wave == 36){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        for (var i = 13; i--;){
            enemies.push(new SlowerEnemy(10, 15, 1.2, 200));
        }
        } else if (wave == 37){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        for (var i = 13; i--;){
            enemies.push(new Enemy(10, 15, 2));
        }
        } else if (wave == 38){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        for (var i = 20; i--;){
            enemies.push(new HomingEnemy(10, 15, 1));
        }
        } else if (wave == 39){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        for (var i = 5; i--;){
            enemies.push(new SniperEnemy(10, 15, 1, 120, 15, 6, 4));
        }
        } else if (wave == 40){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        for (var i = 9; i--;){
            enemies.push(new SniperEnemy(10, 15, 1, 120, 15, 6, 4));
        }
        } else if (wave == 41){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(90, 25, 0.5, 70, 25, 6, 5));
        for (var i = 10; i--;){
            enemies.push(new SniperEnemy(15, 15, 1, 120, 15, 6, 4));
        }
        } else if (wave == 42){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new SniperEnemy(150, 25, 0.5, 70, 25, 6, 5));
        enemies.push(new SniperEnemy(150, 25, 0.5, 70, 25, 6, 5));
        for (var i = 10; i--;){
            enemies.push(new SniperEnemy(30, 15, 1.2, 120, 15, 6, 4));
        }
        } else if (wave == 43){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        for (var i = 3; i--;){
            enemies.push(new SniperEnemy(70, 25, 1.5, 70, 25, 6, 5));
        }
        } else if (wave == 44){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        for (var i = 5; i--;){
            enemies.push(new SniperEnemy(70, 25, 1.6, 70, 25, 6, 5));
            enemies.push(new SlowerEnemy(30, 15, 1, 100));
            
        }
        } else if (wave == 45){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        for (var i = 4; i--;){
            enemies.push(new SniperEnemy(70, 25, 1.4, 70, 25, 6, 5));
            enemies.push(new SlowerEnemy(30, 15, 1, 100));
            enemies.push(new Enemy(30, 15, 1.9, 200));
        }
        } else if (wave == 46){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(100, 35, 1, 100));
        } else if (wave == 47){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(200, 35, 1.4, 80));
        } else if (wave == 48){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(300, 35, 1.7, 60));
        enemies.push(new ExploderEnemy(300, 35, 1.7, 60));
        enemies.push(new ExploderEnemy(300, 35, 1.7, 60));
        } else if (wave == 49){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(500, 40, 1, 50));
        } else if (wave == 50){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(600, 40, 1, 40));
        } else if (wave == 51){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(700, 40, 1, 32));
        } else if (wave == 52){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(800, 40, 1.2, 28));
        } else if (wave == 53){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(900, 40, 1.4, 24));
        } else if (wave == 54){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(1500, 40, 1.7, 16));
        } else if (wave == 55){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(200, 20, 2, 50));
        enemies.push(new ExploderEnemy(200, 20, 2, 50));
        for (var i = 0; i < 11; i++){
            enemies.push(new Enemy(15, 10, 2));
        }
        } else if (wave == 56){
        //hp, size, speed, reload, bulletDamage, bulletSpeed, bulletSize
        enemies.push(new ExploderEnemy(200, 20, 2, 50));
        enemies.push(new ExploderEnemy(200, 20, 2, 50));
        for (var i = 0; i < 11; i++){
            enemies.push(new HomingEnemy(15, 10, 1.5, 150));
        }
        } else if (wave == 57){
        for (var i = 3; i--;){
            enemies.push(new SniperEnemy(100, 35, 1, 60, 30, 5, 5));
        }
        enemies.push(new ExploderEnemy(100, 35, 1, 60));
        } else if (wave == 58){
        for (var i = 3; i--;){
            enemies.push(new SniperEnemy(150, 35, 1, 50, 30, 5, 5));
         
        }
        enemies.push(new ExploderEnemy(150, 35, 1, 60));
        } else if (wave == 59){
        for (var i = 2; i--;){
            enemies.push(new SniperEnemy(200, 35, 1, 40, 30, 5, 5));
        }
        enemies.push(new ExploderEnemy(200, 35, 1, 50));
        } else if (wave == 60){
        for (var i = 2; i--;){
            enemies.push(new SniperEnemy(400, 40, 1.5, 22, 30, 5, 5));
            enemies.push(new ExploderEnemy(400, 40, 1.5, 22));
        }
        
        } else if (wave == 61){
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(100, 35, 1.2, 60, 60));
          }
        } else if (wave == 62){
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(100, 35, 1.2, 60, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(100, 35, 1.2, 60, 60));
          }
        } else if (wave == 63){
          for (var i = 3; i--;){
          enemies.push(new ShieldEnemy(100, 35, 1.2, 60, 60));
          }
        } else if (wave == 64){
          for (var i = 6; i--;){
          enemies.push(new ShieldEnemy(90, 35, 1.2, 60, 60));
          }
        } else if (wave == 65){
          for (var i = 10; i--;){
          enemies.push(new ShieldEnemy(80, 35, 1.2, 60, 60));
          }
        } else if (wave == 66){
          for (var i = 14; i--;){
          enemies.push(new ShieldEnemy(70, 35, 1.2, 60, 60));
          }
        } else if (wave == 67){
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(100, 35, 1.2, 60, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(100, 35, 1.2, 40, 40));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(100, 35, 1.2, 40, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(100, 35, 1.2, 60, 40));
          }
        }else if (wave == 68){
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(120, 40, 1.2, 60, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(120, 45, 1.2, 40, 40));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(120, 40, 1.2, 40, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(120, 45, 1.2, 60, 40));
          }
        }else if (wave == 69){
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 20, 1.2, 60, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 25, 1.2, 40, 40));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 20, 1.2, 40, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 25, 1.2, 60, 40));
          }
          enemies.push(new Enemy(200, 35, 1.2));
        }else if (wave == 70){
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(60, 20, 1.2, 60, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 25, 1.2, 40, 40));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(60, 20, 1.2, 40, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 25, 1.2, 60, 40));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(60, 20, 1.2, 60, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 25, 1.2, 40, 40));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(60, 20, 1.2, 40, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 25, 1.2, 60, 40));
          }
        }else if (wave == 71){
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 20, 1.2, 60, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 25, 1.2, 40, 40));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 20, 1.2, 40, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(80, 25, 1.2, 60, 40));
          }
          enemies.push(new SniperEnemy(400, 40, 1.5, 22, 30, 5, 5));
          enemies.push(new SlowerEnemy(30, 15, 1, 200));
          enemies.push(new SlowerEnemy(30, 15, 1, 200));
          enemies.push(new SlowerEnemy(30, 15, 1, 200));
        }else if (wave == 72){
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(300, 40, 1.2, 60, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(300, 35, 1.2, 40, 40));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(300, 40, 1.2, 40, 60));
          }
          for (var i = 1; i--;){
          enemies.push(new ShieldEnemy(300, 35, 1.2, 60, 40));
          }
          for (var i = 2; i--;){
          enemies.push(new SlowerEnemy(30, 15, 1, 200));
          enemies.push(new SniperEnemy(15, 35, 1, 50, 30, 5, 5));
          }
          enemies.push(new ExploderEnemy(400, 40, 0.2, 20));
        }else if (wave == 73){
          enemies.push(new LiquidEnemy(160, 35, 0.5));
        }else if (wave == 74){
          enemies.push(new LiquidEnemy(180, 25, 0.6));
          enemies.push(new LiquidEnemy(180, 25, 0.6));
        }else if (wave == 75){
          enemies.push(new LiquidEnemy(200, 25, 0.7));
          enemies.push(new LiquidEnemy(200, 25, 0.7));
          enemies.push(new LiquidEnemy(200, 25, 0.7));
        }else if (wave == 76){
          enemies.push(new LiquidEnemy(240, 25, 0.8));
          enemies.push(new LiquidEnemy(240, 25, 0.8));
          enemies.push(new LiquidEnemy(240, 25, 0.8));
          enemies.push(new ShieldEnemy(240, 25, 0.8, 60, 60));
        }else if (wave == 77){
          enemies.push(new LiquidEnemy(280, 30, 1));
          enemies.push(new LiquidEnemy(280, 30, 1));
          enemies.push(new LiquidEnemy(280, 30, 1));
          enemies.push(new LiquidEnemy(280, 30, 1));
          enemies.push(new ShieldEnemy(280, 30, 1, 40, 60));
        }else if (wave == 78){
          enemies.push(new LiquidEnemy(320, 35, 2));
          enemies.push(new LiquidEnemy(320, 35, 2));
          enemies.push(new LiquidEnemy(320, 35, 2));
          enemies.push(new LiquidEnemy(320, 35, 2));
          enemies.push(new LiquidEnemy(320, 35, 2));
        }else if (wave == 79){
          enemies.push(new IcicleEnemy(150, 25, 2, 90));
        }else if (wave == 80){
          enemies.push(new IcicleEnemy(150, 25, 3, 90));
          enemies.push(new IcicleEnemy(150, 25, 3, 90));
          enemies.push(new IcicleEnemy(150, 25, 3, 90));
          enemies.push(new IcicleEnemy(150, 25, 3, 90));
          enemies.push(new IcicleEnemy(150, 25, 3, 90));
          enemies.push(new IcicleEnemy(150, 25, 3, 90));
        } else if (wave == 81){
          for (var i = 3; i--;){
              enemies.push(new IcicleEnemy(100, 25, 4, 50));
          }
          for (var i = 3; i--;){
              enemies.push(new IcicleEnemy(175, 35, 3, 70));
          }
          for (var i = 3; i--;){
              enemies.push(new IcicleEnemy(250, 45, 2, 90));
          }
        } else if (wave == 82){
          for (var i = 3; i--;){
              enemies.push(new IcicleEnemy(100, 25, 4, 50));
          }
          for (var i = 3; i--;){
              enemies.push(new IcicleEnemy(175, 30, 3, 70));
          }
          for (var i = 3; i--;){
              enemies.push(new IcicleEnemy(250, 35, 2, 90));
          }
          enemies.push(new LiquidEnemy(150, 25, 0.6));
          enemies.push(new LiquidEnemy(150, 25, 0.6));
          enemies.push(new LiquidEnemy(150, 25, 0.6));
          enemies.push(new LiquidEnemy(150, 25, 0.6));
          enemies.push(new SniperEnemy(80, 25, 0.5, 70, 25, 6, 5));
          
        } else if (wave == 83){
          for (var i = 8; i--;){
              enemies.push(new IcicleEnemy(175, 30, 3, 70));
          }
          enemies.push(new LiquidEnemy(150, 25, 0.6));
          enemies.push(new LiquidEnemy(150, 25, 0.6));
          enemies.push(new LiquidEnemy(150, 25, 0.6));
          enemies.push(new SniperEnemy(150, 25, 0.5, 70, 25, 6, 5));
          enemies.push(new ExploderEnemy(150, 45, 0.5, 50));
        } else if (wave == 84){
          for (var i = 6; i--;){
              enemies.push(new IcicleEnemy(30, 15, 5.5, 60));
          }
          for (var i = 6; i--;){
              enemies.push(new IcicleEnemy(45, 20, 4.5, 60));
          }
          for (var i = 6; i--;){
              enemies.push(new IcicleEnemy(60, 25, 3.5, 60));
          }
          for (var i = 6; i--;){
              enemies.push(new IcicleEnemy(75, 30, 2.5, 60));
          }
          for (var i = 6; i--;){
              enemies.push(new IcicleEnemy(90, 35, 1.5, 60));
          }
        } else if (wave == 85){
          enemies.push(new IceEnemy(200, 35, 1.5, 115));
          enemies.push(new IceEnemy(200, 35, 1.5, 115));
        }else if (wave == 86){
          enemies.push(new IceEnemy(100, 33, 2.5, 115));
          enemies.push(new IceEnemy(120, 35, 2.3, 115));
          enemies.push(new IceEnemy(140, 35, 2.1, 115));
          enemies.push(new IceEnemy(160, 36, 1.9, 115));
          enemies.push(new IceEnemy(180, 37, 1.7, 115));
          enemies.push(new IceEnemy(200, 38, 1.5, 115));
          enemies.push(new IceEnemy(220, 39, 1.3, 115));
          enemies.push(new IceEnemy(240, 40, 1.1, 115));
        }else if (wave == 87){
          enemies.push(new IceEnemy(180, 20, 1, 115));
          enemies.push(new IceEnemy(180, 20, 1, 115));
          for (var i = 10; i--;){
              enemies.push(new IcicleEnemy(60, 25, 3, 60));
          }
        }else if (wave == 88){
          enemies.push(new IceEnemy(180, 20, 2, 115));
          enemies.push(new IceEnemy(180, 20, 2, 115));
          for (var i = 12; i--;){
              enemies.push(new IcicleEnemy(60, 25, 3.5, 60));
          }
        }else if (wave == 89){
          enemies.push(new IceEnemy(150, 20, 2.5, 115));
          enemies.push(new IceEnemy(150, 20, 2.5, 115));
          for (var i = 5; i--;){
              enemies.push(new IcicleEnemy(60, 25, 3.5, 60));
              enemies.push(new LiquidEnemy(60, 25, 1));
          }
          enemies.push(new SlowerEnemy(200, 25, 1, 100));
          enemies.push(new SlowerEnemy(200, 25, 1, 100));
        }else if (wave == 90){
          enemies.push(new IceEnemy(110, 20, 3, 115));
          enemies.push(new IceEnemy(110, 20, 3, 115));
          for (var i = 3; i--;){
              enemies.push(new IcicleEnemy(60, 25, 3.5, 60));
              enemies.push(new LiquidEnemy(60, 25, 1));
          }
          enemies.push(new SlowerEnemy(100, 25, 1, 100));
          enemies.push(new SlowerEnemy(100, 25, 1, 100));
          enemies.push(new SniperEnemy(100, 25, 0.5, 120, 25, 6, 5));
          enemies.push(new ExploderEnemy(100, 45, 0.5, 120));
        }else if (wave == 91){
          enemies.push(new DisablingEnemy(100, 45, 0.5, 150));
        }else if (wave == 92){
          enemies.push(new DisablingEnemy(400, 45, 0.6, 150));
          enemies.push(new DisablingEnemy(400, 45, 0.6, 150)); 
        }else if (wave == 93){
          enemies.push(new DisablingEnemy(200, 25, 1.2, 130));
          enemies.push(new DisablingEnemy(300, 35, 0.8, 150));
          enemies.push(new DisablingEnemy(400, 45, 0.4, 170));  
        }else if (wave == 94){
          for (var i = 16; i--;){
              enemies.push(new IcicleEnemy(75, 15, 2, 70));
          }
          enemies.push(new DisablingEnemy(300, 35, 0.8, 150)); 
        }else if (wave == 95){
          for (var i = 16; i--;){
              enemies.push(new Enemy(5, 15, 2.5, 70));
          }
          enemies.push(new DisablingEnemy(50, 25, 1.3, 150)); 
          enemies.push(new DisablingEnemy(50, 25, 1.3, 150)); 
          enemies.push(new DisablingEnemy(50, 25, 1.3, 150)); 
          enemies.push(new DisablingEnemy(50, 25, 1.3, 150)); 
          
        }else if (wave == 96){
          enemies.push(new DisablingEnemy(60, 25, 1.9, 150)); 
          enemies.push(new DisablingEnemy(60, 25, 1.8, 150)); 
          enemies.push(new DisablingEnemy(80, 30, 1.5, 170)); 
          enemies.push(new DisablingEnemy(80, 30, 1.4, 170)); 
          enemies.push(new DisablingEnemy(110, 35, 1.1, 200)); 
          enemies.push(new DisablingEnemy(110, 35, 1, 200)); 

        }else if (wave == 97){
          for (var i = 10; i--;){
              enemies.push(new Enemy(70, 20, 2.9));
          }
        }else if (wave == 98){
          for (var i = 10; i--;){
              enemies.push(new Enemy(80, 50, 1.5));
          }
        }else if (wave == 99){
          for (var i = 6; i--;){
              enemies.push(new Enemy(90, 75, 1));
          }
        }else if (wave == 100){
          for (var i = 30; i--;){
              enemies.push(new Enemy(60, 15, 2.5));
          }
        }else if (wave == 101){
          for (var i = 20; i--;){
              enemies.push(new Enemy(60, 20, 3));
          }
        }else if (wave == 102){
          for (var i = 40; i--;){
              enemies.push(new Enemy(60, 20, 2.2));
          }
        }else if (wave == 103){
          enemies.push(new DisablingEnemy(60, 20, 2.2, 900));
        }
        else{
            
        //If we didn't define any waves, then it goes back to automatic spawning.
            
        if (wave <= 15){
        enemies.push(new Enemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier));
        } else if (wave>15 && wave <=30) {
        enemies.push(new Enemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier));
        enemies.push(new Enemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier));
        } else if (wave > 30 && wave <= 45){
        enemies.push(new Enemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier));
        enemies.push(new HomingEnemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, homingspeed, 150));
        } else if (wave > 45 && wave <= 60){
        enemies.push(new HomingEnemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, homingspeed, 150));
        enemies.push(new HomingEnemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, homingspeed, 150));
        enemies.push(new Enemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier));
        } else if (wave > 60 && wave < 120){
        enemies.push(new HomingEnemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, homingspeed, 150));
        enemies.push(new SniperEnemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier, 70, 25, 6, 5));
        enemies.push(new Enemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier));
        } else if (wave > 120){
        enemies.push(new HomingEnemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, homingspeed, 150));
        enemies.push(new SniperEnemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier, 70, 25, 6, 5));
        enemies.push(new Enemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier));
        enemies.push(new HomingEnemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, homingspeed, 150));
        enemies.push(new SniperEnemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier, 70, 25, 6, 5));
        enemies.push(new Enemy(Math.pow((wave%30)*40, 0.5)*1.8*multiplier + 25, Math.pow((wave%30)*40, 0.5)*0.2*multiplier + 20, Math.pow((wave%30), 0.5)*0.3*multiplier));
        }

            
            
            
            
            
            
            
            
            
            
            
            
            
        }
        time = 0;
    }
    if (enemies.length == 0){
        time = regularEnemySpawnRate;
    }
    
    ctx.beginPath();
    ctx.fillRect(98, 0, 2, 600);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.fillRect(600, 0, 2, 600);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.fillRect(98, 0, 2, 600);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.beginPath();
    ctx.fillRect(600, 0, 2, 600);
    ctx.fillStyle = "black";
    ctx.fill();
    
    time++;
    
    frozentimer ++;
         
    i = getRandomInt(1, 3000);
    if (i == 1){
        powerups.push(new HealthPowerup());
    }
    if (frozentimer > 100){
        frozen = false;
    }
    if (intheaura == 0){canShoot = 1;}
    intheaura = 0;
}


update();

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
    if (clicknumberkey === false){
    clicknumberkey = true;
    }
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
    clicknumberkey = false;
});
