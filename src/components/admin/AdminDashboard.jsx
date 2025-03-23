import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  TablePagination,
  TextField,
  InputAdornment,
  Divider,
  useTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ExitToApp as LogoutIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    totalJobPostings: 0,
    placedStudents: 0,
    activeCompanies: 0
  });
  
  // New states for pagination and search
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const adminSession = JSON.parse(localStorage.getItem('adminSession'));
    if (!adminSession || !adminSession.isAdmin) {
      navigate('/admin/login');
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*');
      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Fetch companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*');
      if (companiesError) throw companiesError;
      setCompanies(companiesData || []);

      // Fetch job postings
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_postings')
        .select('*');
      if (jobsError) throw jobsError;
      setJobPostings(jobsData || []);

      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*, students(*), companies(*)');
      if (applicationsError) throw applicationsError;
      setApplications(applicationsData || []);

      // Update analytics
      setAnalytics({
        totalStudents: studentsData?.length || 0,
        totalCompanies: companiesData?.length || 0,
        totalApplications: applicationsData?.length || 0,
        totalJobPostings: jobsData?.length || 0,
        placedStudents: applicationsData?.filter(app => app.status === 'accepted')?.length || 0,
        activeCompanies: companiesData?.filter(company => 
          jobsData?.some(job => job.company_id === company.id))?.length || 0
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setNotification({
        open: true,
        message: 'Error loading data: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedItem) return;

      const table = activeTab === 1 ? 'students' : 'companies';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', selectedItem.id);

      if (error) throw error;

      setNotification({
        open: true,
        message: `${activeTab === 1 ? 'Student' : 'Company'} deleted successfully`,
        severity: 'success'
      });

      loadData();
      setDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting:', error);
      setNotification({
        open: true,
        message: 'Error deleting: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filterData = (data) => {
    return data.filter(item => {
      if (activeTab === 1) { // Students
        return item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.department?.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (activeTab === 2) { // Companies
        return item.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.industry?.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (activeTab === 3) { // Applications
        return item.students?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.companies?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });
  };

  const renderDashboard = () => (
    <Box sx={{ py: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>Students</Typography>
              <Typography variant="h3">{analytics.totalStudents}</Typography>
              <Typography variant="body2">
                {analytics.placedStudents} placed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
              color: 'white'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>Companies</Typography>
              <Typography variant="h3">{analytics.totalCompanies}</Typography>
              <Typography variant="body2">
                {analytics.activeCompanies} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(45deg, #2196F3, #1976D2)',
              color: 'white'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>Applications</Typography>
              <Typography variant="h3">{analytics.totalApplications}</Typography>
              <Typography variant="body2">
                Total submissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              height: '100%',
              background: 'linear-gradient(45deg, #4CAF50, #388E3C)',
              color: 'white'
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>Job Postings</Typography>
              <Typography variant="h3">{analytics.totalJobPostings}</Typography>
              <Typography variant="body2">
                Active positions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Recent Applications
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Applied Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.slice(0, 5).map((app) => (
                    <TableRow key={app.id} hover>
                      <TableCell>{app.students?.full_name}</TableCell>
                      <TableCell>{app.companies?.company_name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={app.status} 
                          color={
                            app.status === 'accepted' ? 'success' :
                            app.status === 'rejected' ? 'error' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderApplications = () => (
    <Box sx={{ py: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData(applications)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((app) => (
                    <TableRow key={app.id} hover>
                      <TableCell>{app.students?.full_name}</TableCell>
                      <TableCell>{app.companies?.company_name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={app.status} 
                          color={
                            app.status === 'accepted' ? 'success' :
                            app.status === 'rejected' ? 'error' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedItem(app);
                            setViewDialog(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filterData(applications).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </Box>
  );

  const renderStudents = () => (
    <Box sx={{ py: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>CGPA</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData(students)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student) => (
                    <TableRow key={student.id} hover>
                      <TableCell>{student.full_name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{student.cgpa}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedItem(student);
                            setViewDialog(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedItem(student);
                            setDeleteDialog(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filterData(students).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </Box>
  );

  const renderCompanies = () => (
    <Box sx={{ py: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Industry</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Job Postings</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData(companies)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((company) => (
                    <TableRow key={company.id} hover>
                      <TableCell>{company.company_name}</TableCell>
                      <TableCell>{company.industry}</TableCell>
                      <TableCell>{company.location}</TableCell>
                      <TableCell>
                        {jobPostings.filter(job => job.company_id === company.id).length}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedItem(company);
                            setViewDialog(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => {
                            setSelectedItem(company);
                            setDeleteDialog(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filterData(companies).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
        }}
      >
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={loadData}>
            <RefreshIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper sx={{ p: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => {
              setActiveTab(newValue);
              setPage(0);
              setSearchTerm('');
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab icon={<DashboardIcon />} label="Dashboard" />
            <Tab icon={<PersonIcon />} label="Students" />
            <Tab icon={<BusinessIcon />} label="Companies" />
            <Tab icon={<AssignmentIcon />} label="Applications" />
          </Tabs>

          <Box>
            {activeTab === 0 && renderDashboard()}
            {activeTab === 1 && renderStudents()}
            {activeTab === 2 && renderCompanies()}
            {activeTab === 3 && renderApplications()}
          </Box>
        </Paper>
      </Container>

      {/* View Dialog */}
      <Dialog 
        open={viewDialog} 
        onClose={() => setViewDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          {activeTab === 1 ? 'Student Details' : 
           activeTab === 2 ? 'Company Details' : 
           'Application Details'}
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Grid container spacing={3}>
              {activeTab === 1 ? (
                // Student details
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Name:</strong> {selectedItem.full_name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Email:</strong> {selectedItem.email}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Department:</strong> {selectedItem.department}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>CGPA:</strong> {selectedItem.cgpa}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Phone:</strong> {selectedItem.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Skills:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedItem.skills?.map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          color="primary" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                </>
              ) : activeTab === 2 ? (
                // Company details
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Company:</strong> {selectedItem.company_name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Industry:</strong> {selectedItem.industry}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Location:</strong> {selectedItem.location}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Job Postings:</strong>
                    </Typography>
                    <List>
                      {jobPostings
                        .filter(job => job.company_id === selectedItem.id)
                        .map((job, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={job.job_description}
                              secondary={`Location: ${job.location}`}
                            />
                          </ListItem>
                        ))}
                    </List>
                  </Grid>
                </>
              ) : (
                // Application details
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Student:</strong> {selectedItem.students?.full_name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Company:</strong> {selectedItem.companies?.company_name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Status:</strong> 
                      <Chip 
                        label={selectedItem.status} 
                        color={
                          selectedItem.status === 'accepted' ? 'success' :
                          selectedItem.status === 'rejected' ? 'error' : 'default'
                        }
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Applied Date:</strong> {new Date(selectedItem.created_at).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog} 
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete this {activeTab === 1 ? 'student' : 'company'}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
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

export default AdminDashboard; 