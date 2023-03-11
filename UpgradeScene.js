class UpgradeScene extends DataScene {
    constructor(){
        super("UpgradeScene");

        // inhereited from parent
        this.levels;
        this.souls;
        

        //  cost for upgrades based off level
        this.boltCost;
        this.cost.awayCost = 20;
        this.cost.shovelCost = 16;

    }
 
    // Runs before entering the scene, LOAD IMAGES AND SOUND HERE
    preload() {
        //background
        this.load.image('barn', './assets/insideBarn.png');

        this.load.image('arrow', './assets/arrow.png');
        this.load.image('shovel', './assets/shovel.png');
        this.load.image('hyena', './assets/hyena.png');
        this.load.image('bunny', './assets/bunny.png');
    }

    create(){

        console.log(this.levels);

        // Load the game up
        this.loadGame();
        console.log(this.levels);

        // add the barn image
        let barn = this.add.image(220, 400, 'barn');
        barn.setScale(1.38);

        //  TITLE TEXT
        let text = this.add.text(225, 400, "Upgrades!!!", {
            fontSize: '42px'
        });
        text.setOrigin(0.5, 7);
        text.setInteractive();
        this.tweens.add({
            targets: [text],
            duration: 500,
            alpha: 0,
            yoyo: true,
            //repeat: -1
        });

        // this is the back button, taking you back to MainScene ------------------------
        let back = this.add.image(388, 760, 'arrow');
        back.setInteractive();
        back.on('pointerdown', () => {
            this.saveGame();
            this.scene.start("MainScene");
        });


        ////////////////////////////////////////////////////////////////////////////////
        //
        // Create an upgrade icon for the bolt upgrade ------------------------
        let bolt = this.add.image(50, 250, 'bolt');
        bolt.setScale(5);
        bolt.setInteractive();
        bolt.on('pointerdown', () => {
            // If we have enough money
            if (this.souls >= this.cost.boltCost) {
                // pay the money
                this.souls -= this.cost.boltCost;
                // gain a level
                this.levels.bolt++;
                this.cost.boltCost *= 2;

                this.saveGame();
            }
        });

        //
        //  --------- Text for bolt -----------------------------
        //

        this.boltLevel = this.add.text(120, 210, "Bolt LEVEL: 0", {
            fontSize: '26px'
        });
        this.boltDescription = this.add.text(100, 250, "Does extra damage while playing", {
            color: 'light grey'
        });
        this.boltDamageText = this.add.text(120, 275, "Damage: 0");
        this.boltCostText = this.add.text(120, 300, "Cost: 16");


        //////////////////////////////////////////////////////////////////////////////
        //
        // Create an upgrade icon for the 2x "TIMES TWO"  ------------------------
        let timesTwo = this.add.image(50, 435, 'shovel');
        timesTwo.setScale(0.85);
        timesTwo.setInteractive();
        timesTwo.on('pointerdown', () => {
            // if we have enough money
            if(this.souls >= this.cost.shovelCost) {
                // pay the money
                this.souls -= this.cost.shovelCost;
                // gain a level
                this.levels.timesTwoLevel++;
                this.levels.timesTwo += this.levels.timesTwoLevel;
                this.cost.shovelCost *= 2;

                this.saveGame();
            }
        });

        //
        //  /////////   Text for times two shovel /////////////
        //
        this.shovelLevelText = this.add.text(90, 370, "Shovel LEVEL: 0", {
            //fontStyle: 'bold',
            fontSize: '29px',
            color: 'white', 
        });
        this.shovelDescription = this.add.text(90, 405, "Multiplies clicks", {
            fontSize: '25px'
        });
        this.shovelPowerText = this.add.text(105, 440, "1 Click = 1", {
            fontSize: '26px'
        });
        this.shovelCostText = this.add.text(100, 475, "Cost = 16", {
            fontSize: '25px'
        });



        ////////////////////////////////////////////////////////////////////////////////
        //
        //  making sure away levels are working
        console.log(`away level: ${this.levels.away}`);
        console.log(`time between free meat: ${this.levels.awayTime}`);

        //  Create an icon for the away button that gains money while player is away -----------
        //  the away button is a hyenna that attacks the farm while player is away
        let awayCostMultiplier = 20;
        console.log(`away level changed: ${this.levels.away}`);
        //Function that increases cost based on what level youre at
        console.log(`away cost: ${this.cost.awayCost}`);
        let away = this.add.image(50, 600, 'hyena');
        away.setScale(0.1);
        away.setInteractive();
        away.on('pointerdown', () => {
            //if we have enough money
            if(this.souls >= this.cost.awayCost && this.levels.away < 12) {//this.cost.awayCost) {
                // pay the money
                this.souls -= this.cost.awayCost; //this.cost.awayCost;
                // gain a level
                this.levels.awayTime /= 2;
                //round the number to an integer
                this.levels.awayTime = Math.round(this.levels.awayTime);
                //  note the level that was gained
                this.levels.away += 1;
                //Find out what the new cost is
                this.cost.awayCost = Math.pow(this.levels.away, 3) * awayCostMultiplier;
                //troubleshooting
                console.log(`rounded awaytime: ${this.levels.awayTime}`);
                console.log(`away level: ${this.levels.away}`);
                console.log(`time between free meat: ${this.levels.awayTime}`);

                this.saveGame();
            }
        });

        //
        // //////////// ALL THE TEXT STUFF FOR HYENNAS /////////////
        //

        // adding the hyenna level
        this.hyennaLevelText = this.add.text(150, 540, "Hyennas LEVEL: 0", {
            fontSize: '24px',
            color: 'brown'
        });

        //adding the hyenna description
        this.hyennaDescription = this.add.text(130, 570, 
            "Comes and kills the animals\n     while not playing");

        // // adding the hyenna damage text
        this.hyennaDamageText = this.add.text(120, 620, "Killcam: ", {
            fontSize: '20px', 
            color: 'brown'
        });
        //  adding the hyenna cost text
        this.hyennaCostText = this.add.text(130, 645, "Cost: 20", {
            fontSize: '20px',
            color: 'brown'
        });
    

        // Displaying the amount of meat
        this.soulsText = this.add.text(33, 700, "Meats: 0", {
            fontSize: '48px',
            color: 'red'
        });

        //Display total killed animals
        console.log(`total: ${this.totalSouls}`);
        this.totalSoulsText = this.add.text(30, 750, "Total: ");
        this.totalSoulsText.setText(`Total: ${this.totalSouls}`);
        

    }

    update() {

        // adding the hyenna damage and level text
        if (this.levels.away != 1) {
            this.hyennaDamageText.setText(`Killcam: Every ${this.levels.awayTime} seconds`);
            this.hyennaLevelText.setText(`Hyennas LEVEL: ${this.levels.away-1}`);
            this.hyennaCostText.setText(`Cost: ${this.cost.awayCost}`);
        }

        //  adding the shovel damage and level text
        if(this.levels.timesTwoLevel != 0) {
            this.shovelLevelText.setText(`Shovel LEVEL: ${this.levels.timesTwoLevel}`)
            this.shovelPowerText.setText(`1 Click = ${this.levels.timesTwo}`);
            this.shovelCostText.setText(`Cost = ${this.cost.shovelCost}`);
        }

        //adding the bolt damage and level text
        if(this.levels.bolt != 0) {
            this.boltLevel.setText(`Bolt LEVEL: ${this.levels.bolt}`);
            this.boltDamageText.setText(`Damage: ${this.levels.bolt}`);
            this.boltCostText.setText(`Cost: ${this.cost.boltCost}`);
        }

        //  money update
        this.soulsText.setText(`Meat: ${this.souls}`);

        


        // else {
        //     this.add.setText(120, 620, "Killcam: ", {
        //         fontSize: '20px', 
        //         color: 'brown'
        //     });
        // }

        // adding the hyenna damage text
        // if (this.levels.away != 1) {
        //     this.hyennaDamageText.setText(`Killcam: Every ${this.levels.awayTime} seconds`);
        // }
        // else {
        //     this.hyennaDamageText = this.add.text(120, 620, "Killcam: ", {
        //         fontSize: '20px', 
        //         color: 'brown'
        //     });
        // }

        //about of meat

    }
}