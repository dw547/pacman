import GameObjectContainer from "./GameObjectContainer";
import Level from "./Level";
import Location from "./Location";
import moment from "../../node_modules/moment/moment";
import Ghost from "./actors/Ghost";
// import GhostBrainManual from "./actors/GhostBrains/GhostBrainManual";
// import Player from "./actors/Player";

it ("Constructor works", () => {
    let theLevel = new Level();
    new GameObjectContainer(theLevel);
});

it ("Player2 is not undefined", () => {
    let theLevel = new Level();
    let goc = new GameObjectContainer(theLevel);

    expect(goc.player2 !== null).toBe(true);
    expect(goc.player2.numLives > 0).toBe(true);
});

it ("Get Level works", () => {
    // SETUP
    let theLevel = new Level();
    let goc = new GameObjectContainer(theLevel);

    // CALL
    let toCheck = goc.level;

    // ASSERT
    expect(theLevel === toCheck).toBe(true);
});

it ("Set Level works", () => {
    // SETUP
    let theLevel = new Level();
    let goc = new GameObjectContainer(theLevel);
    let level2 = new Level();

    // CALL
    goc.level = level2;

    // ASSERT
    expect(goc.player.level === level2).toBe(true);
    expect(goc.ghostRed.level === level2).toBe(true);
    expect(goc.ghostBlue.level === level2).toBe(true);
    expect(goc.ghostPink.level === level2).toBe(true);
    expect(goc.ghostOrange.level === level2).toBe(true);
    expect(goc.level === level2).toBe(true);
});

it ("moveAllBackToSpawn", () => {
    // SETUP
    let playerSpawnLocation = new Location(0, 0);
    let ghostRedLocation = new Location(1, 1);
    let ghostBlueLocation = new Location(2, 2);
    let ghostPinkLocation = new Location(3, 3);
    let ghostOrangeLocation = new Location(4, 4);

    let theLevel = new Level();
    theLevel.playerSpawnLocation.setWithLocation(playerSpawnLocation);
    theLevel.ghostRedLocation.setWithLocation(ghostRedLocation);
    theLevel.ghostBlueLocation.setWithLocation(ghostBlueLocation);
    theLevel.ghostPinkLocation.setWithLocation(ghostPinkLocation);
    theLevel.ghostOrangeLocation.setWithLocation(ghostOrangeLocation);

    let goc = new GameObjectContainer(theLevel);
    goc.player.location.set(10, 10);
    goc.ghostRed.location.set(11, 11);
    goc.ghostBlue.location.set(12, 12);
    goc.ghostPink.location.set(13, 13);
    goc.ghostOrange.location.set(14, 14);

    // CALL
    goc.moveAllBackToSpawnAndResetActors();

    // ASSERT
    expect(goc.player.location.equals(playerSpawnLocation)).toBe(true);
    expect(goc.ghostRed.location.equals(ghostRedLocation)).toBe(true);
    expect(goc.ghostBlue.location.equals(ghostBlueLocation)).toBe(true);
    expect(goc.ghostPink.location.equals(ghostPinkLocation)).toBe(true);
    expect(goc.ghostOrange.location.equals(ghostOrangeLocation)).toBe(true);
});

it ("checkAndSpawnPowerUp works correctly", () => {
    // SETUP
    let theLevel = new Level();
    let goc = new GameObjectContainer(theLevel);
    goc._powerUpActive = false;
    goc._powerUpSpawnTime = moment().add(120, "s");
    let originalLocation = goc.powerUp.location.clone();
    let now = moment();

    // CALL
    goc.checkAndSpawnPowerUp(now);

    // ASSERT
    expect(goc.powerUp.location.equals(originalLocation)).toBe(true);
});

it ("checkAndSpawnPowerUp works correctly 2", () => {
    // SETUP
    let theLevel = new Level();
    let goc = new GameObjectContainer(theLevel);
    goc._powerUpActive = false;
    goc._powerUpSpawnTime = moment();
    goc.powerUp.location.set(-1, -1);
    let originalLocation = goc.powerUp.location.clone();
    let now = moment().add(1, "s");

    // CALL
    goc.checkAndSpawnPowerUp(now);

    // ASSERT
    expect(!goc.powerUp.location.equals(originalLocation)).toBe(true);
});

it ("if player spawn is not set, gameTimerTickFinished shouldn't do anything", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    let goc = new GameObjectContainer(theLevel);
    let executedActorStep = false;
    goc._gameObjects = [{
        executeActorStep: function (e) {
            executedActorStep = true;
        }
    }];

    // CALL
    goc.gameTimerTickFinished({});

    // ASSERT
    expect(executedActorStep).toBe(false);
});

it ("_killIfCollision will not kill a non-scared ghost", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    let goc = new GameObjectContainer(theLevel);
    goc.ghostRed.scaredState = Ghost.SCARED_STATE_NOT_SCARED;
    goc.ghostRed.location.set(0, 0);
    goc.player._attackModeFinishTime = moment().add(120, "s");
    goc.player.location.set(0, 0);

    // CALL
    goc._killIfCollision(goc.player, goc.ghostRed, moment());

    // ASSERT
    expect(goc.ghostRed.isAlive).toBe(true);
});

it ("_killIfCollision will kill a scared ghost", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    let goc = new GameObjectContainer(theLevel);
    goc.ghostRed.scaredState = Ghost.SCARED_STATE_SCARED;
    goc.ghostRed.location.set(0, 0);
    goc.player._attackModeFinishTime = moment().add(120, "s");
    goc.player.location.set(0, 0);

    // CALL
    goc._killIfCollision(goc.player, goc.ghostRed, moment());

    // ASSERT
    expect(goc.ghostRed.isAlive).toBe(false);
});

it ("_killIfCollision will not kill player with dead ghost", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    let goc = new GameObjectContainer(theLevel);
    goc.ghostRed.scaredState = Ghost.SCARED_STATE_NOT_SCARED;
    goc.ghostRed.isAlive = false;
    goc.ghostRed.location.set(0, 0);
    goc.player._attackModeFinishTime = moment().add(120, "s");
    goc.player.location.set(0, 0);

    // CALL
    goc._killIfCollision(goc.player, goc.ghostRed, moment());

    // ASSERT
    expect(goc.player.isAlive).toBe(true);
});

it ("checkAndSpawnPowerUp picks a random power up and sets it", () => {
    // SETUP
    let theLevel = new Level(2, 2);
    theLevel.levelNum = 8;
    let goc = new GameObjectContainer(theLevel);
    goc._powerUpActive = false;
    goc._powerUpSpawnTime = moment().add(-1, "s");
    goc.powerUp._powerUpType = -1;

    // CALL
    goc.checkAndSpawnPowerUp(moment());

    // ASSERT
    expect(goc.powerUp._powerUpType !== -1).toBe(true);
});

it ("start or resume level should make all this ghost come back alive", ()  => {
    // SETUP
    let theLevel = new Level(2, 2);
    theLevel.levelNum = 8;
    let goc = new GameObjectContainer(theLevel);
    goc.ghostRed.isAlive = false;
    goc.ghostPink.isAlive = false;
    goc.ghostBlue.isAlive = false;
    goc.ghostOrange.isAlive = false;

    // CALL
    goc.startOrRestartLevel();

    // ASSERT
    expect(goc.ghostRed.isAlive).toBe(true);
    expect(goc.ghostPink.isAlive).toBe(true);
    expect(goc.ghostBlue.isAlive).toBe(true);
    expect(goc.ghostOrange.isAlive).toBe(true);

});