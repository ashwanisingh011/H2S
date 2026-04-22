import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Users, CheckSquare, TrendingUp, FileEdit, Search, Mic, Award, Settings, Shield, Lock, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import { timelineData, personas } from '../data/electionData';

const iconMap = {
  FileText: <FileText className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  Users: <Users className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  CheckSquare: <CheckSquare className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  TrendingUp: <TrendingUp className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  FileEdit: <FileEdit className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  Search: <Search className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  Mic: <Mic className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  Award: <Award className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  Settings: <Settings className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  Shield: <Shield className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  Lock: <Lock className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />,
  Eye: <Eye className="text-[#f5f5f5]" size={20} strokeWidth={1.5} />
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
    }
  }, [navigate]);

  if (!personaId) return null;

  const journeyData = timelineData[personaId];
  const personaInfo = personas.find(p => p.id === personaId);

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col pt-24">
      <div className="flex justify-between items-center mb-20 border-b border-[#262626] pb-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#a3a3a3] hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to Personas
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-medium text-white">{personaInfo.title}</h1>
          <p className="text-[#a3a3a3] text-sm">Educational Timeline</p>
        </div>
      </div>

      <div className="relative border-l border-[#262626] ml-4 md:ml-8 space-y-16 pb-24">
        {journeyData.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            className="relative pl-12 md:pl-16"
          >
            <div className="absolute -left-[17px] top-1 w-8 h-8 bg-[#171717] rounded-full flex items-center justify-center border border-[#404040]">
              {iconMap[step.icon]}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium text-[#a3a3a3] bg-[#262626] px-2 py-1 rounded">Step {step.step}</span>
                <h2 className="text-lg font-medium text-white">
                  {step.title}
                </h2>
              </div>
              <p className="text-[#a3a3a3] text-base leading-relaxed max-w-2xl mt-3">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex justify-center mt-12 pb-24"
      >
        <button 
          onClick={() => navigate('/quiz')}
          className="classic-button px-6 py-3 rounded text-sm font-medium flex items-center gap-2"
        >
          Proceed to Quiz <ArrowRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
