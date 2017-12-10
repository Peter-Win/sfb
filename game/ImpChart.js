/**
 * Impulse Charts
 * Created by PeterWin on 04.12.2017.
 */

const ImpPhase = {
	BeginOfImp: 'BeginOfImp',
	MoveShips: 'MoveShips',
	ResolveShips: 'ResolveShips',
	MoveSeeking: 'MoveSeeking',
	ResolveSeeking0: 'ResolveSeeking0',
	ResolveSeeking: 'ResolveSeeking',
	CloakUncloak: 'CloakUncloak',
	TractorBeams: 'TractorBeams',
	ResolveTractor: 'ResolveTractor',
	LaunchSeeking: 'LaunchSeeking',
	ResolveLaunch: 'ResolveLaunch',
	ShieldsTransp: 'ShieldsTransp',
	ResolveTransp: 'ResolveTransp',
	RecoverShuttle: 'RecoverShuttle',
	LaunchShuttle: 'LaunchShuttle',
	FireDirect: 'FireDirect',
	ResolveDirect: 'ResolveDirect',
	EndOfImp: 'EndOfImp',
}

const ImpChart = {
	Basic: [
		ImpPhase.BeginOfImp,
		ImpPhase.MoveShips,
		ImpPhase.ResolveShips,
		ImpPhase.MoveSeeking,
		ImpPhase.ResolveSeeking0,
		ImpPhase.ResolveSeeking,
		ImpPhase.CloakUncloak,
		ImpPhase.LaunchSeeking,
		ImpPhase.ResolveLaunch,
		ImpPhase.FireDirect,
		ImpPhase.ResolveDirect,
		ImpPhase.EndOfImp,
	],
	Advanced: [
		ImpPhase.BeginOfImp,
		ImpPhase.MoveShips,
		ImpPhase.ResolveShips,
		ImpPhase.MoveSeeking,
		ImpPhase.ResolveSeeking0,
		ImpPhase.ResolveSeeking,
		ImpPhase.CloakUncloak,
		ImpPhase.TractorBeams,
		ImpPhase.ResolveTractor,
		ImpPhase.LaunchSeeking,
		ImpPhase.ResolveLaunch,
		ImpPhase.ShieldsTransp,
		ImpPhase.ResolveTransp,
		ImpPhase.RecoverShuttle,
		ImpPhase.LaunchShuttle,
		ImpPhase.FireDirect,
		ImpPhase.ResolveDirect,
		ImpPhase.EndOfImp,
	],
}

module.exports = {ImpPhase, ImpChart}
