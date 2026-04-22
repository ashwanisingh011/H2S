export const personas = [
  {
    id: 'voter',
    title: 'The Voter',
    description: 'Learn how to register, understand candidates, and cast a ballot.',
    icon: 'UserCircle'
  },
  {
    id: 'candidate',
    title: 'The Candidate',
    description: 'Learn about nominations, campaigning rules, and the counting process.',
    icon: 'Megaphone'
  },
  {
    id: 'officer',
    title: 'Election Officer',
    description: 'Understand the logistics, EVM setup, and ensuring a fair election.',
    icon: 'ShieldCheck'
  }
];

export const timelineData = {
  voter: [
    {
      step: 1,
      title: 'Voter Registration',
      description: 'The first step is getting your name on the electoral roll. You must be 18 years or older and a citizen.',
      icon: 'FileText'
    },
    {
      step: 2,
      title: 'Know Your Candidates',
      description: 'Research the candidates in your constituency. Understand their manifestos and past work.',
      icon: 'Users'
    },
    {
      step: 3,
      title: 'Voting Day',
      description: 'Go to your designated polling booth with your Voter ID. Cast your vote securely using the EVM.',
      icon: 'CheckSquare'
    },
    {
      step: 4,
      title: 'Results',
      description: 'Wait for the counting day to see the democratic outcome of your and other citizens\' votes.',
      icon: 'TrendingUp'
    }
  ],
  candidate: [
    {
      step: 1,
      title: 'Filing Nomination',
      description: 'Submit your nomination papers with the Returning Officer along with the required security deposit.',
      icon: 'FileEdit'
    },
    {
      step: 2,
      title: 'Scrutiny & Withdrawal',
      description: 'Nominations are scrutinized for validity. Candidates can withdraw their names within a specific timeframe.',
      icon: 'Search'
    },
    {
      step: 3,
      title: 'Campaigning',
      description: 'Rally support by presenting your manifesto. Strict adherence to the Model Code of Conduct is mandatory.',
      icon: 'Mic'
    },
    {
      step: 4,
      title: 'Counting Day',
      description: 'Agents oversee the counting of votes. The candidate with the highest valid votes is declared the winner.',
      icon: 'Award'
    }
  ],
  officer: [
    {
      step: 1,
      title: 'Preparation',
      description: 'Setup polling booths, train personnel, and ensure EVMs and VVPATs are working securely.',
      icon: 'Settings'
    },
    {
      step: 2,
      title: 'Enforcing Rules',
      description: 'Monitor the region to ensure strict adherence to the Model Code of Conduct by all parties.',
      icon: 'Shield'
    },
    {
      step: 3,
      title: 'Polling Day Logistics',
      description: 'Manage the flow of voters, maintain law and order at booths, and secure the EVMs post-voting.',
      icon: 'Lock'
    },
    {
      step: 4,
      title: 'Secure Counting',
      description: 'Oversee the opening of strongrooms and ensure a transparent, secure counting process.',
      icon: 'Eye'
    }
  ]
};

export const quizQuestions = [
  {
    id: 1,
    question: "What is the minimum voting age in a general democracy?",
    options: ["16", "18", "21", "25"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "What does EVM stand for?",
    options: ["Electronic Voting Machine", "Electoral Verification Module", "Election Voting Mechanism", "Early Voting Machine"],
    correctAnswer: 0
  },
  {
    id: 3,
    question: "What is the set of guidelines candidates must follow during campaigns called?",
    options: ["Campaign Rules", "Model Code of Conduct", "Election Protocol", "Nomination Guidelines"],
    correctAnswer: 1
  }
];
