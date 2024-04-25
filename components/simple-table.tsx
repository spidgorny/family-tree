export function SimpleTable(props: { props: Record<string, any> }) {
	return (
		<table className="table">
			<tbody>
				{Object.entries(props.props).map(([key, value]) => (
					<tr key={key}>
						<td>{key}</td>
						<td>{value}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
