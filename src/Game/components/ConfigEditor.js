const ConfigurationEditor = ({ config, setConfig }) => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Game Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.countUp}
                onChange={(e) => setConfig({ ...config, countUp: e.target.checked })}
                className="mr-2"
              />
              Count Up
            </label>
          </div>
          {!config.countUp && (
            <div>
              <label className="block">
                Game Duration (seconds):
                <input
                  type="number"
                  value={config.gameDuration}
                  onChange={(e) => setConfig({ ...config, gameDuration: parseInt(e.target.value) })}
                  className="ml-2 border rounded p-1 w-20"
                />
              </label>
            </div>
          )}
          <div>
            <label className="block">
              Active Players Limit:
              <input
                type="number"
                value={config.activePlayersLimit}
                onChange={(e) => setConfig({ ...config, activePlayersLimit: parseInt(e.target.value) })}
                className="ml-2 border rounded p-1 w-20"
              />
            </label>
          </div>
          <div>
            <label className="block">
              Consecutive Active Subs Warning:
              <input
                type="number"
                value={config.consecutiveActiveWarning}
                onChange={(e) => setConfig({ ...config, consecutiveActiveWarning: parseInt(e.target.value) })}
                className="ml-2 border rounded p-1 w-20"
              />
            </label>
          </div>
          <div>
            <label className="block">
              Consecutive Bench Warning:
              <input
                type="number"
                value={config.consecutiveBenchWarning}
                onChange={(e) => setConfig({ ...config, consecutiveBenchWarning: parseInt(e.target.value) })}
                className="ml-2 border rounded p-1 w-20"
              />
            </label>
          </div>
        </div>
      </div>
    );
  };

  export default ConfigurationEditor;