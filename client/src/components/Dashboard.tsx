import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../contexts/AuthContext';
import { entryService, Entry, CreateEntryData } from '../services/api';
import InspiringQuotes from './InspiringQuotes';
import { toast } from 'react-toastify';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
`;



const MenuButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const MenuLine = styled.div`
  width: 20px;
  height: 2px;
  background: #475569;
  border-radius: 1px;
  transition: all 0.3s ease;
`;

const SidebarOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const Sidebar = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 24px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  margin-bottom: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const UserName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const UserEmail = styled.p`
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: 20px 0;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 16px 20px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: #475569;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    color: #667eea;
  }

  &.logout {
    color: #ef4444;
    border-top: 1px solid #e2e8f0;
    margin-top: auto;

    &:hover {
      background: #fef2f2;
      color: #dc2626;
    }
  }
`;

const MenuIcon = styled.span`
  font-size: 1.1rem;
  width: 20px;
  display: flex;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
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
  min-height: 120px;
  height: 120px;
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
  gap: 10px;
  margin-top: 15px;
  justify-content: flex-end;
  align-items: center;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
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
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;

  &:hover {
    background: #ff5252;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  }
`;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [, setCurrentEntry] = useState<Entry | null>(null);
  const [formData, setFormData] = useState({
    goodThings: ''
  });
  const [loading, setLoading] = useState(false);
  const [hasEntry, setHasEntry] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      // For backward compatibility, try to load from gratitude or reflection fields
      const goodThingsContent = (existingEntry as any).goodThings || existingEntry.gratitude || existingEntry.reflection || '';
      setFormData({
        goodThings: goodThingsContent
      });
      setHasEntry(true);
      setHasUserInteracted(true); // User has existing content
    } else {
      setCurrentEntry(null);
      setFormData({
        goodThings: ''
      });
      setHasEntry(false);
      setHasUserInteracted(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTextareaFocus = () => {
    // Only show indicators if it's a new entry and user hasn't interacted yet
    if (!hasEntry && !hasUserInteracted && formData.goodThings === '') {
      setFormData({
        goodThings: '1. \n2. \n3. '
      });
      setHasUserInteracted(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const entryData: CreateEntryData = {
        date: selectedDate.toISOString().split('T')[0],
        gratitude: formData.goodThings,
        manifestation: 'Good things journal entry',
        reflection: formData.goodThings
      };

      await entryService.createOrUpdateEntry(entryData);
      await loadEntries();
      toast.success(hasEntry ? 'Good things updated successfully!' : 'Good things saved successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error saving good things');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!hasEntry) {
      return;
    }

    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      await entryService.deleteEntry(dateString);
      await loadEntries();
      toast.success('Good things deleted successfully!');
    } catch (error) {
      toast.error('Error deleting good things');
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
        <MenuButton onClick={() => setSidebarOpen(true)}>
          <MenuLine />
          <MenuLine />
          <MenuLine />
        </MenuButton>
      </Header>

      {/* Inspiring Quotes Section */}
      <InspiringQuotes />

      <CalendarContainer>
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          tileClassName={tileClassName}
        />
      </CalendarContainer>

      <EntrySection>
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
            <Label htmlFor="goodThings">What three good things happened today?</Label>
            <TextArea
              id="goodThings"
              name="goodThings"
              placeholder="List three good things that happened today - big or small moments, achievements, positive interactions, or anything that brought you joy..."
              value={formData.goodThings}
              onChange={handleInputChange}
              onFocus={handleTextareaFocus}
              required
            />
          </FieldGroup>

          <ButtonGroup>
            <SaveButton type="submit" disabled={loading}>
              {loading ? 'Saving...' : hasEntry ? 'Update Good Things' : 'Save Good Things'}
            </SaveButton>
            {hasEntry && (
              <DeleteButton type="button" onClick={handleDelete}>
                Delete
              </DeleteButton>
            )}
          </ButtonGroup>
        </Form>
      </EntrySection>

      {/* Sidebar */}
      <SidebarOverlay isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <CloseButton onClick={() => setSidebarOpen(false)}>×</CloseButton>
          <UserAvatar>👤</UserAvatar>
          <UserName>{user?.name}</UserName>
          <UserEmail>{user?.email}</UserEmail>
        </SidebarHeader>
        
        <SidebarContent>
          <MenuItem>
            <MenuIcon>👤</MenuIcon>
            Profile
          </MenuItem>
          <MenuItem>
            <MenuIcon>⚙️</MenuIcon>
            Settings
          </MenuItem>
          <MenuItem>
            <MenuIcon>📊</MenuIcon>
            Analytics
          </MenuItem>
          <MenuItem>
            <MenuIcon>💡</MenuIcon>
            Help & Support
          </MenuItem>
        </SidebarContent>
        
        <MenuItem className="logout" onClick={logout}>
          <MenuIcon>🚪</MenuIcon>
          Logout
        </MenuItem>
      </Sidebar>
    </Container>
  );
};

export default Dashboard;
