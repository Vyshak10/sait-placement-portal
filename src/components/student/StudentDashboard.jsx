import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Divider,
  Snackbar,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  CircularProgress,
  styled,
  AppBar,
  Toolbar,
  Container,
  Drawer
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import WorkIcon from '@mui/icons-material/Work';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import PhoneIcon from '@mui/icons-material/Phone';
import GradeIcon from '@mui/icons-material/Grade';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseClient';
import { getStudentProfile } from '../../services/studentService';
import { searchJobs } from '../../services/companyService';
import { dashboardStyles } from '../../styles/dashboardStyles';
import { extractTextFromPDF, validatePDFFile, findSkillsInContext } from '../../utils/pdfUtils';
import { Link } from 'react-router-dom';
import { applyToJob, getApplicationStatus, getStudentApplications } from '../../services/applicationService';
import { updateJobApplicationsSchema } from '../../services/updateSchemaService';
import Navbar from '../common/Navbar';

// Dummy alumni data for different companies
const companyAlumni = {
  // Default alumni for companies without specific data
  "default": [
    {
      name: "Priya Sharma",
      graduationYear: "2021",
      role: "Software Engineer",
      email: "priya.sharma@gmail.com"
    },
    {
      name: "Rajesh Kumar",
      graduationYear: "2019",
      role: "Senior Product Manager",
      email: "rajesh.kumar@outlook.com"
    },
    {
      name: "Aisha Patel",
      graduationYear: "2020",
      role: "Data Scientist",
      email: "aisha.patel@yahoo.com"
    }
  ],
  
  // Tech Solutions
  "Tech Solutions": [
    {
      name: "Vikram Mehta",
      graduationYear: "2018",
      role: "Full Stack Developer",
      email: "vikram.mehta@techsolutions.com"
    },
    {
      name: "Anjali Singh",
      graduationYear: "2020",
      role: "UX Designer",
      email: "anjali.singh@gmail.com"
    },
    {
      name: "Nikhil Reddy",
      graduationYear: "2019",
      role: "DevOps Engineer",
      email: "nikhil.reddy@outlook.com"
    }
  ],
  
  // Global Finance
  "Global Finance": [
    {
      name: "Siddharth Joshi",
      graduationYear: "2017",
      role: "Financial Analyst",
      email: "siddharth.joshi@globalfinance.com"
    },
    {
      name: "Meera Kapoor",
      graduationYear: "2019",
      role: "Risk Assessment Specialist",
      email: "meera.kapoor@yahoo.com"
    },
    {
      name: "Arjun Malhotra",
      graduationYear: "2020",
      role: "Investment Banking Associate",
      email: "arjun.malhotra@gmail.com"
    }
  ],
  
  // Innovative Systems
  "Innovative Systems": [
    {
      name: "Rahul Verma",
      graduationYear: "2018",
      role: "AI Research Scientist",
      email: "rahul.verma@innovativesystems.com"
    },
    {
      name: "Neha Gupta",
      graduationYear: "2021",
      role: "Cloud Solutions Architect",
      email: "neha.gupta@gmail.com"
    },
    {
      name: "Karan Singhania",
      graduationYear: "2019",
      role: "Systems Engineer",
      email: "karan.singhania@outlook.com"
    }
  ],
  
  // Data Dynamics
  "Data Dynamics": [
    {
      name: "Lakshmi Narayan",
      graduationYear: "2020",
      role: "Data Engineer",
      email: "lakshmi.narayan@datadynamics.com"
    },
    {
      name: "Vivek Sharma",
      graduationYear: "2018",
      role: "Business Intelligence Analyst",
      email: "vivek.sharma@gmail.com"
    },
    {
      name: "Shreya Kapoor",
      graduationYear: "2019",
      role: "Machine Learning Engineer",
      email: "shreya.kapoor@yahoo.com"
    }
  ],
  
  // EcoTech Solutions
  "EcoTech Solutions": [
    {
      name: "Rohit Menon",
      graduationYear: "2017",
      role: "Sustainability Consultant",
      email: "rohit.menon@ecotechsolutions.com"
    },
    {
      name: "Deepika Verma",
      graduationYear: "2020",
      role: "Environmental Engineer",
      email: "deepika.verma@gmail.com"
    },
    {
      name: "Ishaan Khanna",
      graduationYear: "2019",
      role: "Project Manager",
      email: "ishaan.khanna@outlook.com"
    }
  ]
};

const GradientIcon = styled('div')({
  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
  borderRadius: '8px',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiSvgIcon-root': {
    color: '#ffffff',
    fontSize: '24px'
  }
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
  boxShadow: '0 2px 10px rgba(25, 118, 210, 0.1)',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    background: '#1976d2',
    height: '3px',
  },
  '& .MuiTab-root': {
    color: 'rgba(25, 118, 210, 0.7)',
    textTransform: 'none',
    fontSize: '1rem',
    '&.Mui-selected': {
      color: '#1976d2',
      fontWeight: 'bold',
    },
    '&:hover': {
      color: '#1976d2',
    }
  }
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
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)',
  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.2)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.1)',
  border: '1px solid rgba(25, 118, 210, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.1)',
  border: '1px solid rgba(25, 118, 210, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
  },
}));

