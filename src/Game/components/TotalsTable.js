<div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Total Play Time</th>
              <th className="p-3 text-left">Total Bench Time</th>
              <th className="p-3 text-left">Current Time</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {roster.map(player => (
              <tr key={player.id} className={activePlayers.includes(player.id) ? 'bg-green-100' : ''}>
                <td className="border-t p-3">{player.name}</td>
                <td className="border-t p-3">{formatTime(player.playTime)}</td>
                <td className="border-t p-3">{formatTime(player.benchTime)}</td>
                <td className="border-t p-3">{formatTime(currentTimes[player.id] || 0)}</td>
                <td className="border-t p-3">
                  <span className={`px-2 py-1 rounded ${activePlayers.includes(player.id) ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                    {activePlayers.includes(player.id) ? 'On Court' : 'Benched'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>