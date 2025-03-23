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
  Link,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  useTheme,
  styled,
} from '@mui/material';
import { supabase } from '../../config/supabaseClient';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Visibility,
  VisibilityOff,
  Business,
  Email,
  Lock,
  Phone,
  LocationOn,
  AttachMoney,
  Description,
  Work,
  TrendingUp,
  Group,
  CheckCircle,
} from '@mui/icons-material';

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
      radial-gradient(circle at 20% 30%, rgba(0, 71, 171, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(0, 71, 171, 0.03) 0%, transparent 50%)
    `,
    zIndex: 0,
  }
}));

const DecorativeCircle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(0, 71, 171, 0.05) 0%, rgba(0, 71, 171, 0.05) 50%, rgba(0, 71, 171, 0.05) 100%)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 71, 171, 0.08)',
  zIndex: 0,
}));

const DecorativeShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  background: 'linear-gradient(135deg, rgba(0, 71, 171, 0.05) 0%, rgba(0, 71, 171, 0.05) 50%, rgba(0, 71, 171, 0.05) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 71, 171, 0.08)',
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
  border: '1px solid rgba(0, 71, 171, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  background: '#0047AB',
  boxShadow: '0 4px 20px rgba(0, 71, 171, 0.2)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(0, 71, 171, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 71, 171, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0047AB',
    },
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.95)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(0, 71, 171, 0.7)',
    '&.Mui-focused': {
      color: '#0047AB',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: '#0047AB',
  color: '#ffffff',
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0.25px',
  boxShadow: '0 4px 20px rgba(0, 71, 171, 0.2)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: '#003380',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 24px rgba(0, 71, 171, 0.3)',
  },
  '&:disabled': {
    background: 'rgba(0, 71, 171, 0.12)',
    color: 'rgba(0, 71, 171, 0.5)',
  },
}));

const CompanyAuth = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    job_requirements: '',
    job_description: '',
    location: '',
    salary_range: '',
    email: '',
    phone: '',
    password: ''
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
      if (isLogin) {
        // Login - check if company exists
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('company_name', formData.company_name)
          .maybeSingle();

        if (companyError) {
          console.error('Login error:', companyError);
          throw new Error('Error checking company. Please try again.');
        }

        if (!company) {
          throw new Error('Company not found. Please check your company name or register as a new company.');
        }

        // Store company info in localStorage for persistence
        localStorage.setItem('companyData', JSON.stringify(company));
        
        // Force navigation after setting localStorage
        window.location.href = '/company/dashboard';
        return;
      }

      // Validate required fields
      if (!formData.company_name || !formData.industry || !formData.email) {
        throw new Error('Company name, industry, and email are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Register - first check if company already exists
      const { data: existingCompany, error: checkError } = await supabase
        .from('companies')
        .select('company_name')
        .eq('company_name', formData.company_name)
        .maybeSingle();

      if (checkError) {
        console.error('Check error:', checkError);
        throw new Error('Error checking company. Please try again.');
      }

      if (existingCompany) {
        throw new Error('Company already registered. Please use the login option.');
      }

      // Create new company profile with only required fields
      const { data: newCompany, error: insertError } = await supabase
        .from('companies')
        .insert([{
          company_name: formData.company_name,
          industry: formData.industry,
          job_requirements: formData.job_requirements || null,
          job_description: formData.job_description || null,
          location: formData.location || null,
          salary_range: formData.salary_range || null,
          verified: true,
          auth_id: crypto.randomUUID()
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Company creation error:', insertError);
        throw new Error('Error creating company profile. Please try again.');
      }

      if (!newCompany) {
        throw new Error('Failed to create company profile. Please try again.');
      }

      // Store company info in localStorage
      localStorage.setItem('companyData', JSON.stringify(newCompany));
      navigate('/company/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundContainer>
      {/* Decorative elements */}
      <DecorativeCircle sx={{ width: '300px', height: '300px', top: '-100px', left: '-100px' }} />
      <DecorativeCircle sx={{ width: '200px', height: '200px', bottom: '-50px', right: '-50px' }} />
      <DecorativeShape sx={{ width: '150px', height: '150px', top: '20%', right: '10%' }} />
      <DecorativeShape sx={{ width: '100px', height: '100px', bottom: '30%', left: '5%' }} />

      {/* Main content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          {/* Login Form Container */}
          <Box
            sx={{
              width: '400px',
              position: 'relative',
              zIndex: 1,
              ml: '5%',
            }}
          >
            <StyledPaper elevation={3}>
              {/* Logo */}
              <LogoContainer>
                <Business sx={{ fontSize: 32, color: 'white' }} />
              </LogoContainer>

              {/* Header */}
              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button
                  component={RouterLink}
                  to="/auth"
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    color: 'rgba(0, 71, 171, 0.9)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 71, 171, 0.1)',
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
                    color: '#0047AB',
                    textAlign: 'center',
                    fontSize: '2rem',
                    letterSpacing: '-0.5px'
                  }}
                >
                  Company Login
                </Typography>
                <Box sx={{ width: 40 }} />
              </Box>

              <Tabs 
                value={isLogin ? 0 : 1} 
                onChange={(e, newValue) => setIsLogin(newValue === 0)}
                variant="fullWidth"
                sx={{ 
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    background: 'linear-gradient(135deg, #0047AB 0%, #003380 50%, #002050 100%)',
                    height: '3px',
                  },
                  '& .MuiTab-root': {
                    color: 'rgba(0, 71, 171, 0.7)',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&.Mui-selected': {
                      color: '#0047AB',
                      fontWeight: 'bold',
                    },
                    '&:hover': {
                      color: '#0047AB',
                    }
                  }
                }}
              >
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>

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
                      label="Company Name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {isLogin && (
                    <Grid item xs={12}>
                      <StyledTextField
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
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
                                  color: 'rgba(0, 71, 171, 0.7)',
                                  transition: 'all 0.3s ease-in-out',
                                  '&:hover': {
                                    color: '#0047AB',
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
                  )}

                  {!isLogin && (
                    <>
                      <Grid item xs={12}>
                        <StyledTextField
                          required
                          fullWidth
                          label="Industry"
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Work />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <StyledTextField
                          required
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
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
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <StyledTextField
                          fullWidth
                          label="Location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOn />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <StyledTextField
                          fullWidth
                          label="Salary Range"
                          name="salary_range"
                          value={formData.salary_range}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachMoney />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <StyledTextField
                          fullWidth
                          label="Password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
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
                                    color: 'rgba(0, 71, 171, 0.7)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                      color: '#0047AB',
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
                      <Grid item xs={12}>
                        <StyledTextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Job Requirements"
                          name="job_requirements"
                          value={formData.job_requirements}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Description />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <StyledTextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Job Description"
                          name="job_description"
                          value={formData.job_description}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Description />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </>
                  )}
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
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Register')}
                </StyledButton>
              </Box>
            </StyledPaper>
          </Box>
        </Box>
      </Container>
    </BackgroundContainer>
  );
};

export default CompanyAuth;
