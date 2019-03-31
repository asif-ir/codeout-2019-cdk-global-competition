const app = require('express')();
const bodyParser = require('body-parser');

const PORT = 8000 || process.env.PORT;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Route handlers
app.get('/', (req, res) => {
    const response = {
        status: 'Up'
    };
    res.status(200)
        .send(response);
});

const sample_output = {
    "humans": [
      {
        "id": 1,
        "x": 670,
        "y": 309,
        "panic": true
      },
      {
        "id": 2,
        "x": 742,
        "y": 27,
        "panic": true
      },
      {
        "id": 3,
        "x": 385,
        "y": 207,
        "panic": false
      },
      {
        "id": 4,
        "x": 364,
        "y": 365,
        "panic": false
      },
      {
        "id": 5,
        "x": 517,
        "y": 361,
        "panic": true
      },
      {
        "id": 6,
        "x": 556,
        "y": 250,
        "panic": true
      },
      {
        "id": 7,
        "x": 45,
        "y": 431,
        "panic": true
      },
      {
        "id": 8,
        "x": 61,
        "y": 87,
        "panic": true
      },
      {
        "id": 9,
        "x": 671,
        "y": 397,
        "panic": false
      },
      {
        "id": 10,
        "x": 818,
        "y": 343,
        "panic": true
      },
      {
        "id": 11,
        "x": 893,
        "y": 310,
        "panic": true
      },
      {
        "id": 12,
        "x": 318,
        "y": 466,
        "panic": false
      },
      {
        "id": 13,
        "x": 114,
        "y": 168,
        "panic": false
      },
      {
        "id": 14,
        "x": 1064,
        "y": 30,
        "panic": true
      },
      {
        "id": 15,
        "x": 634,
        "y": 205,
        "panic": false
      },
      {
        "id": 16,
        "x": 345,
        "y": 322,
        "panic": false
      },
      {
        "id": 17,
        "x": 89,
        "y": 5,
        "panic": false
      },
      {
        "id": 18,
        "x": 347,
        "y": 56,
        "panic": true
      },
      {
        "id": 19,
        "x": 820,
        "y": 493,
        "panic": true
      },
      {
        "id": 20,
        "x": 396,
        "y": 313,
        "panic": false
      }
    ],
    "explode": [
      0,
      1
    ]
}; 

const location = (human_x, human_y, current_zombies) => {
    let x = human_x;
    let y = human_y;

    let current_max = 0;
    let target_zombie = null;

    for (let zombie of current_zombies) {
        const distance_of_zombie = Math.sqrt(Math.pow(x - zombie.x, 2) + Math.pow(y - zombie.y, 2));

        if (distance_of_zombie > current_max) {
            target_zombie = zombie;
        }
    }

    if (target_zombie) {
        const zx = target_zombie.x;
        const zy = target_zombie.y;
        const zgx = target_zombie.goingToX;
        const zgy = target_zombie.goingToY;
        let zxd = zgx-zx;

        // m
        const m = (zgy - zy) / (zgx - zx);

        if ((human_x<=0 || human_x>=1100) || (human_y<=0||human_y>=600)) {
            let c = human_y + (human_x / m);
            x = zxd % 1100;
            y = (-(zxd / m) + c) % 600;
        } else {
            let c = human_y - (m * human_x);
            x = (human_x + (zxd)) % 1100;
            y = ((m * x) + c) % 600;
        }

    }

    return {
        x: parseInt(Math.abs(x)),
        y: parseInt(Math.abs(y))
    };
}

app.post('/1', (req, res) => {
    const humans = req.body.humans || [];

    let result = {
        humans: []
    };
    let global_min = 99999999;
    let global_index = 0;

    for (let human of humans) {
        let target_x = human.x;
        let target_y = human.y;
        let target_panic = false;
        
        let current_min = Math.sqrt(Math.pow(human.x - 1100, 2) + Math.pow(human.y - 600, 2));

        if (current_min < global_min) {
            global_min = current_min;
            global_index = human.id;
        }

        if (human.zombies) {
            let current_zombies = human.zombies;

            let { x, y } = location(target_x, target_y, current_zombies);
            target_x = x;
            target_y = y;
            target_panic = false;
        }

        result.humans.push({
            id: human.id,
            x: target_x,
            y: target_y,
            panic: target_panic
        })
    }

    for (let i in result.humans) {
        if (result.humans[i].id === global_index) {
            result.humans[i].x = 1100;
            result.humans[i].y = 600;
        }
    }

    res.status(200)
        .send(result);
});

app.post('/2', (req, res) => {
    const humans = req.body.humans || [];
    const bombs = req.body.bombs || [];

    let result = {
        humans: [],
        explode: []
    };
    let global_min = 99999999;
    let global_index = 0;

    for (let human of humans) {
        let target_x = human.x;
        let target_y = human.y;
        let target_panic = false;
        
        let current_min = Math.sqrt(Math.pow(human.x - 1100, 2) + Math.pow(human.y - 475, 2));

        if (current_min < global_min) {
            global_min = current_min;
            global_index = human.id;
        }

        if (human.zombies) {
            let current_zombies = human.zombies;

            let { x, y } = location(target_x, target_y, current_zombies);
            target_x = x;
            target_y = y;
            target_panic = false;
        }

        result.humans.push({
            id: human.id,
            x: target_x,
            y: target_y,
            panic: target_panic
        })
    }

    for (let i in result.humans) {
        if (result.humans[i].id === global_index) {
            result.humans[i].x = 1100;
            result.humans[i].y = 475;
        }
    }

    res.status(200)
        .send(result);
});

let hit_count = 0;

app.post('/3', (req, res) => {
    ++hit_count;

    const humans = req.body.humans || [];
    const bombs = req.body.bombs || [];

    let result = {
        humans: [],
        explode: []
    };

    // 1
    let global_min = 99999999;
    let global_index = 0;

    // 2
    let global_min2 = 99999999;
    let global_index2 = 0;

    for (let human of humans) {
        let target_x = human.x;
        let target_y = human.y;
        let target_panic = false;
        
        let current_min = Math.sqrt(Math.pow(human.x - 1100, 2) + Math.pow(human.y - 475, 2));
        let current_min2 = Math.sqrt(Math.pow(human.x - 150, 2) + Math.pow(human.y - 0, 2));

        if (current_min < global_min) {
            global_min = current_min;
            global_index = human.id;
        }
        if (current_min2 < global_min2) {
            global_min2 = current_min2;
            global_index2 = human.id2;
        }

        if (human.zombies) {
            let current_zombies = human.zombies;

            let { x, y } = location(target_x, target_y, current_zombies);
            target_x = x;
            target_y = y;
            target_panic = false;
        }

        result.humans.push({
            id: human.id,
            x: target_x,
            y: target_y,
            panic: target_panic
        })
    }

    for (let i in result.humans) {
        if (result.humans[i].id === global_index) {
            result.humans[i].x = 1100;
            result.humans[i].y = 381;
        }

        if (result.humans[i].id === global_index2) {
            result.humans[i].x = 150;
            result.humans[i].y = 0;
        }
    }

    if (hit_count % 800 == 0) {
        for (const bomb of bombs) {
            result.explode.push(bomb.id);
        }
    }

    res.status(200)
        .send(result);
});

// Running the app
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});