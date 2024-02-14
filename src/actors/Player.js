import React from 'react';
import Entity from "../Entity";
import PropTypes from 'prop-types';
import DataSourceComponent from "../DataSourceComponent";
import {default as PlayerModel} from "../model/actors/Player";
import Cell from "../Cell";

class Player extends DataSourceComponent {

    get player() {
        return this.dataSource;
    }

    get location() {
        return this.player.location;
    }

    get level() {
        return this.props.level;
    }

    getEntityStyle(currentGridLocation) {
        let toRet = {
            display: "none"
        };

        if (currentGridLocation.isValid) {
            // let cellModel = this.level.gameMatrix[spawnLocation.y][spawnLocation.x];
            let cellLocation = Cell.getCellLocation(currentGridLocation);

            toRet.display = "block";
            toRet.position = "absolute";
            toRet.top =  (cellLocation.y - 2) + "px";
            toRet.left = (cellLocation.x - 2) + "px";
            toRet.pointerEvents = "none";
            toRet.overflow = "hidden";
            if (!this.player.editMode) {
                let transitionStr = "top " + this.player.cellTransitionDuration + "s," +
                    " left " + this.player.cellTransitionDuration + "s";
                toRet.webKitTransition = transitionStr; /* Safari */
                toRet.transition = transitionStr;
            }
        }

        return toRet;
    }

    getPlayerEntityGender() {
        switch (this.player.gender) {
            case PlayerModel.MR_PAC_MAN:
                return Entity.DESIGNATOR_PAC_MAN;
            case PlayerModel.MRS_PAC_MAN:
                return Entity.DESIGNATOR_MRS_PAC_MAN;
            default:
                throw new Error("Unknown player gender found");
        }
    }

    getPlayerModifier() {
        if (this.player.isAlive) {
            return this.player.direction;
        }

        return Entity.MODIFIER_DEAD;
    }

    render() {
        return (
            <div className="Player" style={this.getEntityStyle(this.player.location)}>
                <Entity designator={this.getPlayerEntityGender()}
                            modifier={this.getPlayerModifier()}
                            animating={this.player.animating} />
            </div>);
    }
}

Player.propTypes = {
    dataSource: PropTypes.instanceOf(PlayerModel).isRequired,
    animating: PropTypes.bool
};

Player.defaultProps = {
    animating: true
};

export default Player;