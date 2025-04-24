'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button"

const supabase = createClient(
  'https://otlixcdsstrdwxhzddrz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bGl4Y2Rzc3RyZHd4aHpkZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjMxMDAsImV4cCI6MjA2MTA5OTEwMH0.F_Kb7KEbNCbTSXI5f_e3VUBb_z1SRnh7VoXCAxvU5t0'
);

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [assigned, setAssigned] = useState(false);
  const [myRole, setMyRole] = useState(null);
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState(1);

  useEffect(() => {
    supabase
      .from('players')
      .select('*')
      .eq('game_id', gameId)
      .then(({ data }) => setPlayers(data));
  }, [assigned, gameId]);

  const getRandomUnassignedRole = () => {
    const roles = [
      "Mafia Boss",
      "Mafioso",
      "Mafioso",
      "Sheriff",
      "Doctor",
      "Maniac",
      "Townsperson",
      "Townsperson",
      "Townsperson",
      "Townsperson",
      "Townsperson",
      "Townsperson",
      "Townsperson",
      "Townsperson",
      "Townsperson"
    ];
    const usedRoles = players.map(p => p.role);
    const availableRoles = roles.filter(role => !usedRoles.includes(role));
    return availableRoles[Math.floor(Math.random() * availableRoles.length)];
  };

  const assignRole = async () => {
    if (!name) return;
    const role = getRandomUnassignedRole();
    if (!role) {
      setMyRole("All roles have been taken.");
      return;
    }
    await supabase.from('players').insert({
      name,
      role,
      is_assigned: true,
      game_id: gameId
    });
    setMyRole(role);
    setAssigned(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-black">
      <h1 className="text-2xl font-bold mb-4">Mafia Role Assignment</h1>

      {!assigned ? (
        <div className="w-full max-w-sm">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-2 mb-2 text-black rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button className="w-full" onClick={assignRole}>
            Get My Role
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl mt-4">Your role:</h2>
          <p className="text-3xl font-bold mt-2">{myRole}</p>
        </div>
      )}
    </div>
  );
}
