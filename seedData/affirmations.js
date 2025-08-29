const affirmationsData = [
  // Self-Love Affirmations
  { text: "I am worthy of love and respect exactly as I am.", category: "self-love", tags: ["worth", "respect"] },
  { text: "I choose to treat myself with kindness and compassion.", category: "self-love", tags: ["kindness", "compassion"] },
  { text: "I am enough, I have enough, I do enough.", category: "self-love", tags: ["enough", "acceptance"] },
  { text: "I forgive myself for past mistakes and embrace growth.", category: "self-love", tags: ["forgiveness", "growth"] },
  { text: "My self-worth is not determined by others' opinions.", category: "self-love", tags: ["worth", "independence"] },

  // Abundance Affirmations
  { text: "I am a magnet for abundance and prosperity.", category: "abundance", tags: ["prosperity", "attraction"] },
  { text: "Money flows to me easily and effortlessly.", category: "abundance", tags: ["money", "flow"] },
  { text: "I deserve to live a life of abundance and joy.", category: "abundance", tags: ["deserve", "joy"] },
  { text: "Opportunities for wealth and success surround me.", category: "abundance", tags: ["opportunities", "wealth"] },
  { text: "I am grateful for the abundance that flows into my life.", category: "abundance", tags: ["grateful", "flow"] },

  // Health Affirmations
  { text: "My body is strong, healthy, and full of energy.", category: "health", tags: ["strength", "energy"] },
  { text: "I nourish my body with healthy choices every day.", category: "health", tags: ["nourish", "choices"] },
  { text: "Every cell in my body vibrates with perfect health.", category: "health", tags: ["cells", "vibration"] },
  { text: "I listen to my body's wisdom and honor its needs.", category: "health", tags: ["wisdom", "honor"] },
  { text: "I am healing and becoming stronger every day.", category: "health", tags: ["healing", "stronger"] },

  // Relationships Affirmations
  { text: "I attract loving and supportive relationships.", category: "relationships", tags: ["attract", "support"] },
  { text: "I communicate with love, honesty, and clarity.", category: "relationships", tags: ["communication", "honesty"] },
  { text: "I am surrounded by people who love and appreciate me.", category: "relationships", tags: ["surrounded", "appreciation"] },
  { text: "I give and receive love freely and unconditionally.", category: "relationships", tags: ["give", "receive"] },
  { text: "My relationships are based on mutual respect and understanding.", category: "relationships", tags: ["respect", "understanding"] },

  // Career Affirmations
  { text: "I am successful in all my professional endeavors.", category: "career", tags: ["success", "professional"] },
  { text: "My work brings me joy, fulfillment, and abundance.", category: "career", tags: ["joy", "fulfillment"] },
  { text: "I am a valuable asset to any team or organization.", category: "career", tags: ["valuable", "asset"] },
  { text: "Opportunities for career advancement come to me easily.", category: "career", tags: ["advancement", "opportunities"] },
  { text: "I am confident in my skills and abilities.", category: "career", tags: ["confident", "skills"] },

  // Confidence Affirmations
  { text: "I believe in myself and my ability to succeed.", category: "confidence", tags: ["believe", "succeed"] },
  { text: "I speak my truth with confidence and clarity.", category: "confidence", tags: ["truth", "clarity"] },
  { text: "I am brave, bold, and beautiful in my uniqueness.", category: "confidence", tags: ["brave", "unique"] },
  { text: "I trust my intuition and make decisions with confidence.", category: "confidence", tags: ["intuition", "decisions"] },
  { text: "I radiate confidence and inspire others.", category: "confidence", tags: ["radiate", "inspire"] },

  // Healing Affirmations
  { text: "I am healing on all levels - mind, body, and spirit.", category: "healing", tags: ["mind", "body", "spirit"] },
  { text: "I release all that no longer serves my highest good.", category: "healing", tags: ["release", "highest good"] },
  { text: "Every breath I take brings healing energy into my being.", category: "healing", tags: ["breath", "energy"] },
  { text: "I am patient and gentle with myself during healing.", category: "healing", tags: ["patient", "gentle"] },
  { text: "My past experiences have made me wiser and stronger.", category: "healing", tags: ["experiences", "wiser"] },

  // Manifestation Affirmations
  { text: "I am a powerful creator of my own reality.", category: "manifestation", tags: ["creator", "reality"] },
  { text: "My thoughts and intentions manifest into reality.", category: "manifestation", tags: ["thoughts", "intentions"] },
  { text: "I align my actions with my dreams and desires.", category: "manifestation", tags: ["align", "dreams"] },
  { text: "The universe conspires to help me achieve my goals.", category: "manifestation", tags: ["universe", "goals"] },
  { text: "I manifest my desires with ease and grace.", category: "manifestation", tags: ["ease", "grace"] },

  // Gratitude Affirmations
  { text: "I am grateful for all the blessings in my life.", category: "gratitude", tags: ["blessings", "grateful"] },
  { text: "Gratitude fills my heart and transforms my perspective.", category: "gratitude", tags: ["heart", "perspective"] },
  { text: "I appreciate the beauty and wonder in everyday moments.", category: "gratitude", tags: ["beauty", "wonder"] },
  { text: "I am thankful for both challenges and victories.", category: "gratitude", tags: ["challenges", "victories"] },
  { text: "Gratitude opens my heart to receive more blessings.", category: "gratitude", tags: ["opens", "receive"] },

  // Peace Affirmations
  { text: "I am at peace with myself and the world around me.", category: "peace", tags: ["peace", "world"] },
  { text: "I choose inner peace over external chaos.", category: "peace", tags: ["inner peace", "chaos"] },
  { text: "Calmness and serenity flow through my being.", category: "peace", tags: ["calmness", "serenity"] },
  { text: "I release worry and embrace the present moment.", category: "peace", tags: ["worry", "present"] },
  { text: "Peace is my natural state of being.", category: "peace", tags: ["natural", "state"] },

  // Success Affirmations
  { text: "Success flows to me in perfect timing.", category: "success", tags: ["flows", "timing"] },
  { text: "I am destined for greatness and success.", category: "success", tags: ["destined", "greatness"] },
  { text: "Every step I take leads me closer to success.", category: "success", tags: ["steps", "closer"] },
  { text: "I celebrate my achievements and learn from setbacks.", category: "success", tags: ["celebrate", "learn"] },
  { text: "Success is my birthright and I claim it now.", category: "success", tags: ["birthright", "claim"] },

  // Creativity Affirmations
  { text: "I am a creative being with unlimited potential.", category: "creativity", tags: ["creative", "potential"] },
  { text: "Inspiration flows through me effortlessly.", category: "creativity", tags: ["inspiration", "flows"] },
  { text: "I trust my creative process and honor my ideas.", category: "creativity", tags: ["trust", "ideas"] },
  { text: "My creativity brings joy and value to the world.", category: "creativity", tags: ["joy", "value"] },
  { text: "I express myself freely and authentically.", category: "creativity", tags: ["express", "authentically"] }
];

module.exports = affirmationsData;
