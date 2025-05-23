'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const supabase = createClient(
  'https://otlixcdsstrdwxhzddrz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bGl4Y2Rzc3RyZHd4aHpkZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjMxMDAsImV4cCI6MjA2MTA5OTEwMH0.F_Kb7KEbNCbTSXI5f_e3VUBb_z1SRnh7VoXCAxvU5t0'
);

const roleInfo = {
  "Mafia Boss": {
    icon: "🕴️",
    description: "Mafia Boss: Each night chooses a player to eliminate. Blend in during the day and vote. Win if mafia outnumbers the town."
  },
  "Mafioso": {
    icon: "🧥",
    description: "Mafioso: Assists the Mafia Boss. Eliminates players at night. Win with mafia when the town is outnumbered."
  },
  "Sheriff": {
    icon: "👮",
    description: "Sheriff: Investigates one player each night to determine if they are mafia. Win by eliminating all mafia."
  },
  "Doctor": {
    icon: "🏥",
    description: "Doctor: Each night protects one player from being eliminated. Win by saving the town from mafia."
  },
  "Maniac": {
    icon: "🗡️",
    description: "Maniac: Kills one player each night. Win if left one-on-one with a Townsperson."
  },
  "Townsperson": {
    icon: "🧑",
    description: "Townsperson: No abilities at night. Discuss and vote during the day. Win if all mafia members are eliminated."
  }
};

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [assigned, setAssigned] = useState(false);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState(1);
  const [phase, setPhase] = useState<'day' | 'night'>('day');

  useEffect(() => {
    const savedName = localStorage.getItem('name');
    const savedRole = localStorage.getItem('role');
    if (savedName && savedRole) {
      setName(savedName);
      setMyRole(savedRole);
      setAssigned(true);
    }
  }, []);

  useEffect(() => {
    const subscription = supabase
      .channel('games-phase')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, (payload) => {
        if (payload.new) {
          const data = payload.new as { phase: 'day' | 'night' };
          setPhase(data.phase);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

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
    localStorage.setItem('name', name);
    localStorage.setItem('role', role);
  };

  const bgColor = phase === 'day' ? 'bg-blue-100 text-black' : 'bg-gray-900 text-white';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 text-center ${bgColor}`}>
      <h1 className="text-4xl font-bold mb-6">Mafia Game</h1>

      <div className="absolute bottom-4 left-4 text-2xl">
        {phase === 'day' ? '☀️ Day' : '🌙 Night'}
      </div>

      {!assigned ? (
        <div className="w-full max-w-sm">
          <Input
            type="text"
            placeholder="Enter your name"
            className="w-full mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button className="w-full" onClick={assignRole}>
            Get My Role
          </Button>
        </div>
      ) : (
        <div className="text-center mt-6">
          {myRole && roleInfo[myRole] && (
            <div className="flex flex-col items-center">
              <div className="text-7xl mb-4">{roleInfo[myRole].icon}</div>
              <h2 className="text-4xl font-bold mb-2">{myRole}</h2>
              <p className="text-lg max-w-md leading-relaxed">{roleInfo[myRole].description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
