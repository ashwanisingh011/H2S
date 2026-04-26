import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Users, CheckSquare, TrendingUp, FileEdit, Search, Mic, Award, Settings, Shield, Lock, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { timelineData, personas } from '../data/electionData';
import { trackJourneyStarted } from '../firebase/db';

const iconMap = {
  FileText: <FileText className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  Users: <Users className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  CheckSquare: <CheckSquare className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  TrendingUp: <TrendingUp className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  FileEdit: <FileEdit className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  Search: <Search className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  Mic: <Mic className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  Award: <Award className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  Settings: <Settings className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  Shield: <Shield className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  Lock: <Lock className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />,
  Eye: <Eye className="text-[#f5f5f5]" size={20} strokeWidth={1.5} aria-hidden="true" />
};

export default function Journey() {
  const navigate = useNavigate();
  const [personaId, setPersonaId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('selectedPersona');
    if (!stored) {
      navigate('/');
    } else {
      setPersonaId(stored);
      trackJourneyStarted(stored);
    }
  }, [navigate]);

  if (!personaId) return null;

  const journeyData = timelineData[personaId];
  const personaInfo = personas.find(p => p.id === personaId);

  return (
    <main id="main-content" role="main" className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col pt-24">
      <nav aria-label="Journey navigation" className="flex justify-between items-center mb-20 border-b border-[#262626] pb-8">
        <button
          onClick={() => navigate('/')}
          aria-label="Back to personas"
          className="flex items-center gap-2 text-[#a3a3a3] hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to Personas
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-medium text-white">{personaInfo.title}</h1>
          <p className="text-[#a3a3a3] text-sm">Educational Timeline</p>
        </div>
      </nav>

      <ol
        aria-label={`${personaInfo.title} election journey steps`}
        className="relative border-l border-[#262626] ml-4 md:ml-8 space-y-16 pb-24"
      >
        {journeyData.map((step, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className="relative pl-12 md:pl-16"
            aria-current={index === journeyData.length - 1 ? 'step' : undefined}
          >
            <div
              className="absolute -left-[17px] top-1 w-8 h-8 bg-[#171717] rounded-full flex items-center justify-center border border-[#404040]"
              aria-hidden="true"
            >
              {iconMap[step.icon]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium text-[#a3a3a3] bg-[#262626] px-2 py-1 rounded" aria-hidden="true">
                  Step {step.step}
                </span>
                <h2 className="text-lg font-medium text-white">{step.title}</h2>
              </div>
              <p className="text-[#a3a3a3] text-base leading-relaxed max-w-2xl mt-3">{step.description}</p>
            </div>
          </motion.li>
        ))}
      </ol>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex justify-center mt-12 pb-24"
      >
        <button
          onClick={() => navigate('/quiz')}
          aria-label="Proceed to quiz to test your knowledge"
          className="classic-button px-6 py-3 rounded text-sm font-medium flex items-center gap-2"
        >
          Proceed to Quiz <ArrowRight size={16} aria-hidden="true" />
        </button>
      </motion.div>
    </main>
  );
}
