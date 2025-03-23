import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { dashboardStyles } from '../../styles/dashboardStyles';
import { supabase } from '../../config/supabaseClient';
import { getCompanyApplications, updateApplicationStatus } from '../../services/applicationService';
import { updateJobPostingsSchema } from '../../services/updateSchemaService';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [jobPostings, setJobPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState(0);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewProfileDialog, setViewProfileDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  const [newPosting, setNewPosting] = useState({
    job_requirements: '',
    job_description: '',
    location: '',
    salary_range: ''
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const companyData = JSON.parse(localStorage.getItem('companyData'));
    if (!companyData) {
      navigate('/company/auth');
      return;
    }

    const loadCompanyData = async () => {
      try {
        // Get latest company data
        const { data: company, error } = await supabase
          .from('companies')
          .select('*')
          .eq('company_name', companyData.company_name)
          .single();

        if (error) {
          console.error('Error fetching company profile:', error);
          throw error;
        }
        
        if (!company) {
          console.error('Company not found:', companyData.company_name);
          throw new Error('Company profile not found');
        }
        
        console.log('Company data loaded:', company);
        setCompanyProfile(company);
        setEditedProfile(company);

        // Check and initialize the job_postings table if needed
        try {
          const { count, error: checkError } = await supabase
            .from('job_postings')
            .select('*', { count: 'exact', head: true })
            .limit(1);
            
          if (checkError && checkError.code === '42P01') {
            console.log('job_postings table does not exist, initializing...');
            await updateJobPostingsSchema();
          }
        } catch (schemaError) {
          console.error('Error checking/initializing job_postings schema:', schemaError);
          // Continue anyway, we'll try again when posting a job
        }

        try {
          // Get job postings - in a separate try/catch to prevent it from affecting other operations
          console.log('Fetching job postings for company:', company.company_name);
          const { data: jobs, error: jobsError } = await supabase
            .from('job_postings')
            .select('*')
            .eq('company_name', company.company_name);

          if (jobsError) {
            console.error('Error fetching job postings:', jobsError);
            // Don't throw, just log and continue with empty jobs
            setJobPostings([]);
          } else {
            console.log('Job postings loaded:', jobs);
            setJobPostings(jobs || []);
          }
        } catch (jobError) {
          console.error('Exception in job postings fetch:', jobError);
          setJobPostings([]);
        }

        try {
          // Get applications using the applicationService - in a separate try/catch
          console.log('Fetching applications for company ID:', company.id);
          const applications = await getCompanyApplications(company.id);
          console.log('Applications fetched:', applications);
          setApplications(applications || []);
        } catch (appError) {
          console.error('Exception in applications fetch:', appError);
          setApplications([]);
          // Show notification for this specific error
          setNotification({
            open: true,
            message: 'Error loading applications: ' + appError.message,
            severity: 'error'
          });
        }
      } catch (error) {
        console.error('Error in loadCompanyData:', error);
        setNotification({
          open: true,
          message: 'Error loading company data: ' + (error.message || 'Unknown error'),
          severity: 'error'
        });
      }
    };

    loadCompanyData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('companyData');
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('companies')
        .update(editedProfile)
        .eq('company_name', companyProfile.company_name);

      if (error) throw error;

      setCompanyProfile(editedProfile);
      setIsEditMode(false);
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Error updating profile',
        severity: 'error'
      });
    }
  };

  const handleCreateJob = async () => {
    try {
      console.log('Creating new job posting with data:', {
        ...newPosting,
        company_name: companyProfile.company_name,
        company_id: companyProfile.id,
        posting_date: new Date().toISOString()
      });

      // Prepare job posting data
      const jobData = {
        ...newPosting,
        company_name: companyProfile.company_name,
        company_id: companyProfile.id,
        posting_date: new Date().toISOString()
      };

      // First check if the table exists by querying it
      const { count, error: checkError } = await supabase
        .from('job_postings')
        .select('*', { count: 'exact', head: true })
        .limit(1);

      // If there's an error, the table might not exist
      if (checkError) {
        console.error('Error checking job_postings table:', checkError);
        
        // Try to create the table
        if (checkError.code === '42P01') { // PostgreSQL code for undefined_table
          console.log('job_postings table does not exist, creating it...');
          
          // Update schema to create the table
          const { success, error: schemaError } = await updateJobPostingsSchema();
          
          if (!success) {
            console.error('Error creating job_postings table:', schemaError);
            setNotification({
              open: true,
              message: 'Job postings feature could not be initialized. Please contact support.',
              severity: 'error'
            });
            return;
          }
          
          console.log('job_postings table created successfully');
        }
      }

      // Insert the job posting
      const { data, error } = await supabase
        .from('job_postings')
        .insert(jobData)
        .select();

      if (error) {
        console.error('Error inserting job posting:', error);
        throw error;
      }

      console.log('Job posting created successfully:', data);

      // Refresh job postings
      const { data: jobs, error: fetchError } = await supabase
        .from('job_postings')
        .select('*')
        .eq('company_name', companyProfile.company_name);

      if (fetchError) {
        console.error('Error fetching updated job postings:', fetchError);
      } else {
        setJobPostings(jobs || []);
      }

      setNewPosting({
        job_requirements: '',
        job_description: '',
        location: '',
        salary_range: ''
      });

      setNotification({
        open: true,
        message: 'Job posted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error creating job:', error);
      setNotification({
        open: true,
        message: `Error creating job posting: ${error.message || 'Unknown error'}`,
        severity: 'error'
      });
    }
  };

  const handleViewStudentProfile = (student) => {
    setSelectedStudent(student);
    setViewProfileDialog(true);
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);

      // Update local state
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplications(updatedApplications);

      setNotification({
        open: true,
        message: `Application ${newStatus}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      setNotification({
        open: true,
        message: 'Error updating application status',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header with gradient */}
      <AppBar position="static" sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon sx={{ color: '#ffffff' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#ffffff' }}>
              {companyProfile?.company_name || 'Company Dashboard'}
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: isMobile ? 2 : 3, height: '100%' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant={isMobile ? "fullWidth" : "standard"}
            sx={{ 
              mb: 3,
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
                height: '3px',
              },
              '& .MuiTab-root': {
                color: 'rgba(25, 118, 210, 0.7)',
                textTransform: 'none',
                fontSize: '1rem',
                minHeight: '48px',
                padding: '6px 16px',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '8px',
                '&.Mui-selected': {
                  color: '#1976d2',
                  fontWeight: 'bold',
                  '& .MuiSvgIcon-root': {
                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                },
                '&:hover': {
                  color: '#1976d2',
                  '& .MuiSvgIcon-root': {
                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                },
                '& .MuiSvgIcon-root': {
                  color: 'inherit',
                  marginRight: '8px',
                }
              }
            }}
          >
            <Tab 
              icon={<BusinessIcon />} 
              iconPosition="start"
              label={isMobile ? "" : "Company Profile"} 
              aria-label="Company Profile"
              sx={{ 
                minWidth: isMobile ? '0' : '160px',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(33, 150, 243, 0.05) 50%, rgba(66, 165, 245, 0.05) 100%)',
                  borderRadius: '8px 8px 0 0',
                }
              }}
            />
            <Tab 
              icon={<WorkIcon />} 
              iconPosition="start"
              label={isMobile ? "" : "Job Postings"} 
              aria-label="Job Postings"
              sx={{ 
                minWidth: isMobile ? '0' : '160px',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(33, 150, 243, 0.05) 50%, rgba(66, 165, 245, 0.05) 100%)',
                  borderRadius: '8px 8px 0 0',
                }
              }}
            />
            <Tab 
              icon={<AccountCircleIcon />} 
              iconPosition="start"
              label={isMobile ? "" : "Applications"} 
              aria-label="Applications"
              sx={{ 
                minWidth: isMobile ? '0' : '160px',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(33, 150, 243, 0.05) 50%, rgba(66, 165, 245, 0.05) 100%)',
                  borderRadius: '8px 8px 0 0',
                }
              }}
            />
          </Tabs>

          {/* Tab Content Container */}
          <Box sx={{ 
            mt: 2,
            p: 2,
            borderRadius: '0 8px 8px 8px',
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.02) 0%, rgba(33, 150, 243, 0.02) 50%, rgba(66, 165, 245, 0.02) 100%)',
            border: '1px solid rgba(25, 118, 210, 0.1)',
          }}>
            {/* Company Profile Tab */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between', 
                  mb: 2,
                  gap: 1
                }}>
                  <Typography variant="h5">Company Profile</Typography>
                  <Button
                    variant={isEditMode ? "contained" : "outlined"}
                    onClick={() => isEditMode ? handleUpdateProfile() : setIsEditMode(true)}
                    fullWidth={isMobile}
                    sx={{ 
                      background: isEditMode ? 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)' : 'transparent',
                      borderColor: '#1976d2',
                      color: isEditMode ? '#ffffff' : '#1976d2',
                      '&:hover': {
                        background: isEditMode 
                          ? 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)'
                          : 'rgba(25, 118, 210, 0.04)',
                        borderColor: '#2196f3'
                      },
                      px: 3,
                      py: 1,
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      boxShadow: isEditMode ? '0 2px 8px rgba(25, 118, 210, 0.2)' : 'none',
                      minWidth: '120px'
                    }}
                  >
                    {isEditMode ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      value={isEditMode ? editedProfile.company_name : companyProfile?.company_name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, company_name: e.target.value })}
                      disabled={!isEditMode}
                      margin="normal"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(25, 118, 210, 0.5)',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#1976d2',
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Industry"
                      value={isEditMode ? editedProfile.industry : companyProfile?.industry}
                      onChange={(e) => setEditedProfile({ ...editedProfile, industry: e.target.value })}
                      disabled={!isEditMode}
                      margin="normal"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(25, 118, 210, 0.5)',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#1976d2',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={isEditMode ? editedProfile.location : companyProfile?.location}
                      onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                      disabled={!isEditMode}
                      margin="normal"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(25, 118, 210, 0.5)',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#1976d2',
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Salary Range"
                      value={isEditMode ? editedProfile.salary_range : companyProfile?.salary_range}
                      onChange={(e) => setEditedProfile({ ...editedProfile, salary_range: e.target.value })}
                      disabled={!isEditMode}
                      margin="normal"
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(25, 118, 210, 0.5)',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#1976d2',
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Job Postings Tab */}
            {activeTab === 1 && (
              <Box>
                <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
                  <Typography variant="h5" gutterBottom>Create New Job Posting</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Job Description"
                        multiline
                        rows={isMobile ? 3 : 4}
                        value={newPosting.job_description}
                        onChange={(e) => setNewPosting({ ...newPosting, job_description: e.target.value })}
                        margin="normal"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Job Requirements (comma separated skills)"
                        multiline
                        rows={isMobile ? 3 : 4}
                        value={newPosting.job_requirements}
                        onChange={(e) => setNewPosting({ ...newPosting, job_requirements: e.target.value })}
                        margin="normal"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={newPosting.location}
                        onChange={(e) => setNewPosting({ ...newPosting, location: e.target.value })}
                        margin="normal"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Salary Range"
                        value={newPosting.salary_range}
                        onChange={(e) => setNewPosting({ ...newPosting, salary_range: e.target.value })}
                        margin="normal"
                        size={isMobile ? "small" : "medium"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateJob}
                        disabled={!newPosting.job_description || !newPosting.job_requirements}
                        fullWidth={isMobile}
                        size={isMobile ? "small" : "medium"}
                      >
                        Post Job
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>

                <Typography variant="h5" gutterBottom>Current Job Postings</Typography>
                <Grid container spacing={2}>
                  {jobPostings.length === 0 ? (
                    <Grid item xs={12}>
                      <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                        <Typography variant="body1">No job postings yet. Create your first job posting above.</Typography>
                      </Paper>
                    </Grid>
                  ) : (
                    jobPostings.map((job, index) => (
                      <Grid item xs={12} sm={6} lg={4} key={index}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>{job.job_description}</Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Posted: {new Date(job.posting_date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1" paragraph>
                              <strong>Location:</strong> {job.location}
                            </Typography>
                            <Typography variant="body1" paragraph>
                              <strong>Salary Range:</strong> {job.salary_range}
                            </Typography>
                            <Typography variant="body1" paragraph>
                              <strong>Requirements:</strong>
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                              {job.job_requirements.split(',').map((skill, idx) => (
                                <Chip key={idx} label={skill.trim()} size="small" />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Box>
            )}

            {/* Applications Tab */}
            {activeTab === 2 && (
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'stretch' : 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 2
                }}>
                  <Typography variant="h5">Student Applications</Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => loadCompanyData()}
                    fullWidth={isMobile}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
                      color: '#ffffff',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                      },
                      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      minWidth: '160px'
                    }}
                  >
                    Refresh Applications
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  {applications.length === 0 ? (
                    <Grid item xs={12}>
                      <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                        <Typography variant="body1">No applications yet.</Typography>
                      </Paper>
                    </Grid>
                  ) : (
                    applications.map((application, index) => (
                      <Grid item xs={12} key={application.id || index}>
                        <Card>
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={8}>
                                <Typography variant={isMobile ? "subtitle1" : "h6"}>
                                  {application.students?.full_name || "Student Name Not Available"}
                                  {" "}
                                  <Chip 
                                    label={application.status} 
                                    color={
                                      application.status === 'accepted' ? 'success' :
                                      application.status === 'rejected' ? 'error' : 'default'
                                    }
                                    size="small"
                                  />
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                  Student ID: {application.student_id}
                                </Typography>
                                {application.students ? (
                                  <>
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                      Department: {application.students.department || "Unknown"}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                      CGPA: {application.students.cgpa || "N/A"}
                                    </Typography>
                                    {application.students.skills && (
                                      <Box sx={{ mt: 1 }}>
                                        <Typography variant="body2">Skills:</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                          {application.students.skills.map((skill, idx) => (
                                            <Chip key={idx} label={skill} size="small" />
                                          ))}
                                        </Box>
                                      </Box>
                                    )}
                                  </>
                                ) : (
                                  <Typography variant="body2" color="error">
                                    Student profile information is not available
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={4} sx={{ 
                                display: 'flex', 
                                flexDirection: isMobile ? 'row' : 'column', 
                                flexWrap: isMobile ? 'wrap' : 'nowrap',
                                gap: 1, 
                                justifyContent: 'center',
                                alignItems: isMobile ? 'center' : 'flex-start' 
                              }}>
                                {application.students && (
                                  <Button 
                                    variant="outlined" 
                                    onClick={() => handleViewStudentProfile(application.students)}
                                    size={isMobile ? "small" : "medium"}
                                    sx={{ 
                                      width: isMobile ? 'auto' : '100%',
                                      borderColor: '#1976d2',
                                      color: '#1976d2',
                                      '&:hover': {
                                        borderColor: '#2196f3',
                                        background: 'rgba(25, 118, 210, 0.04)',
                                      },
                                      textTransform: 'none',
                                      fontSize: '0.95rem',
                                      fontWeight: 500
                                    }}
                                  >
                                    View Profile
                                  </Button>
                                )}
                                {application.status === 'pending' && (
                                  <>
                                    <Button 
                                      variant="contained" 
                                      onClick={() => handleUpdateApplicationStatus(application.id, 'accepted')}
                                      size={isMobile ? "small" : "medium"}
                                      sx={{ 
                                        width: isMobile ? 'auto' : '100%',
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #43a047 100%)',
                                        color: '#ffffff',
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #388e3c 0%, #43a047 100%)',
                                        },
                                        boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)',
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                      }}
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      variant="contained" 
                                      onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                                      size={isMobile ? "small" : "medium"}
                                      sx={{ 
                                        width: isMobile ? 'auto' : '100%',
                                        background: 'linear-gradient(135deg, #c62828 0%, #d32f2f 50%, #e53935 100%)',
                                        color: '#ffffff',
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #d32f2f 0%, #e53935 100%)',
                                        },
                                        boxShadow: '0 2px 8px rgba(198, 40, 40, 0.2)',
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                      }}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Student Profile Dialog - Make responsive */}
      <Dialog 
        open={viewProfileDialog} 
        onClose={() => setViewProfileDialog(false)} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>Student Profile</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">{selectedStudent.full_name}</Typography>
                <Typography variant="body1">Department: {selectedStudent.department}</Typography>
                <Typography variant="body1">Year of Study: {selectedStudent.year_of_study}</Typography>
                <Typography variant="body1">CGPA: {selectedStudent.cgpa}</Typography>
                <Typography variant="body1">Email: {selectedStudent.email}</Typography>
                <Typography variant="body1">Phone: {selectedStudent.phone}</Typography>
                {selectedStudent.linkedin_url && (
                  <Typography variant="body1">
                    LinkedIn: <a href={selectedStudent.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
                      View Profile
                    </a>
                  </Typography>
                )}
                {selectedStudent.github_url && (
                  <Typography variant="body1">
                    GitHub: <a href={selectedStudent.github_url} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
                      View Profile
                    </a>
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {selectedStudent.skills && selectedStudent.skills.map((skill, idx) => (
                    <Chip key={idx} label={skill} />
                  ))}
                </Box>
              </Grid>
              {selectedStudent.resume_url && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    href={selectedStudent.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth={isMobile}
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
                      color: '#ffffff',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                      },
                      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      py: 1.5
                    }}
                  >
                    View Resume
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setViewProfileDialog(false)}
            variant="outlined"
            fullWidth={isMobile}
            sx={{ 
              borderColor: '#1976d2',
              color: '#1976d2',
              '&:hover': {
                borderColor: '#2196f3',
                background: 'rgba(25, 118, 210, 0.04)',
              },
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              py: 1.5
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyDashboard;
