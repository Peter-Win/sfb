/**
 * Created by PeterWin on 13.12.2017.
 */

const ActionState = {
	Begin: 'Begin',
	Wait: 'Wait',	// Контроллер взял акцию в работу
	End: 'End',		// контроллер вернул ответ
}

module.exports = {ActionState}
