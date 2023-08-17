import './History.scss';

interface HistoryProps {
	matchs: Array<{ id: number; opponent: string; scores: string; result: string }>;
	onClick: () => void;
}

function History({ matchs, onClick }: HistoryProps) {
	// State (état, données)

	// Comportement
	return (
		<div className="history">
			<h1>Match History</h1>
			<div className="match">
				{matchs.map((match: {
					id:number; result: any; scores: string; opponent: string;
				}) => (
					<div className={`matchList ${match.result}`} key={match.id}>
						<h2>Moi</h2>
						<p>{match.scores}</p>
						<h2>{match.opponent}</h2>
					</div>
				))}
			</div>
			<button onClick={onClick}>Add</button>
		</div>
	);
}

export default History;