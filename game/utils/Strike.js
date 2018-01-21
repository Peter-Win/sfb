/**
 * Created by PeterWin on 21.01.2018.
 */

/**
 * Нанести удары
 * Предполагается, что
 * @param {Game} game	Main game object
 * @return {void}
 */
const makeStrike = game => {
	const info = {type: 'damage', targets: []}
	game.fires.forEach(shot => {

	})
	if (info.targets.length) {
		game.sendInfo(info)
	}
}

class Strike {
	constructor(target, value, direction) {

	}
}

module.exports = {makeStrike, Strike}
