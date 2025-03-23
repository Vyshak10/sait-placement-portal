import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
  useTheme,
  styled,
} from '@mui/material';
import { supabase } from '../../config/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Visibility,
  VisibilityOff,
  School,
  Email,
  Lock,
  Work,
  TrendingUp,
  Group,
  CheckCircle,
  Assignment,
  BusinessCenter,
  EventNote,
  Assessment,
} from '@mui/icons-material';
import { studentTheme } from '../../theme/studentTheme';

// Styled components
const BackgroundContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  background: '#ffffff',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(25, 118, 210, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(25, 118, 210, 0.03) 0%, transparent 50%)
    `,
    zIndex: 0,
  }
}));

const DecorativeCircle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(33, 150, 243, 0.05) 50%, rgba(66, 165, 245, 0.05) 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(25, 118, 210, 0.08)',
  zIndex: 0,
}));

const DecorativeShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(33, 150, 243, 0.05) 50%, rgba(66, 165, 245, 0.05) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(25, 118, 210, 0.08)',
  borderRadius: '24px',
  transform: 'rotate(45deg)',
  zIndex: 0,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(25, 118, 210, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  width: { xs: '48px', md: '64px' },
  height: { xs: '48px', md: '64px' },
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(25, 118, 210, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(25, 118, 210, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.95)',
    },
    [theme.breakpoints.down('sm')]: {
      '& .MuiInputBase-input': {
        padding: '12px 14px',
      }
    }
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(25, 118, 210, 0.7)',
    '&.Mui-focused': {
      color: '#1976d2',
    },
    [theme.breakpoints.down('sm')]: {
      transform: 'translate(14px, 12px) scale(1)',
    }
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
  color: '#ffffff',
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0.25px',
  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 24px rgba(25, 118, 210, 0.3)',
  },
  '&:disabled': {
    background: 'rgba(25, 118, 210, 0.12)',
    color: 'rgba(25, 118, 210, 0.5)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    fontSize: '0.9rem',
  }
}));

const SlidingFeatureBox = styled(Box)(({ theme, index }) => ({
  position: 'absolute',
  width: '100%',
  padding: '30px',
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
  border: '1px solid rgba(25, 118, 210, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  '& .feature-icon': {
    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
    borderRadius: '50%',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
    '& .MuiSvgIcon-root': {
      color: '#ffffff',
      fontSize: '32px'
    }
  },
  animation: `slideIn 16s linear infinite`,
  animationDelay: `${index * -4}s`,
  '@keyframes slideIn': {
    '0%': {
      transform: 'translate(-50%, 100%)',
      opacity: 0,
    },
    '8%': {
      transform: 'translate(-50%, 0%)',
      opacity: 1,
    },
    '92%': {
      transform: 'translate(-50%, 0%)',
      opacity: 1,
    },
    '100%': {
      transform: 'translate(-50%, -100%)',
      opacity: 0,
    }
  },
  zIndex: 1,
}));

const FeatureImage = styled('img')({
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '16px',
});

const StudentAuth = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.error('Login error:', signInError);
        throw signInError;
      }

      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('email', formData.email)
        .single();

      if (studentError) {
        console.error('Student lookup error:', studentError);
        throw new Error('Student account not found');
      }

      console.log('Student login successful:', { authData, studentData });
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const slidingFeatures = [
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: "Resume Builder",
      description: "Create and manage professional resumes with our easy-to-use builder",
      image: "/images/resume-builder.jpg"
    },
    {
      icon: <BusinessCenter sx={{ fontSize: 40 }} />,
      title: "Job Applications",
      description: "Track and manage all your job applications in one place",
      image: "/images/job-applications.jpg"
    },
    {
      icon: <EventNote sx={{ fontSize: 40 }} />,
      title: "Interview Scheduler",
      description: "Schedule and prepare for interviews with top companies",
      image: "/images/interview-scheduler.jpg"
    },
    {
      icon: <Work sx={{ fontSize: 40 }} />,
      title: "Internship Portal",
      description: "Access exclusive internship opportunities from leading companies",
      image: "/images/internship-portal.jpg"
    },
  ];

  return (
    <BackgroundContainer>
      {/* Decorative elements */}
      <DecorativeCircle sx={{ width: '300px', height: '300px', top: '-100px', left: '-100px' }} />
      <DecorativeCircle sx={{ width: '200px', height: '200px', bottom: '-50px', right: '-50px' }} />
      <DecorativeShape sx={{ width: '150px', height: '150px', top: '20%', right: '10%' }} />
      <DecorativeShape sx={{ width: '100px', height: '100px', bottom: '30%', left: '5%' }} />

      {/* Main content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 8 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          gap: { xs: 4, md: 0 }
        }}>
          {/* Login Form Container */}
          <Box
            sx={{
              width: { xs: '90%', sm: '400px' },
              position: 'relative',
              zIndex: 1,
              ml: { xs: 0, md: '5%' },
              height: { xs: 'auto', md: '80vh' },
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <StyledPaper elevation={3} sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              width: '100%',
              p: { xs: 3, md: 4 }
            }}>
              {/* Logo */}
              <LogoContainer>
                <School sx={{ fontSize: 32, color: 'white' }} />
              </LogoContainer>

              {/* Header */}
              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button
                  component={Link}
                  to="/auth"
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    color: 'rgba(25, 118, 210, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    }
                  }}
                >
                  Back
                </Button>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#1976d2',
                    textAlign: 'center',
                    fontSize: '2rem',
                    letterSpacing: '-0.5px'
                  }}
                >
                  Student Login
                </Typography>
                <Box sx={{ width: 40 }} />
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    '& .MuiAlert-message': {
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <StyledTextField
                      required
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="Enter your email address"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      required
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{
                                color: 'rgba(25, 118, 210, 0.7)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                  color: '#1976d2',
                                  transform: 'scale(1.1)'
                                }
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <StyledButton
                  type="submit"
                  fullWidth
                  disabled={loading}
                  sx={{ 
                    mt: 4, 
                    mb: 3, 
                    p: 1.75,
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '0.25px',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </StyledButton>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Don't have an account?
                  </Typography>
                  <Button
                    component={Link}
                    to="/register"
                    sx={{
                      color: '#1976d2',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      }
                    }}
                  >
                    Register as Student
                  </Button>
                </Box>
              </Box>
            </StyledPaper>
          </Box>

          {/* Sliding Feature Boxes Container */}
          <Box
            sx={{
              width: { xs: '90%', md: '60%' },
              ml: { xs: 0, md: 4 },
              height: { xs: '400px', md: '80vh' },
              position: 'relative',
              overflow: 'hidden',
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: { xs: '400px', md: '80vh' },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {slidingFeatures.map((feature, index) => (
                <SlidingFeatureBox 
                  key={index} 
                  index={index}
                  sx={{
                    width: '90%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    '@media (max-width: 600px)': {
                      padding: '20px',
                    }
                  }}
                >
                  <FeatureImage
                    src={feature.image}
                    alt={feature.title}
                    loading="lazy"
                    sx={{
                      height: { xs: '200px', md: '300px' },
                    }}
                  />
                  <Box sx={{ color: '#1976d2' }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#1976d2',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(25, 118, 210, 0.8)',
                      textAlign: 'center',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </SlidingFeatureBox>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </BackgroundContainer>
  );
};

export default StudentAuth;
