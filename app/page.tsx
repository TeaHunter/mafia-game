'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Image from "next/image";

const supabase = createClient(
  'https://otlixcdsstrdwxhzddrz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90bGl4Y2Rzc3RyZHd4aHpkZHJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjMxMDAsImV4cCI6MjA2MTA5OTEwMH0.F_Kb7KEbNCbTSXI5f_e3VUBb_z1SRnh7VoXCAxvU5t0'
);

const roleInfo = {
  "Mafia Boss": {
    description: "Commands the mafia. Chooses a victim each night.",
    icon: "/icons/mafia-boss.png"
  },
  "Mafioso": {
    description: "Member of the mafia. Follows the boss's orders.",
    icon: "/icons/mafioso.png"
  },
  "Sheriff": {
    description: "Each night checks one player to find the mafia.",
    icon: "/icons/sheriff.png"
  },
  "Doctor": {
    description: "Each night can save one player from being eliminated.",
    icon: "/icons/doctor.png"
  },
  "Maniac": {
    description: "Wins alone by eliminating everyone else.",
    icon: "/icons/maniac.png"
  },
  "Townsperson": {
    description: "An ordinary citizen. Votes during the day.",
    icon: "/icons/townsperson.png"
  }
};

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [assigned, setAssigned] = useState(false);
  const [myRole, setMyRole] = useState(null);
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState(1);
  const [phase, setPhase] = useState<'day' | 'night'>('day');

  useEffect(() => {
    fetchPhase();
    const interval = setInterval(fetchPhase, 5000);
    return () => clearInterval(interval);
  }, [gameId]);

  const fetchPhase = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('phase')
      .eq('game_number', gameId)
      .single();
    if (!error && data) {
      setPhase(data.phase);
    }
  };

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

  const bgColor = phase === 'day' ? 'bg-blue-100 text-black' : 'bg-gray-900 text-white';

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${bgColor}`}>
      <h1 className="text-2xl font-bold mb-4">Mafia Role Assignment</h1>

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
        <div className="text-center">
          {myRole && roleInfo[myRole] && (
            <div className="flex flex-col items-center">
              <Image src={roleInfo[myRole].icon} alt={myRole} width={100} height={100} />
              <h2 className="text-2xl font-bold mt-2">{myRole}</h2>
              <p className="mt-2 max-w-xs">{roleInfo[myRole].description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
