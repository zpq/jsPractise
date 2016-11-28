var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;

document.body.appendChild(canvas)
var points = 0;
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
}
bgImage.src = "../static/images/background.png";

var heroImage = new Image();
heroImage.src = "../static/images/hero.png";

var monsterImage = new Image();
monsterImage.src = "../static/images/monster.png";

var hero = {
    x : canvas.width / 2,
    y : canvas.height / 2,
    speed : 5,
    face : 'd',
    image : heroImage,
    bullets : []
}

var monster = {
    x : 32 + (Math.random() * (canvas.width - 128)),
    y : 32 + (Math.random() * (canvas.height - 128)),
    speed : 2,
    active : true,
    image : monsterImage
}

var render = function() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0)
        ctx.drawImage(heroImage, hero.x, hero.y)
        if (monster.active) {
            ctx.drawImage(monsterImage, monster.x, monster.y);
        }
        renderBullets(hero);
        ctx.fillStyle = "rgb(250, 250, 250)";  
        ctx.font = "24px Helvetica";  
        ctx.textAlign = "left";  
        ctx.textBaseline = "top";  
        ctx.fillText("points: " + points, 32, 32);  
    }
}

var renderBullets = function(owner) {
    for (var i in owner.bullets) {
        var b = owner.bullets[i];
        if (!b.active) continue;
        switch (b.face) {
            case 'l' :
                if (b.x - b.speed >= 0) {
                    b.x -= b.speed;
                } else {
                    ctx.clearRect(b.x, b.x, b.width, b.height);
                    b.active = false;
                }
                break;
            case 'u' :
                if (b.y - b.speed >= 0) {
                    b.y -= b.speed
                } else {
                    ctx.clearRect(b.x, b.x, b.width, b.height);
                    b.active = false;
                }
                break;
            case 'r' :
                if (b.x + b.width + b.speed <= canvas.width) {
                    b.x += b.speed
                } else {
                    ctx.clearRect(b.x, b.x, b.width, b.height);
                    b.active = false;
                }
                break;
            case 'd' :
                if (b.y + b.height + b.speed <= canvas.height) {
                    b.y += b.speed
                }  else {
                    ctx.clearRect(b.x, b.x, b.width, b.height);
                    b.active = false;
                }
                break;
            default :
                break;
        }
        if ((b.x + b.width >= monster.x)
            && (b.x <= monster.x + 32)
            && (b.y + b.height >= monster.y) 
            && (b.y <= monster.y + 32)
        ) {
            b.active = false;
            ctx.clearRect(b.x, b.y, b.width, b.height);
            // monster.active = false
            ctx.clearRect(monster.x, monster.y, 32, 32);
            points++;

            //remake a new monster
            monster.x = 32 + (Math.random() * (canvas.width - 128));
            monster.y = 32 + (Math.random() * (canvas.height - 128));
        }
        if (b.active) {
            ctx.drawImage(b.image, b.x, b.y)
        }
    }
}

var makeBulletHandler = function(b, owner) {
    switch (owner.face) {
        case 'l' :
            b.x = owner.x - b.width
            b.y = owner.y + ((32 - b.width) / 2)
            break; 
        case 'u' :
            b.x = owner.x + 6;
            b.y = owner.y - b.width;
            break;
        case 'r' :
            b.x = owner.x + 32;
            b.y = owner.y + ((32 - b.width) / 2);
            break;
        case 'd' :
            b.x = b.x = owner.x + 6;
            b.y = owner.y + 32;
            break;
        default:
            break;
    }
    b.active = true;
    b.face = owner.face;
    return b; 
}

var makeBullet = function(owner) {
    var obImage = new Image();
    obImage.src = "../static/images/bullet.png";
    var ob = {
        width : 20,
        height : 20,
        x : 0,
        y : 0,
        speed : 1,
        face : owner.face,
        image : obImage
    }
    ob = makeBulletHandler(ob, owner);
    owner.bullets.push(ob);
    ctx.drawImage(ob.image, b.x, b.y)
}

var update = function(direction) {
    switch (direction) {
        case 37:
            if (hero.x - hero.speed >= 0) {
                hero.x -= hero.speed;
                hero.face = 'l';
            }
            break;
        case 38:
            if (hero.y - hero.speed >= 0) {
                 hero.y -= hero.speed;
                 hero.face = 'u';
            }
            break;
        case 39:
            if (hero.x + 32 + hero.speed <= canvas.width) {
                 hero.x += hero.speed;
                 hero.face = 'r';
            }
            break; 
        case 40:
            if (hero.y + 32 + hero.speed <= canvas.height) {
                 hero.y += hero.speed;
                 hero.face = 'd';
            }
            break;
        case 32:
            makeBullet(hero)
            break;
        default : 
            console.log("invalid key code");
    }
}

var keyListener = function() {
    document.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        update(e.keyCode)
        // console.log(e.keyCode)
    }
}

document.body.onload = function() {
    setInterval(render, 1);
    keyListener();
}



























