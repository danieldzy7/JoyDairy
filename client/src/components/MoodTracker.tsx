import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { moodService, MoodEntry, MoodType, CreateMoodData } from '../services/moodService';
import { toast } from 'react-toastify';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;

const Title = styled.h3`
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const MoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
`;

const MoodButton = styled.button<{ selected: boolean; moodType: MoodType }>`
  background: ${props => props.selected ? 
    props.moodType === 'excellent' ? '#4caf50' :
    props.moodType === 'good' ? '#8bc34a' :
    props.moodType === 'neutral' ? '#ffc107' :
    props.moodType === 'low' ? '#ff9800' :
    '#f44336'
    : '#f8f9fa'
  };
  color: ${props => props.selected ? 'white' : '#666'};
  border: 2px solid ${props => props.selected ? 'transparent' : '#e1e1e1'};
  border-radius: 12px;
  padding: 15px 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 12px 6px;
    font-size: 0.8rem;
  }
`;

const MoodEmoji = styled.span`
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const MoodLabel = styled.span``;

const IntensitySection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  color: #333;
  font-size: 1rem;
  margin-bottom: 10px;
  font-weight: 600;
`;

const IntensitySlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: #e1e1e1;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: none;
  }
`;

const IntensityValue = styled.div`
  text-align: center;
  margin-top: 8px;
  color: #667eea;
  font-weight: 600;
`;

const EmotionsSection = styled.div`
  margin-bottom: 20px;
`;

const EmotionsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const EmotionTag = styled.button<{ selected: boolean }>`
  background: ${props => props.selected ? '#667eea' : '#f8f9fa'};
  color: ${props => props.selected ? 'white' : '#666'};
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e1e1'};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: #667eea;
  }
`;

const NotesSection = styled.div`
  margin-bottom: 25px;
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  padding: 15px;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }
`;

const SaveButton = styled.button<{ hasEntry: boolean }>`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  background: ${props => props.hasEntry ? '#4caf50' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const MOOD_OPTIONS = [
  { type: 'excellent' as MoodType, emoji: '😄', label: 'Excellent', score: 5 },
  { type: 'good' as MoodType, emoji: '😊', label: 'Good', score: 4 },
  { type: 'neutral' as MoodType, emoji: '😐', label: 'Neutral', score: 3 },
  { type: 'low' as MoodType, emoji: '😔', label: 'Low', score: 2 },
  { type: 'terrible' as MoodType, emoji: '😢', label: 'Terrible', score: 1 }
];

const EMOTIONS = [
  'happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'stressed',
  'peaceful', 'frustrated', 'grateful', 'worried', 'confident',
  'lonely', 'loved', 'motivated', 'tired', 'energetic', 'hopeful',
  'disappointed', 'proud', 'overwhelmed', 'relaxed'
];

interface MoodTrackerProps {
  selectedDate: Date;
  onSave?: () => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ selectedDate, onSave }) => {
  const [moodEntry, setMoodEntry] = useState<MoodEntry | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMoodEntry();
  }, [selectedDate]);

  const loadMoodEntry = async () => {
    setLoading(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const entry = await moodService.getMoodByDate(dateString);
      setMoodEntry(entry);
      setSelectedMood(entry.mood);
      setIntensity(entry.intensity);
      setSelectedEmotions(entry.emotions);
      setNotes(entry.notes || '');
    } catch (error) {
      // No entry for this date - that's okay
      setMoodEntry(null);
      setSelectedMood(null);
      setIntensity(5);
      setSelectedEmotions([]);
      setNotes('');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (mood: MoodType, score: number) => {
    setSelectedMood(mood);
  };

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSave = async () => {
    if (!selectedMood) {
      toast.error('Please select your mood first');
      return;
    }

    setSaving(true);
    try {
      const moodScore = MOOD_OPTIONS.find(m => m.type === selectedMood)?.score || 3;
      
      const data: CreateMoodData = {
        mood: selectedMood,
        moodScore,
        intensity,
        emotions: selectedEmotions,
        notes: notes.trim(),
        date: selectedDate.toISOString().split('T')[0]
      };

      const savedEntry = await moodService.createMoodEntry(data);
      setMoodEntry(savedEntry);
      toast.success(moodEntry ? 'Mood updated!' : 'Mood saved!');
      onSave?.();
    } catch (error) {
      console.error('Error saving mood:', error);
      toast.error('Failed to save mood');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>📊 Mood Tracker</Title>
          <Subtitle>Loading mood data...</Subtitle>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>📊 Mood Tracker</Title>
        <Subtitle>How are you feeling today?</Subtitle>
      </Header>

      <SectionTitle>Select your mood:</SectionTitle>
      <MoodGrid>
        {MOOD_OPTIONS.map((mood) => (
          <MoodButton
            key={mood.type}
            selected={selectedMood === mood.type}
            moodType={mood.type}
            onClick={() => handleMoodSelect(mood.type, mood.score)}
          >
            <MoodEmoji>{mood.emoji}</MoodEmoji>
            <MoodLabel>{mood.label}</MoodLabel>
          </MoodButton>
        ))}
      </MoodGrid>

      <IntensitySection>
        <SectionTitle>Intensity (1-10):</SectionTitle>
        <IntensitySlider
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value))}
        />
        <IntensityValue>{intensity}/10</IntensityValue>
      </IntensitySection>

      <EmotionsSection>
        <SectionTitle>What emotions are you experiencing?</SectionTitle>
        <EmotionsGrid>
          {EMOTIONS.map((emotion) => (
            <EmotionTag
              key={emotion}
              selected={selectedEmotions.includes(emotion)}
              onClick={() => handleEmotionToggle(emotion)}
            >
              {emotion}
            </EmotionTag>
          ))}
        </EmotionsGrid>
      </EmotionsSection>

      <NotesSection>
        <SectionTitle>Additional notes (optional):</SectionTitle>
        <NotesTextarea
          placeholder="What triggered this mood? Any thoughts or observations about your emotional state?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </NotesSection>

      <SaveButton
        hasEntry={!!moodEntry}
        onClick={handleSave}
        disabled={saving || !selectedMood}
      >
        {saving ? 'Saving...' : moodEntry ? 'Update Mood' : 'Save Mood'}
      </SaveButton>
    </Container>
  );
};

export default MoodTracker;

