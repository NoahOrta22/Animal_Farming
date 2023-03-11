
class DataScene extends Phaser.Scene {

    constructor(key) {
        super(key);

        //  variables being shared
        this.souls = 0;

        this.totalSouls = 0;
        this.changeAt = 100; //at this number of souls the difficulty will increase
        
        // Levels in upgrades
        this.levels = {
            bolt: 0,
            boltLevel: 0,
            timesTwo: 1, 
            timesTwoLevel: 0,
            away: 1,
            awayTime: 600
        }

        this.cost = {
            //  cost for upgrades based off level
            boltCost: 16,
            awayCost: 20,
            shovelCost: 16
        }
    }

    preload() {
        this.load.audio('instrumental', './assets/elevatorInstrumental.mp3');
    }


    loadGame() {

        //new thing glebe wanted
        let data = loadObjectFromLocal();
        if(data != null) {
            this.souls = data.souls;
            this.totalSouls = data.totalSouls;
            this.levels = data.levels;
            this.cost = data.cost;
            //Process progress since the last time played
            let lastPlayed = data.lastTimePlayed;
            let now = new Date().getTime();
            let s = (now = lastPlayed)/ 1000;
            //calculate how many kills the user has achieved while away
            let soulsGained = Math.floor(s / this.levels.awayTime);
            // if they havent purchased any levels yet
            if(this.levels.away == 1) {
                soulsGained = 0;
            }
            this.souls += soulsGained;
        }



        // // Load the soul count from local storage
        // let savedSouls = localStorage.getItem('souls');
        // // Convert string to number
        // this.souls = parseInt(savedSouls);
        // // If soul count could not be loaded, set it to 0
        // if (isNaN(this.souls)) {
        //     this.souls = 0;
        // }
        // console.log(`total souls: ${this.totalSouls}`);

        // // Load the total soul count from local storage
        // let savedTotalSouls = localStorage.getItem('totalSouls');
        // //Conver string to number
        // this.totalSouls = parseInt(savedTotalSouls);
        // //  If total souls could not be loaded, set it to zero
        // if(isNaN(this.totalSouls)) {
        //     this.totalSouls = this.souls;
        // }

        // // Account for idle progression based on time last played
        // let lastTime = localStorage.getItem('lastPlayed');
        // // Convert string to numeric timestamp
        // let lastStamp = parseInt(lastTime);
        // // If the last time played is a valid number, we will add progress
        // if (!isNaN(lastStamp)) {
        //     // Get the current date-time object (NOW)
        //     let now = new Date();
        //     // Get a timestamp (miliseconds since January 1970)
        //     let nowStamp = now.getTime();
        //     // Subtract the last played timestamp from the NOW timestamp to
        //     // get miliseconds since last played
        //     let ms = nowStamp - lastStamp;
        //     // Convert to seconds
        //     let s = ms / 1000;
        //     //  The amount of money gained based on away upgrade level

        //     let soulsGained = Math.floor(s / this.levels.awayTime);
        //     // if they havent purchased any levels yet
        //     if(this.levels.away == 1) {
        //         soulsGained = 0;
        //     }
        //     this.souls += soulsGained;
        // }

        // // Try to load the levels object
        // let json = localStorage.getItem('levels');
        // this.levels = JSON.parse(json);
        // if (this.levels == null) {
        //     this.levels = {
        //         bolt: 0,
        //         boltLevel: 0,
        //         timesTwo: 1, 
        //         timesTwoLevel: 0,
        //         away: 1, 
        //         awayTime: 600
        //     }
        // }

        // // Try to load the cost objects
        // let json2 = localStorage.getItem('cost');
        // this.cost = JSON.parse(json2);
        // if (this.cost == null) {
        //     this.cost = {
        //         boltCost: 16,
        //         awayCost: 20,
        //         shovelCost: 16
        //     }
        // }
    }


    saveGame() {

        const data = {
            lastPlayed: new Date().getTime(),
            souls: this.souls, 
            totalSouls: this.totalSouls, 
            levels: this.levels, 
            cost: this.cost
        };
        saveObjectToLocal(data);

        // // Save last time that the user played
        // let date = new Date();
        // let numDate = date.getTime();
        // localStorage.setItem('lastPlayed', `${numDate}`);
        // // Save the number of souls
        // localStorage.setItem('souls', `${this.souls}`);
        // //  Save total number of souls
        // localStorage.setItem('totalSouls', `${this.totalSouls}`);
        // // Save levels object as JSON formatted string
        // localStorage.setItem('levels', JSON.stringify(this.levels));
        // // Save cost objects as JSON2 formatted string
        // localStorage.setItem('cost', JSON.stringify(this.cost));
    }

    damage(amount) {
        // Lower the hp of the current monster
        this.hp -= amount;
        // Check if monster is dead
        if (this.hp <= 0 && this.alive) {
            console.log("You killed the animal!");
            // Set monster to no longer be alive
            this.alive = false;
            // Play a death animation
            this.tweens.add({
                // List of things to affect
                targets: [this.animalImage],
                // Duration of animation in ms
                duration: 100,
                // Alpha is transparency, 0 means invisible
                alpha: 0,
                // Scale the image down during animation
                scale: 0.1,
                // Set the angle
                angle: 359,
                // Runs once the death animation is finsihed
                onComplete:
                    () => {
                        // Choose a random new monster to replace the dead one
                        let index = Math.floor(Math.random() * ANIMALS.length);
                        this.setMonster(ANIMALS[index]);
                        // Gain a soul
                        this.souls++;
                        this.totalSouls++;
                        // Save game (and soul gained)
                        this.saveGame();
                    }

            });
        }
    }

}