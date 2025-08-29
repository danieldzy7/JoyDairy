import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../contexts/AuthContext';
import { entryService, Entry, CreateEntryData } from '../services/api';
import InspiringQuotes from './InspiringQuotes';
import { toast } from 'react-toastify';

// Theme types
type Theme = 'default' | 'white' | 'green' | 'pink' | 'blue' | 'purple';

interface ThemeConfig {
  background: string;
  primary: string;
  secondary: string;
  text: string;
  cardBg: string;
  border: string;
  shadow: string;
  accent: string;
  sidebarBg: string;
  sidebarHeader: string;
}

// Theme configurations - Light versions for counseling & healing
const themes: Record<Theme, ThemeConfig> = {
  default: {
    background: '#ffffff',
    primary: '#6b7280',
    secondary: '#9ca3af',
    text: '#374151',
    cardBg: '#ffffff',
    border: '#e5e7eb',
    shadow: 'rgba(0, 0, 0, 0.05)',
    accent: '#6b7280',
    sidebarBg: '#ffffff',
    sidebarHeader: '#f9fafb'
  },
  white: {
    background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #f0f0f0 100%)',
    primary: '#6b7280',
    secondary: '#9ca3af',
    text: '#374151',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(107, 114, 128, 0.1)',
    shadow: 'rgba(107, 114, 128, 0.05)',
    accent: '#6b7280',
    sidebarBg: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
    sidebarHeader: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
  },
  green: {
    background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)',
    primary: '#10b981',
    secondary: '#059669',
    text: '#047857',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    border: 'rgba(16, 185, 129, 0.1)',
    shadow: 'rgba(16, 185, 129, 0.05)',
    accent: '#10b981',
    sidebarBg: 'linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%)',
    sidebarHeader: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  pink: {
    background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)',
    primary: '#f472b6',
    secondary: '#ec4899',
    text: '#db2777',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    border: 'rgba(244, 114, 182, 0.1)',
    shadow: 'rgba(244, 114, 182, 0.05)',
    accent: '#f472b6',
    sidebarBg: 'linear-gradient(180deg, #fdf2f8 0%, #fce7f3 100%)',
    sidebarHeader: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)'
  },
  blue: {
    background: 'linear-gradient(135deg, #AEC6E4 0%, #8BB8E8 50%, #6A8CD2 100%)',
    primary: '#667EEA',
    secondary: '#764BA2',
    text: '#2D3748',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    border: 'rgba(102, 126, 234, 0.1)',
    shadow: 'rgba(102, 126, 234, 0.08)',
    accent: '#667EEA',
    sidebarBg: 'linear-gradient(180deg, #AEC6E4 0%, #8BB8E8 100%)',
    sidebarHeader: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
  },
  purple: {
    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
    primary: '#a78bfa',
    secondary: '#8b5cf6',
    text: '#7c3aed',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    border: 'rgba(167, 139, 250, 0.1)',
    shadow: 'rgba(167, 139, 250, 0.05)',
    accent: '#a78bfa',
    sidebarBg: 'linear-gradient(180deg, #faf5ff 0%, #f3e8ff 100%)',
    sidebarHeader: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)'
  }
};

const Container = styled.div<{ $theme: Theme }>`
  min-height: 100vh;
  background: ${props => themes[props.$theme].background};
  padding: 20px;
  transition: all 0.3s ease;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
`;



const MenuButton = styled.button<{ $theme: Theme }>`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid ${props => themes[props.$theme].border};
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => themes[props.$theme].accent}20;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => themes[props.$theme].shadow};
  }
`;

const MenuLine = styled.div<{ $theme: Theme }>`
  width: 20px;
  height: 2px;
  background: ${props => themes[props.$theme].primary};
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
  shouldForwardProp: (prop) => prop !== 'isOpen' && prop !== '$theme',
})<{ isOpen: boolean; $theme: Theme }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: ${props => themes[props.$theme].sidebarBg};
  box-shadow: -8px 0 30px ${props => themes[props.$theme].shadow};
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${props => themes[props.$theme].border};
`;

