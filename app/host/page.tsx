'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const supabase = createClient(
  'https://otlixcdsstrdwxhzddrz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bGl4Y2Rzc3RyZHd4aHpkZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjMxMDAsImV4cCI6MjA2MTA5OTEwMH0.F_Kb7KEbNCbTSXI5f_e3VUBb_z1SRnh7VoXCAxvU5t0'
);

export default function Host() {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameId, setGameId] = useState(1);
  const [phase, setPhase] = useState<'day' | 'night'>('day');

  const checkPassword = () => {
    if (password === "1357") {
      setAuthorized(true);
      loadRoles();
      fetchCurrentPhase();
    } else {
      alert("Wrong password");
    }
  };

  const loadRoles = async () => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('game_id', gameId);
    setPlayers(data);
  };

  const resetGame = async () => {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('game_id', gameId);
    if (!error) {
      setPlayers([]);
      setGameId((prev) => prev + 1);
      await supabase.from('games').insert({ game_number: gameId + 1, phase: 'day' });
      alert("Game reset successfully.");
    } else {
      alert("Failed to reset game.");
    }
  };

  const fetchCurrentPhase = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('phase')
      .eq('game_number', gameId)
      .single();

    if (!error && data) {
      setPhase(data.phase);
    }
  };

  const togglePhase = async () => {
    const newPhase = phase === 'day' ? 'night' : 'day';
    const { error } = await supabase
      .from('games')
      .update({ phase: newPhase })
      .eq('game_number', gameId);

    if (!error) {
      setPhase(newPhase);
    } else {
      alert("Failed to change phase.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Host Panel</h1>

      {!authorized ? (
        <div className="w-full max-w-sm">
          <Input
            type="password"
            placeholder="Enter host password"
            className="mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" onClick={checkPassword}>Access Roles</Button>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Game #{gameId}</h2>
          <p className="text-lg">Current phase: {phase === 'day' ? '☀️ Day' : '🌙 Night'}</p>
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full" onClick={togglePhase}>
              Toggle Day/Night
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 w-full" onClick={resetGame}>
              New Game
            </Button>
          </div>
          <ul className="bg-white text-black rounded p-4">
            {players.map((p) => (
              <li key={p.id} className="mb-1">
                <strong>{p.name}:</strong> {p.role}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
