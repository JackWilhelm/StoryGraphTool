class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        
        if(locationData.Choices) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                let local = this.engine.storyData.Locations;
                if ((!choice.Target || (!local[choice.Target].Available || local[choice.Target].Available == "True")) && (!choice.Available || choice.Available == "True")) {
                    this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                }
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if (choice && !choice.Target && choice.Destination) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Mechanism, choice);
        }else if (choice && !choice.Target) {
            choice.Available = "False";
            this.engine.storyData.Locations[choice.Unlocks].Available = "True"
            this.engine.storyData.Locations[choice.Source].Body = this.engine.storyData.Locations[choice.Source].Body2;
            this.engine.show(choice.Response);
            this.engine.gotoScene(Location, choice.Source);
        }else if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class Mechanism extends Location {
    create(key) {
        let MechData = this.engine.storyData.Locations[key.Source][key.Destination];
        this.engine.show(MechData[(Math.floor(Math.random() * MechData.length))]);
        this.engine.gotoScene(Location, key.Source);
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');