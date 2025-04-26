'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const supabase = createClient(
  'https://otlixcdsstrdwxhzddrz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bGl4Y2Rzc3RyZHd4aHpkZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjMxMDAsImV4cCI6MjA2MTA5OTEwMH0.F_Kb7KEbNCbTSXI5f_e3VUBb_z1SRnh7VoXCAxvU5t0'
);

export default function HostPage() {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameId, setGameId] = useState(1);
  const [phase, setPhase] = useState<'day' | 'night'>('day');
  const [status, setStatus] = useState<'waiting' | 'in_progress' | 'completed'>('waiting');

  useEffect(() => {
    if (authorized) {
      loadPlayers();
      loadGameInfo();

      const playerSub = supabase
        .channel('players')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload) => {
          loadPlayers();
        })
        .subscribe();

      const gameSub = supabase
        .channel('games')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, (payload) => {
          if (payload.new) {
            const data = payload.new as { phase: 'day' | 'night'; status: string };
            setPhase(data.phase);
            setStatus(data.status);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(playerSub);
        supabase.removeChannel(gameSub);
      };
    }
  }, [authorized, gameId]);

  const loadPlayers = async () => {
    const { data } = await supabase.from('players').select('*').eq('game_id', gameId);
    if (data) setPlayers(data);
  };

  const loadGameInfo = async () => {
    const { data } = await supabase.from('games').select('phase, status').eq('game_number', gameId).single();
    if (data) {
      setPhase(data.phase);
      setStatus(data.status);
    }
  };

  const startNewGame = async () => {
    const newGameId = gameId + 1;
    await supabase.from('games').insert({ game_number: newGameId, phase: 'day', status: 'waiting' });
    setGameId(newGameId);
    setPhase('day');
    setStatus('waiting');
    setPlayers([]);
  };

  const startGame = async () => {
    await supabase.from('games').update({ status: 'in_progress' }).eq('game_number', gameId);
    setStatus('in_progress');
  };

  const endGame = async () => {
    await supabase.from('games').update({ status: 'completed' }).eq('game_number', gameId);
    setStatus('completed');
  };

  const togglePhase = async () => {
    const newPhase = phase === 'day' ? 'night' : 'day';
    await supabase.from('games').update({ phase: newPhase }).eq('game_number', gameId);
    setPhase(newPhase);
  };

  const checkPassword = () => {
    if (password === '1357') {
      setAuthorized(true);
    } else {
      alert('Wrong password');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Host Panel</h1>

      {!authorized ? (
        <div className="w-full max-w-sm">
          <Input
            type="password"
            placeholder="Enter host password"
            className="mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" onClick={checkPassword}>
            Access
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          <div className="text-xl">
            <p>Game #{gameId}</p>
            <p>Phase: {phase === 'day' ? '☀️ Day' : '🌙 Night'}</p>
            <p>Status: {status}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={togglePhase}>Toggle Day/Night</Button>
            {status === 'waiting' && <Button onClick={startGame} className="bg-green-600">Start Game</Button>}
            {status === 'in_progress' && <Button onClick={endGame} className="bg-red-600">End Game</Button>}
            <Button onClick={startNewGame} className="bg-blue-600">New Game</Button>
          </div>

          <div className="bg-white text-black rounded p-4">
            <h2 className="text-lg font-bold mb-2">Players</h2>
            <ul>
              {players.map(p => (
                <li key={p.id} className="text-left mb-1"><strong>{p.name}</strong>: {p.role}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