const SidebarHeader = styled.div<{ $theme: Theme }>`
  padding: 24px 20px;
  border-bottom: 1px solid ${props => themes[props.$theme].border};
  background: ${props => themes[props.$theme].sidebarHeader};
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

const MenuItem = styled.button<{ $theme: Theme }>`
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
  color: ${props => themes[props.$theme].text};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => themes[props.$theme].accent}20;
    color: ${props => themes[props.$theme].primary};
  }

  &.logout {
    color: #ef4444;
    border-top: 1px solid ${props => themes[props.$theme].border};
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

const ThemeSection = styled.div<{ $theme: Theme }>`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${props => themes[props.$theme].border};
`;

const ThemeTitle = styled.h4<{ $theme: Theme }>`
  color: ${props => themes[props.$theme].text};
  margin: 0 0 15px 0;
  font-size: 1rem;
  font-weight: 600;
`;

const ThemeOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ThemeOption = styled.div<{ $theme: Theme; $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$isActive ? themes[props.$theme].accent + '20' : 'transparent'};
  border: 2px solid ${props => props.$isActive ? themes[props.$theme].accent : 'transparent'};
  color: ${props => themes[props.$theme].text};

  &:hover {
    background: ${props => themes[props.$theme].accent}15;
    transform: translateX(4px);
  }
`;

const ThemeColor = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

const CalendarContainer = styled.div<{ $theme: Theme }>`
  background: ${props => themes[props.$theme].cardBg};
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px ${props => themes[props.$theme].shadow};
  border: 1px solid ${props => themes[props.$theme].border};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  .react-calendar {
    width: 100%;
    border: none;
    font-family: inherit;
    background: transparent;
  }
  
  .react-calendar__tile {
    padding: 12px;
    background: none;
    border-radius: 12px;
    transition: all 0.3s ease;
    color: ${props => themes[props.$theme].text};
    
    &:hover {
      background: ${props => themes[props.$theme].accent}20;
      transform: scale(1.05);
    }
    
    &--active {
      background: ${props => themes[props.$theme].sidebarHeader} !important;
      color: white;
      box-shadow: 0 4px 12px ${props => themes[props.$theme].shadow};
    }
  }
  
  .react-calendar__tile--hasEntry {
    background: ${props => themes[props.$theme].accent}20;
    border: 2px solid ${props => themes[props.$theme].accent}40;
    
    &:hover {
      background: ${props => themes[props.$theme].accent}30;
    }
  }

  .react-calendar__navigation {
    margin-bottom: 20px;
  }

  .react-calendar__navigation button {
    background: ${props => themes[props.$theme].accent}20;
    border: 1px solid ${props => themes[props.$theme].accent}30;
    border-radius: 8px;
    color: ${props => themes[props.$theme].text};
    padding: 8px 12px;
    transition: all 0.3s ease;

    &:hover {
      background: ${props => themes[props.$theme].accent}30;
      transform: translateY(-1px);
    }
  }

  .react-calendar__month-view__weekdays {
    margin-bottom: 10px;
  }

  .react-calendar__month-view__weekdays__weekday {
    color: ${props => themes[props.$theme].primary};
    font-weight: 600;
    padding: 8px;
  }
`;

const EntrySection = styled.div<{ $theme: Theme }>`
  background: ${props => themes[props.$theme].cardBg};
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px ${props => themes[props.$theme].shadow};
  border: 1px solid ${props => themes[props.$theme].border};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
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

const TextArea = styled.textarea`
  padding: 18px;
  border: 2px solid #d1d5db;
  border-radius: 15px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  height: 120px;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #374151;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: flex-end;
  align-items: center;
`;

const SaveButton = styled.button<{ $theme: Theme }>`
  background: ${props => themes[props.$theme].sidebarHeader};
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  box-shadow: 0 4px 12px ${props => themes[props.$theme].shadow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => themes[props.$theme].shadow};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeleteButton = styled.button<{ $theme: Theme }>`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
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
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');

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
    <Container $theme={currentTheme}>
      <Header>
        <MenuButton onClick={() => setSidebarOpen(true)} $theme={currentTheme}>
          <MenuLine $theme={currentTheme} />
          <MenuLine $theme={currentTheme} />
          <MenuLine $theme={currentTheme} />
        </MenuButton>
      </Header>

      {/* Inspiring Quotes Section */}
      <InspiringQuotes theme={currentTheme} />

      <CalendarContainer $theme={currentTheme}>
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          tileClassName={tileClassName}
        />
      </CalendarContainer>

      <EntrySection $theme={currentTheme}>
        <Form onSubmit={handleSubmit}>
          <FieldGroup>
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
            <SaveButton type="submit" disabled={loading} $theme={currentTheme}>
              {loading ? 'Saving...' : hasEntry ? 'Update Good Things' : 'Save Good Things'}
            </SaveButton>
            {hasEntry && (
              <DeleteButton type="button" onClick={handleDelete} $theme={currentTheme}>
                Delete
              </DeleteButton>
            )}
          </ButtonGroup>
        </Form>
      </EntrySection>

             {/* Sidebar */}
       <SidebarOverlay isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
       <Sidebar isOpen={sidebarOpen} $theme={currentTheme}>
         <SidebarHeader $theme={currentTheme}>
           <CloseButton onClick={() => setSidebarOpen(false)}>×</CloseButton>
           <UserAvatar>👤</UserAvatar>
           <UserName>{user?.name}</UserName>
           <UserEmail>{user?.email}</UserEmail>
         </SidebarHeader>
         
         <SidebarContent>
           <MenuItem $theme={currentTheme}>
             <MenuIcon>👤</MenuIcon>
             Profile
           </MenuItem>
           <MenuItem $theme={currentTheme}>
             <MenuIcon>⚙️</MenuIcon>
             Settings
           </MenuItem>
           <MenuItem $theme={currentTheme}>
             <MenuIcon>📊</MenuIcon>
             Analytics
           </MenuItem>
           <MenuItem $theme={currentTheme}>
             <MenuIcon>💡</MenuIcon>
             Help & Support
           </MenuItem>

                       <ThemeSection $theme={currentTheme}>
              <ThemeTitle $theme={currentTheme}>Theme</ThemeTitle>
              <ThemeOptions>
                <ThemeOption $theme={currentTheme} $isActive={currentTheme === 'default'} onClick={() => setCurrentTheme('default')}>
                  <ThemeColor color="#6b7280" />
                  Default
                </ThemeOption>
                <ThemeOption $theme={currentTheme} $isActive={currentTheme === 'white'} onClick={() => setCurrentTheme('white')}>
                  <ThemeColor color="#6b7280" />
                  White
                </ThemeOption>
                <ThemeOption $theme={currentTheme} $isActive={currentTheme === 'green'} onClick={() => setCurrentTheme('green')}>
                  <ThemeColor color="#10b981" />
                  Green
                </ThemeOption>
                <ThemeOption $theme={currentTheme} $isActive={currentTheme === 'pink'} onClick={() => setCurrentTheme('pink')}>
                  <ThemeColor color="#f472b6" />
                  Pink
                </ThemeOption>
                <ThemeOption $theme={currentTheme} $isActive={currentTheme === 'blue'} onClick={() => setCurrentTheme('blue')}>
                  <ThemeColor color="#667EEA" />
                  Blue
                </ThemeOption>
                <ThemeOption $theme={currentTheme} $isActive={currentTheme === 'purple'} onClick={() => setCurrentTheme('purple')}>
                  <ThemeColor color="#a78bfa" />
                  Purple
                </ThemeOption>
              </ThemeOptions>
            </ThemeSection>
         </SidebarContent>
         
         <MenuItem className="logout" onClick={logout} $theme={currentTheme}>
           <MenuIcon>🚪</MenuIcon>
           Logout
         </MenuItem>
       </Sidebar>
    </Container>
  );
};

export default Dashboard;
