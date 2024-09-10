import React from 'react';
import { Users, Play, Pause, Settings, PlayCircle, StopCircle } from 'lucide-react';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const Header = ({ gameTime, isGameActive, onStartStop, onOpenConfig, onStartGame, onEndGame, gameState }) => {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
          <Users size={32} className="text-orange-500" />
          <span>Sub<span className="text-orange-500">Squad</span></span>
        </div>
        
        <div className="flex items-center space-x-4">
          {gameState === 'not_started' && (
            <button 
              onClick={onStartGame}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
            >
              <PlayCircle size={24} className="mr-2" />
              Start Game
            </button>
          )}
          {gameState === 'in_progress' && (
            <>
              <button 
                onClick={onStartStop}
                className={`p-2 rounded-full ${isGameActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                disabled={!isGameActive}
              >
                {isGameActive ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white" />}
              </button>
              
              <div className="text-2xl font-bold">
                {formatTime(gameTime)}
              </div>
              
              <button 
                onClick={onEndGame}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
              >
                <StopCircle size={24} className="mr-2" />
                End Game
              </button>
            </>
          )}
          {gameState === 'ended' && (
            <div className="text-xl font-bold text-gray-600">
              Game Ended
            </div>
          )}
          
          <button 
            onClick={onOpenConfig}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;