const SubHistoryMatrix = ({ swapHistory, roster, activePlayers }) => {
  if (swapHistory.length === 0) return null;

  const sections = swapHistory.map((swap, index) => `Section ${index + 1}`);

  return (
    <div className="overflow-x-auto mt-8">
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3 text-left">Player</th>
            {sections.map((section, index) => (
              <th key={index} className="p-3 text-center">{section}</th>
            ))}
            <th className="p-3 text-center">Current Status</th>
          </tr>
        </thead>
        <tbody>
          {roster.map(player => (
            <tr key={player.id} className={activePlayers.includes(player.id) ? 'bg-green-100' : ''}>
              <td className="border-t p-3 font-semibold">{player.name}</td>
              {swapHistory.map((swap, index) => (
                <td key={index} className="border-t p-3 text-center">
                  {swap.includes(player.id) ? '✅' : '❌'}
                </td>
              ))}
              <td className="border-t p-3 text-center">
                {activePlayers.includes(player.id) ? (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">Active</span>
                ) : (
                  <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-sm">Benched</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubHistoryMatrix;