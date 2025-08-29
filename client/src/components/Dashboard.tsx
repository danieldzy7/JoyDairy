import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../contexts/AuthContext';
import { entryService, Entry, CreateEntryData } from '../services/api';
import { toast } from 'react-toastify';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
`;

const WelcomeText = styled.h1`
  color: #333;
  font-size: 1.8rem;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const LogoutButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #ff5252;
    transform: translateY(-2px);
  }
`;

const CalendarContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  .react-calendar {
    width: 100%;
    border: none;
    font-family: inherit;
  }
  
  .react-calendar__tile {
    padding: 12px;
    background: none;
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover {
      background: #e3f2fd;
    }
    
    &--active {
      background: #667eea !important;
      color: white;
    }
  }
  
  .react-calendar__tile--hasEntry {
    background: #c8e6c9;
    
    &:hover {
      background: #a5d6a7;
    }
  }
`;

const EntrySection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const EntryHeader = styled.h2`
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.5rem;
`;

const SelectedDate = styled.p`
  text-align: center;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 25px;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #555;
  font-weight: 600;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 15px;
  border: 2px solid #e1e1e1;
  border-radius: 10px;
  font-size: 16px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SaveButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeleteButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ff5252;
    transform: translateY(-2px);
  }
`;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [, setCurrentEntry] = useState<Entry | null>(null);
  const [formData, setFormData] = useState({
    gratitude: '',
    manifestation: '',
    reflection: ''
  });
  const [loading, setLoading] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);

  // Load all entries on component mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Load entry for selected date
  useEffect(() => {
    loadEntryForDate(selectedDate);
  }, [selectedDate, entries]); // loadEntryForDate is defined inline, so it's safe to omit

  const loadEntries = async () => {
    try {
      const data = await entryService.getAllEntries();
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const loadEntryForDate = async (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const existingEntry = entries.find(entry => 
      entry.date.split('T')[0] === dateString
    );

    if (existingEntry) {
      setCurrentEntry(existingEntry);
      setFormData({
        gratitude: existingEntry.gratitude,
        manifestation: existingEntry.manifestation,
        reflection: existingEntry.reflection
      });
      setHasEntry(true);
    } else {
      setCurrentEntry(null);
      setFormData({
        gratitude: '',
        manifestation: '',
        reflection: ''
      });
      setHasEntry(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const entryData: CreateEntryData = {
        date: selectedDate.toISOString().split('T')[0],
        gratitude: formData.gratitude,
        manifestation: formData.manifestation,
        reflection: formData.reflection
      };

      await entryService.createOrUpdateEntry(entryData);
      await loadEntries();
      toast.success(hasEntry ? 'Entry updated successfully!' : 'Entry saved successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error saving entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!hasEntry || !window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      await entryService.deleteEntry(dateString);
      await loadEntries();
      toast.success('Entry deleted successfully!');
    } catch (error) {
      toast.error('Error deleting entry');
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dateString = date.toISOString().split('T')[0];
    const hasEntryForDate = entries.some(entry => 
      entry.date.split('T')[0] === dateString
    );
    return hasEntryForDate ? 'react-calendar__tile--hasEntry' : '';
  };

  return (
    <Container>
      <Header>
        <WelcomeText>Welcome back, {user?.name}!</WelcomeText>
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      </Header>

      <CalendarContainer>
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          tileClassName={tileClassName}
        />
      </CalendarContainer>

      <EntrySection>
        <EntryHeader>Daily Reflection</EntryHeader>
        <SelectedDate>
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </SelectedDate>

        <Form onSubmit={handleSubmit}>
          <FieldGroup>
            <Label htmlFor="gratitude">What are you grateful for today?</Label>
            <TextArea
              id="gratitude"
              name="gratitude"
              placeholder="Share something you're grateful for..."
              value={formData.gratitude}
              onChange={handleInputChange}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="manifestation">What are you manifesting?</Label>
            <TextArea
              id="manifestation"
              name="manifestation"
              placeholder="Describe what you want to bring into your life..."
              value={formData.manifestation}
              onChange={handleInputChange}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label htmlFor="reflection">Daily reflection</Label>
            <TextArea
              id="reflection"
              name="reflection"
              placeholder="Reflect on your day, thoughts, and feelings..."
              value={formData.reflection}
              onChange={handleInputChange}
              required
            />
          </FieldGroup>

          <ButtonGroup>
            <SaveButton type="submit" disabled={loading}>
              {loading ? 'Saving...' : hasEntry ? 'Update Entry' : 'Save Entry'}
            </SaveButton>
            {hasEntry && (
              <DeleteButton type="button" onClick={handleDelete}>
                Delete
              </DeleteButton>
            )}
          </ButtonGroup>
        </Form>
      </EntrySection>
    </Container>
  );
};

export default Dashboard;
