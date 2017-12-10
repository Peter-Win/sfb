/**
 * Turn Chart - Sequences of play
 * Created by PeterWin on 04.12.2017.
 */
const TurnPhase = {
	BeginOfTurn: 'BeginOfTurn',
	BeginOfTurn2: 'BeginOfTurn2',
	AutoEAlloc: 'AutoEAlloc',
	EnergyAlloc: 'EnergyAlloc',
	OnMainEnergyAlloc: 'OnMainEnergyAlloc',
	OnEnergyAlloc: 'OnEnergyAlloc',
	SpeedDeterm: 'SpeedDeterm',
	SensorLockOn: 'SensorLockOn',
	ImpulseProcBegin: 'ImpulseProcBegin',
	ImpulseProc: 'ImpulseProc',
	KlingonMutiny: 'KlingonMutiny',
	Boarding: 'Boarding',
	EndOfTurn: 'EndOfTurn',
}

const TurnChart = {
	Basic: [
		TurnPhase.BeginOfTurn,
		TurnPhase.AutoEAlloc,
		TurnPhase.OnMainEnergyAlloc,
		TurnPhase.OnEnergyAlloc,
		TurnPhase.SpeedDeterm,
		TurnPhase.ImpulseProcBegin,
		TurnPhase.ImpulseProc,
		TurnPhase.EndOfTurn,
	],
	Cadet: [
		TurnPhase.BeginOfTurn,
		TurnPhase.EnergyAlloc,
		TurnPhase.OnMainEnergyAlloc,
		TurnPhase.OnEnergyAlloc,
		TurnPhase.SpeedDeterm,
		TurnPhase.ImpulseProcBegin,
		TurnPhase.ImpulseProc,
		TurnPhase.EndOfTurn,
	],
	Advanced: [
		TurnPhase.BeginOfTurn,
		TurnPhase.EnergyAlloc,
		TurnPhase.OnMainEnergyAlloc,
		TurnPhase.OnEnergyAlloc,
		TurnPhase.SpeedDeterm,
		TurnPhase.SensorLockOn,
		TurnPhase.ImpulseProcBegin,
		TurnPhase.ImpulseProc,
		TurnPhase.KlingonMutiny,
		TurnPhase.Boarding,
		TurnPhase.EndOfTurn,
	],
}

module.exports = {TurnPhase, TurnChart}
