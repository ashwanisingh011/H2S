import React, { useEffect, useState } from 'react';
import { getTopScores } from '../firebase/db';
import { Trophy, Medal } from 'lucide-react';

const personaLabels = { voter: 'Voter', candidate: 'Candidate', officer: 'Officer' };

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopScores(10).then(data => {
      setScores(data);
      setLoading(false);
    });
  }, []);

  return (
    <section aria-label="Global leaderboard" className="mt-10 w-full max-w-2xl mx-auto">
      <div className="classic-card rounded-xl p-6">
        <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
          <Trophy size={20} aria-hidden="true" />
          Global Leaderboard
        </h2>

        {loading ? (
          <p className="text-[#a3a3a3] text-sm text-center py-6" aria-live="polite">Loading scores...</p>
        ) : scores.length === 0 ? (
          <p className="text-[#a3a3a3] text-sm text-center py-6">No scores yet. Be the first!</p>
        ) : (
          <ol aria-label="Top scores" className="space-y-3">
            {scores.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between border border-[#262626] rounded-lg px-4 py-3 bg-[#0a0a0a]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold w-6 text-center ${entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-slate-300' : entry.rank === 3 ? 'text-amber-600' : 'text-[#a3a3a3]'}`}
                    aria-label={`Rank ${entry.rank}`}
                  >
                    {entry.rank <= 3 ? <Medal size={16} className="inline" aria-hidden="true" /> : `#${entry.rank}`}
                  </span>
                  <div>
                    <p className="text-white text-sm font-medium">{entry.name}</p>
                    <p className="text-[#a3a3a3] text-xs">{personaLabels[entry.persona] || 'Unknown'}</p>
                  </div>
                </div>
                <span className="text-white font-bold text-sm" aria-label={`Score: ${entry.score} out of ${entry.total}`}>
                  {entry.score}/{entry.total}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
