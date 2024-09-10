import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, User } from 'lucide-react';
import Header from './Header';
import SubHistoryMatrix from './components/SubHistoryMatrix';
import ConfigurationEditor from './components/ConfigEditor';

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-xl font-bold">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};
const PlayerCard = ({ player, onCourt, currentTime, totalActiveTime, totalBenchedTime, onSelect, isSelected, onDragStart, onDragOver, onDrop, isGameInProgress }) => {
    const getStatusStyle = () => {
        if (onCourt) {
            return 'bg-green-100 border-green-500';
        }
        return 'bg-yellow-100 border-yellow-500';
    };

    return (
        <div
            className={`rounded-lg p-2 shadow-md ${getStatusStyle()} ${isSelected ? 'ring-2 ring-blue-500' : ''} ${!isGameInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => isGameInProgress && onSelect(player.id)}
            draggable={isGameInProgress && !onCourt}
            onDragStart={(e) => isGameInProgress && onDragStart(e, player.id)}
            onDragOver={(e) => isGameInProgress && onDragOver(e)}
            onDrop={(e) => isGameInProgress && onDrop(e, player.id)}
        ><div className="flex justify-between items-center">
                <h3 className="text-sm font-bold flex items-center">
                    <User className={`mr-1 ${onCourt ? 'text-green-700' : 'text-gray-500'}`} size={16} />
                    {player.name}
                </h3>
                <span className="text-xs font-semibold">
                    {onCourt ? 'On Court' : 'Benched'}
                </span>
            </div>
            <p className="text-xs font-semibold text-blue-700">
                Current: {formatTime(currentTime)}
            </p>
            <p className="text-xs">
                Total Active: {formatTime(totalActiveTime)}
            </p>
            <p className="text-xs">
                Total Benched: {formatTime(totalBenchedTime)}
            </p>
        </div>
    );
};

const Game = () => {
    const [roster, setRoster] = useState([]);
    const [gameTime, setGameTime] = useState(0);
    const [isGameActive, setIsGameActive] = useState(false);
    const [activePlayers, setActivePlayers] = useState([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [currentTimes, setCurrentTimes] = useState({});
    const [swapHistory, setSwapHistory] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [showSwapPreview, setShowSwapPreview] = useState(false);
    const [consecutiveCounts, setConsecutiveCounts] = useState({});
    const [totalActiveTimes, setTotalActiveTimes] = useState({});
    const [totalBenchedTimes, setTotalBenchedTimes] = useState({});
    const [config, setConfig] = useState({
        countUp: true,
        gameDuration: 2400,
        activePlayersLimit: 5,
        consecutiveActiveWarning: 2,
        consecutiveBenchWarning: 2
    });
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [gameState, setGameState] = useState('not_started'); // 'not_started', 'in_progress', 'ended'

    useEffect(() => {
        let interval;
        if (isGameActive && gameState === 'in_progress') {
            interval = setInterval(() => {
                setGameTime(prevTime => {
                    if (config.countUp) {
                        return prevTime + 1;
                    } else {
                        return prevTime > 0 ? prevTime - 1 : 0;
                    }
                });
                setCurrentTimes(prevTimes => {
                    const newTimes = { ...prevTimes };
                    activePlayers.forEach(id => {
                        newTimes[id] = (newTimes[id] || 0) + 1;
                    });
                    return newTimes;
                });
                setTotalActiveTimes(prevTimes => {
                    const newTimes = { ...prevTimes };
                    activePlayers.forEach(id => {
                        newTimes[id] = (newTimes[id] || 0) + 1;
                    });
                    return newTimes;
                });
                setTotalBenchedTimes(prevTimes => {
                    const newTimes = { ...prevTimes };
                    roster.forEach(player => {
                        if (!activePlayers.includes(player.id)) {
                            newTimes[player.id] = (newTimes[player.id] || 0) + 1;
                        }
                    });
                    return newTimes;
                });
                setConsecutiveCounts(prevCounts => {
                    const newCounts = { ...prevCounts };
                    roster.forEach(player => {
                        if (activePlayers.includes(player.id)) {
                            newCounts[player.id] = (newCounts[player.id] || 0) + 1;
                        } else {
                            newCounts[player.id] = 0;
                        }
                    });
                    return newCounts;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isGameActive, activePlayers, config.countUp, roster]);

    const addPlayer = () => {
        if (newPlayerName.trim()) {
            const newPlayer = { id: Date.now(), name: newPlayerName.trim() };
            setRoster(prev => [...prev, newPlayer]);
            setCurrentTimes(prev => ({ ...prev, [newPlayer.id]: 0 }));
            setNewPlayerName('');
        }
    };

    const startGame = () => {
        if (roster.length < 5) {
            alert("You need at least 5 players to start the game!");
            return;
        }
        const initialActivePlayers = roster.slice(0, 5).map(p => p.id);
        setSwapHistory([initialActivePlayers]);
        setActivePlayers(initialActivePlayers);
        setGameState('in_progress');
        setIsGameActive(true);
    };

    const endGame = () => {
        setIsGameActive(false);
        setGameState('ended');
    };

    const toggleGameActive = () => {
        if (gameState === 'in_progress') {
            setIsGameActive(!isGameActive);
        }
    };

    const resetGame = () => {
        setGameTime(0);
        setIsGameActive(false);
        setGameState('not_started');
        setCurrentTimes(Object.fromEntries(roster.map(player => [player.id, 0])));
        setActivePlayers([]);
        setSelectedPlayers([]);
        setSwapHistory([]);
    };

    const togglePlayerSelection = (playerId) => {
        setSelectedPlayers(prev =>
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : [...prev, playerId]
        );
        setShowSwapPreview(true);
    };

    const applySwap = () => {
        const newActivePlayers = activePlayers
            .filter(id => !selectedPlayers.includes(id))
            .concat(selectedPlayers.filter(id => !activePlayers.includes(id)));

        if (selectedPlayers.length !== 5) {
            alert("Invalid lineup. Please select exactly 5 players.");
            return;
        }
        setSwapHistory(prev => [...prev, selectedPlayers]);
        setActivePlayers(selectedPlayers);
        newActivePlayers.forEach(id => {
            setCurrentTimes(prev => ({ ...prev, [id]: 0 }));
        });

        setSelectedPlayers([]);
        setShowSwapPreview(false);
    };

    const cancelSwap = () => {
        setSelectedPlayers([]);
        setShowSwapPreview(false);
    };

    const handleDragStart = (e, playerId) => {
        e.dataTransfer.setData('text/plain', playerId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetPlayerId) => {
        e.preventDefault();
        const draggedPlayerId = parseInt(e.dataTransfer.getData('text'));
        const targetPlayer = roster.find(p => p.id === targetPlayerId);

        if (activePlayers.includes(targetPlayerId) && !activePlayers.includes(draggedPlayerId)) {
            setActivePlayers(prev => [
                ...prev.filter(id => id !== targetPlayerId),
                draggedPlayerId
            ]);

            setCurrentTimes(prev => ({
                ...prev,
                [draggedPlayerId]: 0,
                [targetPlayerId]: 0
            }));

            // Show a temporary notification
            const notification = document.createElement('div');
            notification.textContent = `Swapped ${roster.find(p => p.id === draggedPlayerId).name} with ${targetPlayer.name}`;
            notification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg';
            document.body.appendChild(notification);
            setTimeout(() => document.body.removeChild(notification), 3000);
        }
    };

    return (
        <div>
            <Header
                gameTime={gameTime}
                isGameActive={isGameActive}
                onStartStop={toggleGameActive}
                onOpenConfig={() => setIsConfigOpen(true)}
                onStartGame={startGame}
                onEndGame={endGame}
                gameState={gameState}
            />
            <div className="p-4 bg-gray-100 min-h-screen">
                <div className="mb-4 flex">
                    <input
                        type="text"
                        value={newPlayerName}
                        onChange={(e) => setNewPlayerName(e.target.value)}
                        placeholder="Enter player name"
                        className="border p-2 flex-grow rounded-l"
                    />
                    <button onClick={addPlayer} className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600">Add</button>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2 text-blue-800">On Court</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {roster.filter(player => activePlayers.includes(player.id)).map(player => (
                            <PlayerCard
                                key={player.id}
                                player={player}
                                onCourt={true}
                                currentTime={currentTimes[player.id] || 0}
                                totalActiveTime={totalActiveTimes[player.id] || 0}
                                totalBenchedTime={totalBenchedTimes[player.id] || 0}
                                onSelect={togglePlayerSelection}
                                isSelected={selectedPlayers.includes(player.id)}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                isGameInProgress={gameState === 'in_progress'}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-2 text-blue-800">On Bench</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {roster.filter(player => !activePlayers.includes(player.id)).map(player => (
                            <PlayerCard
                                key={player.id}
                                player={player}
                                onCourt={false}
                                currentTime={currentTimes[player.id] || 0}
                                totalActiveTime={totalActiveTimes[player.id] || 0}
                                totalBenchedTime={totalBenchedTimes[player.id] || 0}
                                onSelect={togglePlayerSelection}
                                isSelected={selectedPlayers.includes(player.id)}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                isGameInProgress={gameState === 'in_progress'}
                            />
                        ))}
                    </div>
                </div>
                <SubHistoryMatrix
                    swapHistory={swapHistory}
                    roster={roster}
                    activePlayers={activePlayers}
                />
                {showSwapPreview && (
                    <div className="fixed inset-x-0 bottom-0 bg-white p-4 shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Next Lineup Preview</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {selectedPlayers.map(playerId => {
                                const player = roster.find(p => p.id === playerId);
                                return (
                                    <div key={playerId} className="bg-blue-100 px-2 py-1 rounded">
                                        {player.name}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={cancelSwap} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                            <button onClick={applySwap} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                                Sub
                            </button>
                        </div>
                    </div>
                )}
                {gameState === 'ended' && (
                    <button
                        onClick={resetGame}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Start New Game
                    </button>
                )}
            </div>
            <Modal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)}>
                <ConfigurationEditor config={config} setConfig={setConfig} />
            </Modal>
        </div>

    );
};

export default Game;