const StudentDashboard = () => {
  // State for resume handling
  const [resume, setResume] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // State for job matching
  const [matchedCompanies, setMatchedCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [openCustomizeDialog, setOpenCustomizeDialog] = useState(false);

  // State for field analysis
  const [selectedField, setSelectedField] = useState('Software Development');
  const [fieldScores, setFieldScores] = useState({});
  const [allFieldAnalysis, setAllFieldAnalysis] = useState({});

  // State for search
  const [searchSkills, setSearchSkills] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // State for mock test
  const [selectedTest, setSelectedTest] = useState('');
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testInProgress, setTestInProgress] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [testStartTime, setTestStartTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showAnswers, setShowAnswers] = useState({});  // NEW STATE FOR SHOWING ANSWERS

  // State for session and profile
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const [applicationStatuses, setApplicationStatuses] = useState({});

  // Add notification state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Add state for schema update
  const [isSchemaUpdateNeeded, setIsSchemaUpdateNeeded] = useState(false);
  const [isUpdatingSchema, setIsUpdatingSchema] = useState(false);
  
  // Add responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  // Add profile update state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({});
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [isProfileValidated, setIsProfileValidated] = useState(false);

  // Add resize listener for responsive layout
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
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setSession(session);
      
      // Fetch student profile
      getStudentProfile(session.user.user_metadata.student_id)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          setProfile(data);
        });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Available fields and their required skills
  const availableFields = [
    'Software Development',
    'Data Science',
    'Frontend Development',
    'Backend Development',
    'DevOps Engineering',
    'Mobile Development'
  ];

  const fieldSkillsMap = {
    'Software Development': {
      essential: ['javascript', 'python', 'git', 'algorithms', 'data structures'],
      frontend: ['html', 'css', 'react', 'vue', 'angular'],
      backend: ['nodejs', 'express', 'django', 'sql', 'mongodb'],
      tools: ['docker', 'aws', 'ci/cd', 'testing']
    },
    'Data Science': {
      essential: ['python', 'statistics', 'sql', 'data analysis'],
      ml: ['machine learning', 'deep learning', 'tensorflow', 'pytorch'],
      analysis: ['pandas', 'numpy', 'scipy', 'matplotlib'],
      tools: ['jupyter', 'scikit-learn', 'tableau', 'power bi']
    },
    'Frontend Development': {
      essential: ['html', 'css', 'javascript', 'responsive design'],
      frameworks: ['react', 'vue', 'angular', 'svelte'],
      styling: ['sass', 'tailwind', 'bootstrap', 'material-ui'],
      tools: ['webpack', 'babel', 'typescript', 'testing']
    },
    'Backend Development': {
      essential: ['apis', 'databases', 'authentication', 'security'],
      languages: ['python', 'java', 'nodejs', 'golang'],
      databases: ['sql', 'mongodb', 'postgresql', 'redis'],
      tools: ['docker', 'kubernetes', 'nginx', 'aws']
    },
    'DevOps Engineering': {
      essential: ['linux', 'networking', 'security', 'scripting'],
      cloud: ['aws', 'azure', 'gcp', 'kubernetes'],
      ci_cd: ['jenkins', 'gitlab', 'github actions', 'travis'],
      monitoring: ['prometheus', 'grafana', 'elk stack', 'nagios']
    },
    'Mobile Development': {
      essential: ['mobile ui', 'apis', 'state management', 'testing'],
      android: ['kotlin', 'java', 'android sdk', 'jetpack'],
      ios: ['swift', 'objective-c', 'xcode', 'cocoa'],
      cross_platform: ['react native', 'flutter', 'ionic', 'xamarin']
    }
  };

  // Mock test data
  const mockTests = {
    'Technical': [
      { id: 1, name: 'Data Structures & Algorithms', duration: '60 mins', questions: 30 },
      { id: 2, name: 'Web Development', duration: '45 mins', questions: 25 },
      { id: 3, name: 'Database Management', duration: '30 mins', questions: 20 }
    ],
    'Aptitude': [
      { id: 4, name: 'Quantitative Aptitude', duration: '30 mins', questions: 25 },
      { id: 5, name: 'Logical Reasoning', duration: '30 mins', questions: 25 },
      { id: 6, name: 'Verbal Ability', duration: '30 mins', questions: 25 }
    ],
    'Domain': [
      { id: 7, name: 'Software Engineering', duration: '45 mins', questions: 30 },
      { id: 8, name: 'Data Science', duration: '45 mins', questions: 30 },
      { id: 9, name: 'Cloud Computing', duration: '45 mins', questions: 30 }
    ]
  };

  // Mock test questions for each test
  const mockTestQuestions = {
    1: [ // Data Structures & Algorithms
      {
        id: 1,
        question: "What is the time complexity of binary search?",
        options: [
          "O(n)",
          "O(log n)",
          "O(n log n)",
          "O(n²)"
        ],
        correctAnswer: 1 // index of the correct answer
      },
      {
        id: 2,
        question: "Which data structure follows the LIFO (Last In First Out) principle?",
        options: [
          "Queue",
          "Stack",
          "Linked List",
          "Array"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "What is the space complexity of quick sort?",
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n²)"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "Which sorting algorithm has the best average case performance?",
        options: [
          "Bubble Sort",
          "Insertion Sort",
          "Quick Sort",
          "Selection Sort"
        ],
        correctAnswer: 2
      },
      {
        id: 5,
        question: "What data structure is used to implement breadth-first search?",
        options: [
          "Stack",
          "Queue",
          "Array",
          "Linked List"
        ],
        correctAnswer: 1
      },
      {
        id: 6,
        question: "What is the worst-case time complexity of merge sort?",
        options: [
          "O(n)",
          "O(n log n)",
          "O(n²)",
          "O(2ⁿ)"
        ],
        correctAnswer: 1
      },
      {
        id: 7,
        question: "Which of the following is NOT a balanced binary search tree?",
        options: [
          "AVL Tree",
          "Red-Black Tree",
          "Binary Heap",
          "B-Tree"
        ],
        correctAnswer: 2
      },
      {
        id: 8,
        question: "What is the time complexity of accessing an element in a hash table?",
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n log n)"
        ],
        correctAnswer: 0
      },
      {
        id: 9,
        question: "What algorithm is typically used to find the shortest path in a weighted graph?",
        options: [
          "Depth-First Search",
          "Breadth-First Search",
          "Dijkstra's Algorithm",
          "Kruskal's Algorithm"
        ],
        correctAnswer: 2
      },
      {
        id: 10,
        question: "Which data structure is most suitable for implementing a priority queue?",
        options: [
          "Linked List",
          "Binary Heap",
          "Stack",
          "Queue"
        ],
        correctAnswer: 1
      }
    ],
    2: [ // Web Development
      {
        id: 1,
        question: "Which of the following is NOT a JavaScript framework?",
        options: [
          "React",
          "Angular",
          "Laravel",
          "Vue"
        ],
        correctAnswer: 2
      },
      {
        id: 2,
        question: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Colorful Style Sheets"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Which HTTP method is used to send data to a server to create/update a resource?",
        options: [
          "GET",
          "POST",
          "DELETE",
          "PUT"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "Which of the following is a client-side storage mechanism in web browsers?",
        options: [
          "MySQL",
          "MongoDB",
          "Local Storage",
          "PostgreSQL"
        ],
        correctAnswer: 2
      },
      {
        id: 5,
        question: "What is the correct HTML for creating a hyperlink?",
        options: [
          "<a href='http://example.com'>Example</a>",
          "<link>http://example.com</link>",
          "<hyperlink>http://example.com</hyperlink>",
          "<href>http://example.com</href>"
        ],
        correctAnswer: 0
      },
      {
        id: 6,
        question: "Which of these is NOT a valid CSS selector?",
        options: [
          ".class-name",
          "#id-name",
          "*element-name",
          ":hover"
        ],
        correctAnswer: 2
      },
      {
        id: 7,
        question: "What does API stand for in web development?",
        options: [
          "Application Programming Interface",
          "Application Protocol Interface",
          "Advanced Programming Interface",
          "Application Process Integration"
        ],
        correctAnswer: 0
      },
      {
        id: 8,
        question: "Which of the following is used to make a responsive web design?",
        options: [
          "JavaScript",
          "Media Queries",
          "PHP",
          "Java"
        ],
        correctAnswer: 1
      },
      {
        id: 9,
        question: "What is the purpose of a JWT (JSON Web Token) in web applications?",
        options: [
          "To enhance webpage styling",
          "To track user behavior",
          "For user authentication and information exchange",
          "To improve website loading speed"
        ],
        correctAnswer: 2
      },
      {
        id: 10,
        question: "Which of the following is a front-end build tool?",
        options: [
          "Node.js",
          "Express.js",
          "Webpack",
          "MongoDB"
        ],
        correctAnswer: 2
      }
    ],
    3: [ // Database Management
      {
        id: 1,
        question: "Which of the following is NOT a type of SQL join?",
        options: [
          "INNER JOIN",
          "LEFT JOIN",
          "CROSS JOIN",
          "MERGE JOIN"
        ],
        correctAnswer: 3
      },
      {
        id: 2,
        question: "What does ACID stand for in database transactions?",
        options: [
          "Atomicity, Consistency, Isolation, Durability",
          "Atomicity, Closure, Isolation, Durability",
          "Aggregation, Consistency, Isolation, Dependency",
          "Association, Closure, Isolation, Durability"
        ],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Which database model uses tables with rows and columns?",
        options: [
          "NoSQL",
          "Hierarchical",
          "Network",
          "Relational"
        ],
        correctAnswer: 3
      },
      {
        id: 4,
        question: "Which of the following is a NoSQL database?",
        options: [
          "MySQL",
          "Oracle",
          "MongoDB",
          "PostgreSQL"
        ],
        correctAnswer: 2
      },
      {
        id: 5,
        question: "What is a foreign key?",
        options: [
          "A key that can open any database",
          "A key from a different database altogether",
          "A field that uniquely identifies each record in a table",
          "A field in a table that links to the primary key in another table"
        ],
        correctAnswer: 3
      },
      {
        id: 6,
        question: "Which normalization form eliminates transitive dependencies?",
        options: [
          "First Normal Form (1NF)",
          "Second Normal Form (2NF)",
          "Third Normal Form (3NF)",
          "Fourth Normal Form (4NF)"
        ],
        correctAnswer: 2
      },
      {
        id: 7,
        question: "What SQL command is used to remove a table from a database?",
        options: [
          "DELETE TABLE",
          "REMOVE TABLE",
          "DROP TABLE",
          "TRUNCATE TABLE"
        ],
        correctAnswer: 2
      },
      {
        id: 8,
        question: "What is an index in a database?",
        options: [
          "A constraint that enforces unique values",
          "A data structure that improves the speed of data retrieval operations",
          "A primary key for a table",
          "A type of database join"
        ],
        correctAnswer: 1
      },
      {
        id: 9,
        question: "Which of these is NOT a common database constraint?",
        options: [
          "PRIMARY KEY",
          "FOREIGN KEY",
          "UNIQUE",
          "MAXIMUM"
        ],
        correctAnswer: 3
      },
      {
        id: 10,
        question: "In a database, what does the acronym DDL stand for?",
        options: [
          "Data Definition Language",
          "Database Definition Logic",
          "Data Development Language",
          "Database Design Level"
        ],
        correctAnswer: 0
      }
    ],
    4: [ // Quantitative Aptitude
      {
        id: 1,
        question: "If 8 men can complete a work in 20 days, then how many days will 10 men take to complete the same work?",
        options: [
          "16 days",
          "22 days",
          "25 days",
          "18 days"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "A train passes a 150m long platform in 15 seconds, while it passes a signal post in 10 seconds. What is the length of the train?",
        options: [
          "100m",
          "150m",
          "200m",
          "300m"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "The average of five consecutive numbers is 30. What is the largest of these numbers?",
        options: [
          "32",
          "28",
          "30",
          "34"
        ],
        correctAnswer: 0
      },
      {
        id: 4,
        question: "If the simple interest on a sum for 2 years at 5% per annum is Rs. 50, then the sum is:",
        options: [
          "Rs. 500",
          "Rs. 400",
          "Rs. 600",
          "Rs. 450"
        ],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "A shopkeeper marks his goods 20% above cost price and gives a discount of 10%. His profit percentage is:",
        options: [
          "8%",
          "10%",
          "12%",
          "15%"
        ],
        correctAnswer: 0
      },
      {
        id: 6,
        question: "If x² + y² = 25 and xy = 12, what is the value of (x + y)²?",
        options: [
          "25",
          "49",
          "36",
          "24"
        ],
        correctAnswer: 1
      },
      {
        id: 7,
        question: "A boat can travel 30 km upstream in 6 hours and 30 km downstream in 3 hours. What is the speed of the boat in still water?",
        options: [
          "7.5 km/h",
          "10 km/h",
          "12.5 km/h",
          "15 km/h"
        ],
        correctAnswer: 1
      },
      {
        id: 8,
        question: "The compound interest on a sum of money for 2 years at 10% per annum is Rs. 2,100. The simple interest for the same period and rate will be:",
        options: [
          "Rs. 1,900",
          "Rs. 2,000",
          "Rs. 2,050",
          "Rs. 2,100"
        ],
        correctAnswer: 1
      },
      {
        id: 9,
        question: "The ratio of the ages of two persons is 5:7. After 8 years, this ratio will be 7:9. What is the sum of their present ages?",
        options: [
          "36 years",
          "48 years",
          "60 years",
          "72 years"
        ],
        correctAnswer: 2
      },
      {
        id: 10,
        question: "A can complete a work in 12 days and B can complete the same work in 15 days. If they work together, in how many days will they complete the work?",
        options: [
          "6⅔ days",
          "7½ days",
          "6⅓ days",
          "8½ days"
        ],
        correctAnswer: 0
      }
    ],
    5: [ // Logical Reasoning
      {
        id: 1,
        question: "In a row of students, Rahul is 7th from the left and Amit is 12th from the right. If they interchange their positions, Rahul becomes 22nd from the left. How many students are there in the row?",
        options: [
          "33",
          "34",
          "35",
          "36"
        ],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "If 'FRIEND' is coded as 'GSJFOE', how is 'CANDLE' coded?",
        options: [
          "DBOEMF",
          "EDRFOH",
          "DEQJGH",
          "DCQIPF"
        ],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Complete the series: 3, 6, 11, 18, 27, __",
        options: [
          "36",
          "38",
          "40",
          "42"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "Choose the odd one out.",
        options: [
          "Mercury",
          "Mars",
          "Moon",
          "Venus"
        ],
        correctAnswer: 2
      },
      {
        id: 5,
        question: "If South-East becomes North, North-East becomes West, then North-West becomes?",
        options: [
          "South-West",
          "South",
          "South-East",
          "North-East"
        ],
        correctAnswer: 2
      },
      {
        id: 6,
        question: "Pointing to a photograph, a woman said, 'This man's son is my son's father.' How is the woman related to the man in the photograph?",
        options: [
          "Mother",
          "Grandmother",
          "Daughter-in-law",
          "Daughter"
        ],
        correctAnswer: 2
      },
      {
        id: 7,
        question: "A is taller than B, C is taller than A, D is taller than E but shorter than B. Who is the tallest?",
        options: [
          "A",
          "B",
          "C",
          "D"
        ],
        correctAnswer: 2
      },
      {
        id: 8,
        question: "Find the missing letter in the series: A, D, G, J, __",
        options: [
          "K",
          "L",
          "M",
          "N"
        ],
        correctAnswer: 2
      },
      {
        id: 9,
        question: "If CAT is coded as 24 and DOG is coded as 26, then how would you code MOUSE?",
        options: [
          "60",
          "63",
          "65",
          "70"
        ],
        correctAnswer: 1
      },
      {
        id: 10,
        question: "In a certain code, 'DESKTOP' is written as 'EDKSTPO'. How is 'KEYBOARD' written in that code?",
        options: [
          "EYKDRAOB",
          "EKABYDOR",
          "EYKABDOR",
          "EKYABDOR"
        ],
        correctAnswer: 0
      }
    ],
    6: [ // Verbal Ability
      {
        id: 1,
        question: "Choose the word that is most nearly opposite in meaning to 'FRUGAL'.",
        options: [
          "Careful",
          "Cautious",
          "Extravagant",
          "Economical"
        ],
        correctAnswer: 2
      },
      {
        id: 2,
        question: "Choose the word that is most nearly the same in meaning to 'AMELIORATE'.",
        options: [
          "Improve",
          "Worsen",
          "Destroy",
          "Maintain"
        ],
        correctAnswer: 0
      },
      {
        id: 3,
        question: "Choose the correct spelling:",
        options: [
          "Supercede",
          "Supersede",
          "Supresede",
          "Superside"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "Choose the correct meaning of the idiom: 'To let the cat out of the bag'",
        options: [
          "To punish someone",
          "To reveal a secret",
          "To create confusion",
          "To do something impossible"
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "Choose the appropriate preposition: 'He was accused ____ theft.'",
        options: [
          "of",
          "for",
          "with",
          "by"
        ],
        correctAnswer: 0
      },
      {
        id: 6,
        question: "Choose the correctly punctuated sentence:",
        options: [
          "Hurray! We won the match.",
          "Hurray, we won the match!",
          "Hurray, we won the match.",
          "Hurray we won the match!"
        ],
        correctAnswer: 0
      },
      {
        id: 7,
        question: "Choose the sentence with the correct subject-verb agreement:",
        options: [
          "The committee are divided on this issue.",
          "The committee is divided on this issue.",
          "The committee were divided on this issue.",
          "The committee have divided on this issue."
        ],
        correctAnswer: 1
      },
      {
        id: 8,
        question: "Identify the part of speech of the underlined word: 'She sings beautifully.'",
        options: [
          "Adjective",
          "Verb",
          "Adverb",
          "Noun"
        ],
        correctAnswer: 2
      },
      {
        id: 9,
        question: "What is a palindrome?",
        options: [
          "A word that has the same meaning as another word",
          "A word that reads the same backward as forward",
          "A word that sounds the same but has a different spelling",
          "A word with multiple meanings"
        ],
        correctAnswer: 1
      },
      {
        id: 10,
        question: "Choose the sentence that has NO error:",
        options: [
          "Neither of the students have completed their assignments.",
          "Neither of the students has completed their assignments.",
          "Neither of the students have completed his assignment.",
          "Neither of the students has completed his assignment."
        ],
        correctAnswer: 3
      }
    ],
    7: [ // Software Engineering
      {
        id: 1,
        question: "Which of the following is NOT an Agile software development methodology?",
        options: [
          "Scrum",
          "Kanban",
          "Waterfall",
          "Extreme Programming (XP)"
        ],
        correctAnswer: 2
      },
      {
        id: 2,
        question: "What is the primary goal of Continuous Integration (CI)?",
        options: [
          "Automating software delivery to production",
          "Identifying and fixing integration problems early",
          "Ensuring code quality through automated tests",
          "Managing dependencies between software components"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Which of the following is NOT a SOLID principle in object-oriented design?",
        options: [
          "Single Responsibility Principle",
          "Open/Closed Principle",
          "Modular Design Principle",
          "Dependency Inversion Principle"
        ],
        correctAnswer: 2
      },
      {
        id: 4,
        question: "What does TDD stand for in software development?",
        options: [
          "Technical Design Document",
          "Test-Driven Development",
          "Type Definition Diagram",
          "Total Defect Detection"
        ],
        correctAnswer: 1
      },
      {
        id: 5,
        question: "Which of the following is a type of software testing that verifies individual units or components of a software?",
        options: [
          "Integration Testing",
          "System Testing",
          "Acceptance Testing",
          "Unit Testing"
        ],
        correctAnswer: 3
      },
      {
        id: 6,
        question: "Which diagram is best suited for modeling the static structure of a system in UML?",
        options: [
          "Sequence Diagram",
          "Class Diagram",
          "Use Case Diagram",
          "Activity Diagram"
        ],
        correctAnswer: 1
      },
      {
        id: 7,
        question: "What is the purpose of a design pattern in software engineering?",
        options: [
          "To ensure backward compatibility",
          "To provide reusable solutions to common problems",
          "To enforce coding standards",
          "To eliminate the need for testing"
        ],
        correctAnswer: 1
      },
      {
        id: 8,
        question: "Which of the following is NOT a type of software design pattern?",
        options: [
          "Creational",
          "Structural",
          "Behavioral",
          "Functional"
        ],
        correctAnswer: 3
      },
      {
        id: 9,
        question: "What is technical debt in software development?",
        options: [
          "The financial cost of software development",
          "Extra work arising from choosing an easy solution now instead of better approach",
          "The time required to learn new technologies",
          "The cost of maintaining legacy systems"
        ],
        correctAnswer: 1
      },
      {
        id: 10,
        question: "Which software development model emphasizes risk analysis and is suitable for large and complex projects?",
        options: [
          "Waterfall",
          "Agile",
          "Spiral",
          "RAD (Rapid Application Development)"
        ],
        correctAnswer: 2
      }
    ],
    8: [ // Data Science
      {
        id: 1,
        question: "Which of the following is NOT a supervised learning algorithm?",
        options: [
          "Linear Regression",
          "K-means Clustering",
          "Support Vector Machines",
          "Random Forests"
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: "What is the primary purpose of feature scaling in machine learning?",
        options: [
          "To reduce the number of features",
          "To normalize features to a similar range",
          "To increase model complexity",
          "To eliminate irrelevant features"
        ],
        correctAnswer: 1
      },
      {
        id: 3,
        question: "Which metric is most appropriate for evaluating a classification model with highly imbalanced classes?",
        options: [
          "Accuracy",
          "Precision-Recall curve",
          "Mean Squared Error",
          "R-squared"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "What is the curse of dimensionality in data science?",
        options: [
          "The difficulty in visualizing high-dimensional data",
          "The exponential increase in data volume as dimensions increase",
          "The computational complexity of algorithms in high dimensions",
          "All of the above"
        ],
        correctAnswer: 3
      },
      {
        id: 5,
        question: "Which technique is used to prevent overfitting in machine learning models?",
        options: [
          "Hyperparameter tuning",
          "Feature engineering",
          "Regularization",
          "All of the above"
        ],
        correctAnswer: 3
      },
      {
        id: 6,
        question: "What is the main purpose of the Confusion Matrix in machine learning?",
        options: [
          "To visualize data distributions",
          "To measure model accuracy",
          "To evaluate classification model performance",
          "To identify multicollinearity in features"
        ],
        correctAnswer: 2
      },
      {
        id: 7,
        question: "Which algorithm is best suited for anomaly detection?",
        options: [
          "Linear Regression",
          "Decision Trees",
          "Isolation Forest",
          "Naive Bayes"
        ],
        correctAnswer: 2
      },
      {
        id: 8,
        question: "What does PCA (Principal Component Analysis) primarily accomplish?",
        options: [
          "Feature extraction and dimensionality reduction",
          "Classification of data points",
          "Time series forecasting",
          "Natural language processing"
        ],
        correctAnswer: 0
      },
      {
        id: 9,
        question: "Which of the following is NOT a common activation function in neural networks?",
        options: [
          "ReLU",
          "Sigmoid",
          "Tanh",
          "Gaussian"
        ],
        correctAnswer: 3
      },
      {
        id: 10,
        question: "What is the primary difference between bagging and boosting in ensemble learning?",
        options: [
          "Bagging trains models sequentially, boosting trains them in parallel",
          "Bagging trains models in parallel, boosting trains them sequentially",
          "Bagging uses weighted data samples, boosting doesn't",
          "Bagging is supervised, boosting is unsupervised"
        ],
        correctAnswer: 1
      }
    ],
    9: [ // Cloud Computing
      {
        id: 1,
        question: "Which of the following is NOT a major cloud service model?",
        options: [
          "Infrastructure as a Service (IaaS)",
          "Platform as a Service (PaaS)",
          "Software as a Service (SaaS)",
          "Hardware as a Service (HaaS)"
        ],
        correctAnswer: 3
      },
      {
        id: 2,
        question: "What is the main advantage of using a microservices architecture in cloud applications?",
        options: [
          "Simplified deployment procedures",
          "Reduced need for testing",
          "Independent scaling of services",
          "Lower network latency"
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Which AWS service provides object storage with high durability and availability?",
        options: [
          "Amazon EC2",
          "Amazon S3",
          "Amazon RDS",
          "Amazon DynamoDB"
        ],
        correctAnswer: 1
      },
      {
        id: 4,
        question: "What is the primary purpose of a load balancer in cloud computing?",
        options: [
          "To distribute incoming network traffic across multiple servers",
          "To optimize database query performance",
          "To cache static content for faster delivery",
          "To provision and manage virtual machines"
        ],
        correctAnswer: 0
      },
      {
        id: 5,
        question: "Which of the following is NOT a characteristic of cloud computing according to NIST?",
        options: [
          "On-demand self-service",
          "Broad network access",
          "Physical hardware ownership",
          "Measured service"
        ],
        correctAnswer: 2
      },
      {
        id: 6,
        question: "What is Kubernetes primarily used for?",
        options: [
          "Virtualization of operating systems",
          "Container orchestration and management",
          "Database management",
          "Networking and security"
        ],
        correctAnswer: 1
      },
      {
        id: 7,
        question: "Which cloud deployment model provides services exclusively for a single organization?",
        options: [
          "Public Cloud",
          "Private Cloud",
          "Hybrid Cloud",
          "Community Cloud"
        ],
        correctAnswer: 1
      },
      {
        id: 8,
        question: "What does 'serverless computing' mean in the context of cloud services?",
        options: [
          "Computing without any servers",
          "Computing where server management is handled by the provider",
          "Computing with dedicated physical servers",
          "Computing that doesn't require internet connection"
        ],
        correctAnswer: 1
      },
      {
        id: 9,
        question: "Which of these is a key benefit of auto-scaling in cloud environments?",
        options: [
          "Reduced security vulnerabilities",
          "Cost optimization by adjusting resources to match demand",
          "Improved database performance",
          "Enhanced user interface"
        ],
        correctAnswer: 1
      },
      {
        id: 10,
        question: "Which concept refers to running an application in multiple cloud environments to prevent vendor lock-in?",
        options: [
          "Cloud bursting",
          "Multi-cloud strategy",
          "Cloud federation",
          "Hybrid networking"
        ],
        correctAnswer: 1
      }
    ]
  };

  const analyzeResumeForAllFields = async (text, sections) => {
    const fieldAnalyses = {};
    const scores = {};

    // Analyze resume for each field
    for (const field of availableFields) {
      const fieldSkills = fieldSkillsMap[field];
      const allFieldSkills = new Set([
        ...fieldSkills.essential,
        ...Object.values(fieldSkills).flat()
      ]);

      // Find skills for this field
      const detectedSkills = new Set();
      for (const [sectionName, sectionText] of Object.entries(sections || {})) {
        if (sectionText) {
          const sectionSkills = findSkillsInContext(sectionText, allFieldSkills);
          sectionSkills.forEach(skill => detectedSkills.add(skill));
        }
      }

      // Calculate field-specific scores
      const analysis = {
        field,
        skills: Array.from(detectedSkills),
        categories: {},
        missingEssential: fieldSkills.essential.filter(skill => !detectedSkills.has(skill))
      };

      // Calculate category scores
      for (const [category, skills] of Object.entries(fieldSkills)) {
        const categorySkills = new Set(skills);
        const detected = Array.from(detectedSkills).filter(skill => categorySkills.has(skill));
        
        analysis.categories[category] = {
          detected,
          missing: skills.filter(skill => !detectedSkills.has(skill)),
          score: (detected.length / skills.length) * 100
        };
      }

      // Calculate overall field score
      const essentialWeight = 0.4;
      const otherCategoriesWeight = 0.6 / (Object.keys(fieldSkills).length - 1);
      
      const fieldScore = (
        (analysis.categories.essential.score * essentialWeight) +
        Object.entries(analysis.categories)
          .filter(([category]) => category !== 'essential')
          .reduce((sum, [_, data]) => sum + (data.score * otherCategoriesWeight), 0)
      );

      fieldAnalyses[field] = analysis;
      scores[field] = fieldScore;
    }

    setAllFieldAnalysis(fieldAnalyses);
    setFieldScores(scores);

    // Set initial selected field to the one with highest score
    const bestField = Object.entries(scores).sort(([,a], [,b]) => b - a)[0][0];
    
    setSelectedField(bestField);
    
    return { fieldAnalyses, scores };
  };

  const handleFieldChange = (newField) => {
    setSelectedField(newField);
    if (allFieldAnalysis[newField]) {
      setResumeAnalysis(allFieldAnalysis[newField]);
      searchJobsForField(newField, allFieldAnalysis[newField].skills);
    }
  };

  const searchJobsForField = async (field, skills) => {
    try {
      setIsSearching(true);
      setSearchError('');
      
      // First try to search with detected skills
      let { data, error } = await searchJobs(Array.from(skills || []).join(', '));
      
      if (error) throw error;

      // If no results with skills, get all companies
      if (!data || data.length === 0) {
        ({ data, error } = await searchJobs(''));
        if (error) throw error;
      }

      if (!data) {
        setMatchedCompanies([]);
        return;
      }

      // Rank jobs based on field relevance and skill match
      const rankedJobs = data.map(job => {
        // Calculate field relevance (higher weight for matching industry)
        const fieldRelevance = job.industry?.toLowerCase().includes(field.toLowerCase()) ? 1.5 : 1.0;
        
        // Calculate skill match score
        const jobSkills = new Set((job.job_requirements || '').toLowerCase().split(',').map(s => s.trim()));
        const matchedSkills = Array.from(skills || []).filter(skill => 
          Array.from(jobSkills).some(jobSkill => jobSkill.includes(skill.toLowerCase()))
        );
        
        // Calculate final score (combine existing matchScore with field relevance)
        const matchScore = (job.matchScore || 0) * fieldRelevance;
        
        return {
          ...job,
          matchScore,
          matchedSkills,
          fieldRelevant: fieldRelevance > 1
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      setMatchedCompanies(rankedJobs);
    } catch (error) {
      console.error('Error searching jobs:', error);
      setSearchError('Failed to search for jobs');
      setMatchedCompanies([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setResume(file);
      setResumeAnalysis(null);
      setMatchedCompanies([]);
      setIsAnalyzing(true);
      
      validatePDFFile(file);
      const { fullText, sections } = await extractTextFromPDF(file);
      
      if (!fullText || fullText.trim().length === 0) {
        throw new Error('No text could be extracted from the PDF. Please ensure the PDF contains selectable text.');
      }
      
      setResumeText(fullText);
      
      // Analyze for all fields
      const { fieldAnalyses, scores } = await analyzeResumeForAllFields(fullText, sections);
      
      // Get the best matching field
      const bestField = Object.entries(scores).sort(([,a], [,b]) => b - a)[0][0];
      
      // Set analysis for best field
      setResumeAnalysis(fieldAnalyses[bestField]);
      
      // Search jobs based on best field
      await searchJobsForField(bestField, fieldAnalyses[bestField].skills);
      
    } catch (error) {
      console.error('Error in resume upload process:', error);
      alert(error.message || 'Failed to process resume. Please ensure the PDF contains selectable text and try again.');
      setResume(null);
      setResumeText('');
      setResumeAnalysis(null);
      setMatchedCompanies([]);
      setFieldScores({});
      setAllFieldAnalysis({});
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCustomizeResume = (company) => {
    setSelectedCompany(company);
    setOpenCustomizeDialog(true);
  };

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setOpenTestDialog(true);
    setActiveQuestion(0);
    setSelectedAnswers({});
    setTestCompleted(false);
    setTestScore(0);
  };

  const startTest = () => {
    if (!selectedTest || !mockTestQuestions[selectedTest.id]) {
      setNotification({
        open: true,
        message: 'This test is not available yet.',
        severity: 'warning'
      });
      setOpenTestDialog(false);
      return;
    }
    
    setTestInProgress(true);
    setOpenTestDialog(false);
    setTestStartTime(new Date());
    setShowAnswers({}); // Reset show answers state
    
    // Calculate time remaining in seconds
    const [durationValue, unit] = selectedTest.duration.split(' ');
    let totalSeconds = parseInt(durationValue) * 60; // Convert minutes to seconds
    setTimeRemaining(totalSeconds);
    
    // Start countdown timer
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          completeTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };
  
  const toggleShowAnswer = (questionIndex) => {
    // Only allow showing answers if the user has selected an answer for this question
    if (selectedAnswers[questionIndex] !== undefined) {
      setShowAnswers(prev => ({
        ...prev,
        [questionIndex]: !prev[questionIndex]
      }));
    } else {
      setNotification({
        open: true,
        message: 'Please select an answer before viewing the correct answer',
        severity: 'warning'
      });
    }
  };
  
  const navigateQuestion = (direction) => {
    if (!selectedTest || !mockTestQuestions[selectedTest.id]) {
      return; // Exit early if no test is selected or no questions exist
    }
    
    if (direction === 'next' && activeQuestion < mockTestQuestions[selectedTest.id].length - 1) {
      setActiveQuestion(prev => prev + 1);
      // Reset show answer state for the new question if it hasn't been set yet
      if (showAnswers[activeQuestion + 1] === undefined) {
        setShowAnswers(prev => ({...prev, [activeQuestion + 1]: false}));
      }
    } else if (direction === 'prev' && activeQuestion > 0) {
      setActiveQuestion(prev => prev - 1);
      // Reset show answer state for the new question if it hasn't been set yet
      if (showAnswers[activeQuestion - 1] === undefined) {
        setShowAnswers(prev => ({...prev, [activeQuestion - 1]: false}));
      }
    }
  };
  
  const completeTest = () => {
    if (!selectedTest || !mockTestQuestions[selectedTest.id]) {
      setTestCompleted(true);
      setTestInProgress(false);
      return; // Exit early with default values
    }
    
    // Calculate score
    const questions = mockTestQuestions[selectedTest.id];
    let correctAnswers = 0;
    
    Object.entries(selectedAnswers).forEach(([questionIdx, selectedAnswer]) => {
      if (questions[questionIdx]?.correctAnswer === selectedAnswer) {
        correctAnswers++;
      }
    });
    
    const scorePercent = Math.round((correctAnswers / questions.length) * 100);
    setTestScore(scorePercent);
    setTestCompleted(true);
    setTestInProgress(false);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleUpdateSchema = async () => {
    try {
      setIsUpdatingSchema(true);
      const result = await updateJobApplicationsSchema();
      
      if (result.success) {
        setNotification({
          open: true,
          message: 'Database schema updated successfully. Try applying again.',
          severity: 'success'
        });
        setIsSchemaUpdateNeeded(false);
      } else {
        setNotification({
          open: true,
          message: 'Failed to update database schema. Please contact administrator.',
          severity: 'error'
        });
        console.error('Schema update failed:', result.error);
      }
    } catch (error) {
      console.error('Schema update error:', error);
      setNotification({
        open: true,
        message: 'Error updating database schema',
        severity: 'error'
      });
    } finally {
      setIsUpdatingSchema(false);
    }
  };

  // Add this function for profile update
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData({
      ...profileFormData,
      [name]: value
    });
  };

  const handleSkillAdd = () => {
    if (!profileFormData.newSkill || profileFormData.newSkill.trim() === '') return;
    
    const updatedSkills = profileFormData.skills ? [...profileFormData.skills] : [];
    updatedSkills.push(profileFormData.newSkill.trim());
    
    setProfileFormData({
      ...profileFormData,
      skills: updatedSkills,
      newSkill: ''
    });
  };

  const handleSkillRemove = (skillToRemove) => {
    const updatedSkills = profileFormData.skills.filter(skill => skill !== skillToRemove);
    setProfileFormData({
      ...profileFormData,
      skills: updatedSkills
    });
  };

  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileFormData.full_name || profileFormData.full_name.trim() === '') {
      errors.full_name = 'Full name is required';
    }
    
    if (!profileFormData.email || profileFormData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileFormData.email)) {
      errors.email = 'Email format is invalid';
    }
    
    if (!profileFormData.department || profileFormData.department.trim() === '') {
      errors.department = 'Department is required';
    }
    
    if (!profileFormData.year_of_study) {
      errors.year_of_study = 'Year of study is required';
    }
    
    if (profileFormData.cgpa && (isNaN(profileFormData.cgpa) || profileFormData.cgpa < 0 || profileFormData.cgpa > 10)) {
      errors.cgpa = 'CGPA must be a number between 0 and 10';
    }
    
    if (!profileFormData.phone || profileFormData.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    }
    
    if (!profileFormData.skills || profileFormData.skills.length === 0) {
      errors.skills = 'At least one skill is required';
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async () => {
    if (!validateProfileForm()) {
      setNotification({
        open: true,
        message: 'Please correct the errors in the form',
        severity: 'error'
      });
      return;
    }
    
    try {
      setIsSubmittingProfile(true);
      
      // Submit to Supabase
      const { data, error } = await supabase
        .from('students')
        .update({
          full_name: profileFormData.full_name,
          email: profileFormData.email,
          department: profileFormData.department,
          year_of_study: profileFormData.year_of_study,
          cgpa: profileFormData.cgpa,
          phone: profileFormData.phone,
          skills: profileFormData.skills,
          profile_submitted: true // Explicitly set the profile_submitted flag
        })
        .eq('student_id', profile.student_id);
      
      if (error) throw error;
      
      // Update local profile state
      setProfile({
        ...profile,
        ...profileFormData,
        profile_submitted: true // Update the local state as well
      });
      
      setIsEditingProfile(false);
      setIsProfileValidated(true);
      
      setNotification({
        open: true,
        message: 'Profile updated successfully! You can now apply to matched companies.',
        severity: 'success'
      });
      
      // Switch to Job Matches tab if there are matched companies
      if (matchedCompanies.length > 0) {
        setActiveTab(0);
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: error.message || 'Error updating profile',
        severity: 'error'
      });
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // Add this effect to check if profile is complete when loaded
  useEffect(() => {
    if (profile) {
      setProfileFormData({
        student_id: profile.student_id,
        full_name: profile.full_name || '',
        email: profile.email || '',
        department: profile.department || '',
        year_of_study: profile.year_of_study || '',
        cgpa: profile.cgpa || '',
        phone: profile.phone || '',
        skills: profile.skills || [],
        newSkill: ''
      });
      
      // Check if profile is already complete
      if (profile.full_name && profile.email && profile.department && 
          profile.phone && profile.skills && profile.skills.length > 0) {
        setIsProfileValidated(true);
      }
    }
  }, [profile]);

  const handleApply = async (companyId, companyName) => {
    try {
      // Check if profile is complete using the validation flag first
      if (!isProfileValidated) {
        // Check actual profile data as a fallback
        const isProfileComplete = profile && profile.full_name && profile.email && 
                                profile.department && profile.phone && 
                                profile.skills && profile.skills.length > 0;
        
        if (!isProfileComplete) {
          setNotification({
            open: true,
            message: 'Please complete and submit your profile in the Profile tab before applying',
            severity: 'warning'
          });
          setActiveTab(2); // Switch to profile tab
          setIsEditingProfile(true); // Open the edit form automatically
          return;
        } else {
          // If profile is actually complete but flag wasn't set, set it now
          setIsProfileValidated(true);
          
          // Also update the profile_submitted flag in the database
          try {
            const { error } = await supabase
              .from('students')
              .update({ profile_submitted: true })
              .eq('student_id', profile.student_id);
              
            if (error) {
              console.error('Error setting profile_submitted flag:', error);
            } else {
              // Update local profile state
              setProfile({
                ...profile,
                profile_submitted: true
              });
            }
          } catch (updateError) {
            console.error('Exception setting profile_submitted flag:', updateError);
          }
        }
      }
      
      setIsSearching(true);
      
      // Check if already applied
      if (applicationStatuses[companyId]) {
        setNotification({
          open: true,
          message: `You have already applied to ${companyName}`,
          severity: 'info'
        });
        return;
      }
      
      const { success } = await applyToJob(companyId);
      
      // Update application status locally - store both ID and name
      const updatedStatuses = { ...applicationStatuses };
      updatedStatuses[companyId] = {
        status: 'pending',
        companyName: companyName // Store the company name along with the status
      };
      setApplicationStatuses(updatedStatuses);
      
      setNotification({
        open: true,
        message: `Successfully applied to ${companyName}!`,
        severity: 'success'
      });
      
      // Close dialog if open
      if (openCustomizeDialog) {
        setOpenCustomizeDialog(false);
      }
      
    } catch (error) {
      console.error('Error applying to job:', error);
      
      // Check if this is a schema error
      if (error.message && error.message.includes('column')) {
        setIsSchemaUpdateNeeded(true);
      }
      
      setNotification({
        open: true,
        message: error.message || 'Error applying to job',
        severity: 'error'
      });
    } finally {
      setIsSearching(false);
    }
  };

  const loadApplicationStatuses = async () => {
    try {
      if (!session) {
        console.log('No active session, cannot load application statuses');
        return;
      }
      
      console.log('Loading application statuses for current student');
      
      // Use the getStudentApplications function to get all applications in one go
      const applications = await getStudentApplications();
      console.log('Fetched applications:', applications);
      
      if (!applications || applications.length === 0) {
        console.log('No applications found for this student');
        return;
      }
      
      const statuses = {};
      applications.forEach(app => {
        if (app.companies && app.companies.id) {
          console.log(`Setting status for company ${app.companies.company_name} (${app.companies.id}): ${app.status}`);
          statuses[app.companies.id] = {
            status: app.status,
            companyName: app.companies.company_name // Store company name from the fetched data
          };
        } else {
          console.warn('Application missing company data:', app);
        }
      });
      
      console.log('Final application statuses:', statuses);
      setApplicationStatuses(statuses);
    } catch (error) {
      console.error('Error loading application statuses:', error);
      setNotification({
        open: true,
        message: 'Failed to load your application statuses',
        severity: 'error'
      });
    }
  };

  // Load application statuses when companies are loaded
  useEffect(() => {
    if (matchedCompanies.length > 0) {
      loadApplicationStatuses();
    }
  }, [matchedCompanies]);

  // Add this before the final return statement to conditionally render the schema update dialog
  if (isSchemaUpdateNeeded) {
    return (
      <Box sx={dashboardStyles.root}>
        <Paper sx={{ p: isMobile ? 2 : 4, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Database Update Required
          </Typography>
          <Typography variant="body1" paragraph>
            There seems to be an issue with the database schema. This can happen when the application is updated but the database hasn't been migrated yet.
          </Typography>
          <Typography variant="body1" paragraph>
            Click the button below to update the database schema. This will only take a moment.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateSchema}
            disabled={isUpdatingSchema}
            sx={{ mt: 2 }}
            fullWidth={isMobile}
          >
            {isUpdatingSchema ? 'Updating Schema...' : 'Update Database Schema'}
          </Button>
        </Paper>
      </Box>
    );
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      
      // Show notification
      setNotification({
        open: true,
        message: 'Successfully logged out',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setNotification({
        open: true,
        message: 'Error signing out',
        severity: 'error'
      });
    }
  };

  // Function to handle tab changes
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onMenuClick={handleLogout} title="Student Dashboard" />
      <Drawer
        // ... existing drawer code ...
      </Drawer>
      <Box
        component="main"
                              sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px', // Add margin top to account for the fixed navbar
        }}
      >
        {/* ... rest of the existing code ... */}
                            </Box>
    </Box>
  );
};

export default StudentDashboard;
