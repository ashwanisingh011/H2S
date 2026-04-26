import React, { useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle, Megaphone, ShieldCheck } from 'lucide-react';
import { personas } from '../data/electionData';
import { trackPersonaSelected } from '../firebase/db';

const iconMap = {
  UserCircle: <UserCircle size={40} className="text-white mb-6 opacity-80" strokeWidth={1.5} aria-hidden="true" />,
  Megaphone: <Megaphone size={40} className="text-white mb-6 opacity-80" strokeWidth={1.5} aria-hidden="true" />,
  ShieldCheck: <ShieldCheck size={40} className="text-white mb-6 opacity-80" strokeWidth={1.5} aria-hidden="true" />
};

/**
 * Home page component serving as the entry point.
 * Wrapped in React.memo to prevent unnecessary re-renders.
 */
const Home = memo(function Home() {
  const navigate = useNavigate();

  /** 
   * Memoized handler for persona selection to maintain referential equality 
   * across renders.
   */
  const handleSelectPersona = useCallback((id) => {
    localStorage.setItem('selectedPersona', id);
    trackPersonaSelected(id);
    navigate('/journey');
  }, [navigate]);

  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-6 text-white">
          The Election Process
        </h1>
        <p className="text-lg md:text-xl text-[#a3a3a3] font-light max-w-2xl mx-auto leading-relaxed">
          Choose a perspective to understand the mechanics of democracy. A step-by-step educational journey.
        </p>
      </motion.div>

      <section aria-label="Choose your learning persona">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {personas.map((persona, index) => (
            <motion.button
              key={persona.id}
              id={`persona-${persona.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              onClick={() => handleSelectPersona(persona.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectPersona(persona.id);
                }
              }}
              aria-label={`Learn as ${persona.title}: ${persona.description}`}
              className="classic-card rounded-xl p-8 cursor-pointer flex flex-col items-start text-left group w-full"
            >
              {iconMap[persona.icon]}
              <h2 className="text-xl font-medium mb-2 text-white group-hover:text-blue-400 transition-colors">{persona.title}</h2>
              <p className="text-[#a3a3a3] text-sm leading-relaxed">{persona.description}</p>
            </motion.button>
          ))}
        </div>
      </section>
    </main>
  );
});

export default Home;
