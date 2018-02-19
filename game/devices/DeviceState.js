/**
 * Created by PeterWin on 27.01.2018.
 */

const DeviceState = Object.freeze({
	Begin: 'Begin',
	Half: 'Half',	// first step of photon torpedo
	Ready: 'Ready',
	Used: 'Used',		// used in current turn
	Disabled: 'Disabled',	// Отключение устройства для целей сценария
	Dead: 'Dead',
})
module.exports = {DeviceState}
