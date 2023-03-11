class MainScene extends DataScene {

    // This is where we define data members
    constructor() {
        super("MainScene");

        // Monster variables
        this.animalImage = null;
        this.hp = null;
        this.hpText = null;
        this.soulsText = null;
        this.souls = 0;

        //  multiplier for hp
        this.multiplier = 1;

        //  variable for levels -- inherited from parent
        this.levels;
        
        // Status of monster
        this.alive = false;

        this.startedMusic = false;

        
        
    }

    // Runs before entering the scene, LOAD IMAGES AND SOUND HERE
    preload() {
        // this.load.image('kraken', './assets/kraken.png');
        // Loop through monster configuration and load each image
        for (let i = 0; i < ANIMALS.length; i++) {
            this.load.image(ANIMALS[i].name, `./assets/${ANIMALS[i].image}`);
        }
        this.load.image('bolt', './assets/bolt.png');
        this.load.image('door', './assets/door.png');
        this.load.image('plus', './assets/smallerPlus.png');
        this.load.image('2x', './assets/2x.png');
        this.load.image('background', './assets/mainScenery.png');
        this.load.image('sky', './assets/BG_DesertMountains/background1.png');

        // Load sound effects
        this.load.audio('hit', './assets/hit_001.wav');

        //  Load music
        this.load.audio('instrumental2', './assets/Omae Wa Mou.mp3');

    }

    // Runs when we first enter this scene
    create() {
        // Load game data
        this.loadGame();

        // tells the console that the music has been stared
        console.log(this.startedMusic);
     
        //  starts the music
        this.startMusic(); 

       
        //  setting the pointer so that it'll start off doing one damage
        console.log(this.levels);

        //  NOW ADDING THE SKY
        let sky = this.add.image(200, 200, 'sky');

        //FIRST THING THAT NEEDS TO BE LOADED IS THE BACKGROUND
        let background = this.add.image(120, 380, 'background');
        background.setScale(1.17);

        // Set the starting monster
        let index = Math.floor(Math.random() * ANIMALS.length);
        this.setMonster(ANIMALS[index]);
        // Create hp text
        this.hpText = this.add.text(225, 600, "", {
            fontSize: 36
        });
        // Create the souls text
        this.soulsText = this.add.text(30, 50, "Meats: 0", {
            fontSize: '42px',
            color: 'red'
        });

        // the plus icon is the upgrade button
        let plus = this.add.image(400, 750, 'plus');
        plus.setScale(1.3);
        plus.setInteractive();
        plus.on('pointerdown', () => {
            //  takes us back to the upgrade scene
            this.changeScene("UpgradeScene");
        });

        // Create an interval to use bolt damage
        this.boltTimer = setInterval(() => {
            this.damage(this.levels.bolt);
        }, 1000);

        // Save button --- takes us back to home screen -----------------
        let door = this.add.image(50, 750, 'door');
        door.setScale(3);
        door.setInteractive();
        door.on('pointerdown', () => {
            //  pauses the music
            this.instrumental.pause();
            console.log(this.instrumental);
            //takes us back to titleScene
            this.changeScene("TitleScene");
        });

        // Save every 60s           -----------------------------
        this.timer = setInterval(() => {
            this.saveGame();
        }, 60000);
        // Save once on startup, to set the time
        this.saveGame();
    }

    startMusic() {
        if(this.startedMusic == false) {
            this.instrumental = this.sound.add('instrumental2', {
                volume: 0.3,
                loop: -1 
            });
            this.instrumental.play();
            this.startedMusic = true;
        }
        else {
            //  resumes music if it's already started
            console.log('resuming');
            console.log(this.instrumental);
            this.instrumental.resume();
        }
    }

    //  this method runs whenever theres a scene change to reset the interval timer
    //  the key is the scene that you're changing to 
    changeScene(key) {
        this.saveGame();
        clearInterval(this.timer);
        clearInterval(this.boltTimer);
        this.scene.start(key);
    }

    // Runs every frame
    update() {
        if (this.hp > 0) {
            this.hpText.setText(`${this.hp}`);
        } else {
            this.hpText.setText("0");
        }
        this.soulsText.setText(`Meat: ${this.souls}`);
    }

    // damage(amount) {
    //     // Lower the hp of the current monster
    //     this.hp -= amount;
    //     // Check if monster is dead
    //     if (this.hp <= 0 && this.alive) {
    //         console.log("You killed the monster!");
    //         // Set monster to no longer be alive
    //         this.alive = false;
    //         // Play a death animation
    //         this.tweens.add({
    //             // List of things to affect
    //             targets: [this.animalImage],
    //             // Duration of animation in ms
    //             duration: 750,
    //             // Alpha is transparency, 0 means invisible
    //             alpha: 0,
    //             // Scale the image down during animation
    //             scale: 0.1,
    //             // Set the angle
    //             angle: 359,
    //             // Runs once the death animation is finsihed
    //             onComplete:
    //                 () => {
    //                     // Choose a random new monster to replace the dead one
    //                     let index = Math.floor(Math.random() * ANIMALS.length);
    //                     this.setMonster(ANIMALS[index]);
    //                     // Gain a soul
    //                     this.souls++;
    //                     // Save game (and soul gained)
    //                     this.saveGame();
    //                 }

    //         });
    //     }
    // }

    setMonster(monsterConfig) {

        //prints to console the level of times two
        console.log(this.levels.timesTwo);
        // Destroy the old monster's game object
        if (this.animalImage != null) this.animalImage.destroy();

        // Reset hp of the monster
        if(this.totalSouls > this.changeAt) {
            console.log('im a the muliplier part');
            console.log(`multi: ${this.multiplier}`);
            this.changeAt = this.changeAt * 10 + this.totalSouls;
            this.multiplier *= 2;
        }
        else {
            this.hp = monsterConfig.hp * this.multiplier;
        }
        
        this.alive = true;

        // Create a image of monster at position x:225,y:400
        this.animalImage = this.add.image(225, 450, monsterConfig.name);
        // Set the size of the monster
        this.animalImage.setScale(1);
        // Make the monster clickable
        this.animalImage.setInteractive();

        // Handler/callback for the 'pointer down' event
        this.animalImage.on('pointerdown',
            () => {
                // Play a hit sound
                this.sound.play('hit', {
                    volume: 0.02
                });
                
                //this.damage(1);
                this.damage(this.levels.timesTwo); 
            });
    }
}