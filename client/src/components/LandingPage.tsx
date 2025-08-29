import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: hidden;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  color: #667eea;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const HeaderButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 20px 50px;
  position: relative;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 800px;
  color: white;
  animation: ${fadeInUp} 1s ease-out;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const HeroCTA = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 18px 40px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
`;

const FloatingElement = styled.div`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: ${float} 6s ease-in-out infinite;
  
  &:nth-child(1) {
    width: 100px;
    height: 100px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 10%;
    animation-delay: 2s;
  }
  
  &:nth-child(3) {
    width: 80px;
    height: 80px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
`;

const Section = styled.section`
  padding: 80px 20px;
  background: white;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 700;
`;

const SectionSubtitle = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 60px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 auto 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
`;

const BenefitsSection = styled.section`
  padding: 80px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const BenefitsList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  gap: 30px;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const BenefitIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 25px;
  flex-shrink: 0;
  font-size: 1.5rem;
  color: white;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 15px;
  }
`;

const BenefitText = styled.div`
  h4 {
    color: #333;
    font-size: 1.2rem;
    margin-bottom: 8px;
    font-weight: 600;
  }
  
  p {
    color: #666;
    line-height: 1.5;
  }
`;

const CTASection = styled.section`
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
  color: white;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  background: white;
  color: #667eea;
  border: none;
  padding: 20px 50px;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
`;

const Footer = styled.footer`
  background: #333;
  color: white;
  text-align: center;
  padding: 40px 20px;
  
  p {
    margin: 0;
    opacity: 0.8;
  }
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <Container>
      <Header>
        <Logo>Joy Dairy</Logo>
        <HeaderButton onClick={handleGetStarted}>Sign In</HeaderButton>
      </Header>

      <HeroSection>
        <FloatingElement />
        <FloatingElement />
        <FloatingElement />
        <HeroContent>
          <HeroTitle>Transform Your Life Through Daily Reflection</HeroTitle>
          <HeroSubtitle>
            Discover the power of manifestation, gratitude, and healing through our guided daily journaling experience. 
            Your journey to emotional wellness starts here.
          </HeroSubtitle>
          <HeroCTA onClick={handleGetStarted}>Start Your Journey</HeroCTA>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionTitle>Healing Through Daily Practice</SectionTitle>
        <SectionSubtitle>
          Joy Dairy combines proven counseling techniques with manifestation practices to create a powerful tool for personal growth and emotional healing.
        </SectionSubtitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🙏</FeatureIcon>
            <FeatureTitle>Gratitude Practice</FeatureTitle>
            <FeatureDescription>
              Cultivate a positive mindset by recording daily gratitudes. Scientific research shows gratitude practice improves mental health and life satisfaction.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>✨</FeatureIcon>
            <FeatureTitle>Manifestation Journaling</FeatureTitle>
            <FeatureDescription>
              Clarify your intentions and manifest your desires through focused writing. Transform your thoughts into reality with guided manifestation exercises.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🌱</FeatureIcon>
            <FeatureTitle>Daily Reflection</FeatureTitle>
            <FeatureDescription>
              Process your emotions and thoughts through structured reflection. Build self-awareness and emotional intelligence with guided prompts.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </Section>

      <BenefitsSection>
        <SectionTitle>Why Choose Joy Dairy?</SectionTitle>
        <SectionSubtitle>
          Our app is designed by wellness experts to provide a comprehensive approach to mental and emotional well-being.
        </SectionSubtitle>
        <BenefitsList>
          <BenefitItem>
            <BenefitIcon>📱</BenefitIcon>
            <BenefitText>
              <h4>Mobile-First Design</h4>
              <p>Perfect for daily use on your phone. Write entries anytime, anywhere with our intuitive mobile interface.</p>
            </BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitIcon>📅</BenefitIcon>
            <BenefitText>
              <h4>Visual Progress Tracking</h4>
              <p>See your journey unfold with our beautiful calendar view. Track your consistency and celebrate your growth.</p>
            </BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitIcon>🔒</BenefitIcon>
            <BenefitText>
              <h4>Private & Secure</h4>
              <p>Your thoughts are safe with us. Bank-level security ensures your personal reflections remain completely private.</p>
            </BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitIcon>💡</BenefitIcon>
            <BenefitText>
              <h4>Evidence-Based Approach</h4>
              <p>Our journaling prompts are based on cognitive behavioral therapy and positive psychology research.</p>
            </BenefitText>
          </BenefitItem>
        </BenefitsList>
      </BenefitsSection>

      <CTASection>
        <CTATitle>Ready to Start Your Healing Journey?</CTATitle>
        <CTADescription>
          Join thousands of users who have transformed their lives through daily reflection, gratitude, and manifestation practice. 
          Your emotional wellness journey begins with a single entry.
        </CTADescription>
        <CTAButton onClick={handleGetStarted}>Get Started Free</CTAButton>
      </CTASection>

      <Footer>
        <p>&copy; 2024 Joy Dairy. Empowering your journey to emotional wellness.</p>
      </Footer>
    </Container>
  );
};

export default LandingPage;
