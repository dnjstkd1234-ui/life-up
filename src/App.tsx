import React from 'react';
import { OracleRoom } from './components/OracleRoom';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      <main className="flex-1 flex flex-col">
        <OracleRoom />
      </main>
    </div>
  );
}

