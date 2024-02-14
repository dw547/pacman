import DataSourceBase from "./DataSourceBase";

const active_player_1 = 1;
const active_player_2 = 2;
const valid_active_players = [active_player_1, active_player_2];

class GameFooter extends DataSourceBase {

    static get ACTIVE_PLAYER_1() { return active_player_1; }
    static get ACTIVE_PLAYER_2() { return active_player_2; }

    constructor(player1, player2, level, activePlayer) {
        super();

        if (valid_active_players.indexOf(activePlayer) < 0) {
            throw new Error("Invalid Active Player");
        }

        if (player1.gender === player2.gender) {
            throw new Error("Players should have different genders");
        }

        this._player1 = this._wireUp("_player1", player1);
        this._player2 = this._wireUp("_player2", player2);
        this._level = this._wireUp("_level", level);
        this._activePlayer = activePlayer;
        this._powerUps = null;
        this._numLives = 0;

        if (this._activePlayer === GameFooter.ACTIVE_PLAYER_1) {
            this._numLives = this._player1._numLives;
        } else {
            this._numLives = this._player2._numLives;
        }
    }

    _nestedDataSourceChanged(e) {

        if (e.object === this._player1 &&
            e.source === "_numLives" &&
            this._activePlayer === GameFooter.ACTIVE_PLAYER_1) {

            this.numLives = this._player1.numLives;
            super._nestedDataSourceChanged(e);
        } else if (e.object === this._player2 &&
                   e.source === "_numLives" &&
                   this._activePlayer === GameFooter.ACTIVE_PLAYER_2) {

            this.numLives = this._player2.numLives;
            super._nestedDataSourceChanged(e);
        }

    }

    get activePlayer() {
        return this._activePlayer;
    }

    set activePlayer(value) {
        if (value === GameFooter.ACTIVE_PLAYER_1) {
            this.numLives = this._player1.numLives;
        } else {
            this.numLives = this._player2.numLives;
        }

        this._setValueAndRaiseOnChange("_activePlayer", value);
    }

    getActivePlayerGender() {
        if (this._activePlayer === GameFooter.ACTIVE_PLAYER_1) {
            return this._player1.gender;
        }

        return this._player2.gender;
    }

    get powerUps() {
        return this._level.powerUps;
    }

    get numLives() {
        return this._numLives;
    }

    set numLives(value) {
        this._setValueAndRaiseOnChange("_numLives", value);
    }

    get level() {
        return this._level;
    }

    set level(value) {
        if (this._level) {
            this._unWire(this._level);
            this._level = null;
        }

        this._setValueAndRaiseOnChange("_level", value);
    }
}

export default GameFooter;