import React, { useState } from 'react';
import {
  TextField, Button, Typography, AppBar, Toolbar,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Grid,
  InputAdornment, IconButton, Paper, Avatar, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel, Select,
  MenuItem, FormHelperText
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { logout } from '../redux/slices/authSlice';

const drawerWidth = 280;

// Mock data - Replace with actual API calls
const mockPatients = [
  {
    id: 1,
    name: 'Chloe Harris',
    doctor: 'Dr. Smith',
    department: 'Cardiology',
    appointmentTime: '10:00 AM',
    contact: '+1 234-567-8900',
    status: 'Pending',
    avatar: 'CH',
    color: '#4CAF50' // Green color for the header
  },
  {
    id: 2,
    name: 'Noah Foster',
    doctor: 'Dr. Johnson',
    department: 'Neurology',
    appointmentTime: '11:30 AM',
    contact: '+1 234-567-8901',
    status: 'Confirmed',
    avatar: 'NF',
    color: '#FF5252' // Red gradient color
  },
  {
    id: 3,
    name: 'Emma Wilson',
    doctor: 'Dr. Davis',
    department: 'Orthopedics',
    appointmentTime: '2:30 PM',
    contact: '+1 234-567-8902',
    status: 'In Progress',
    avatar: 'EW',
    color: '#FF5252' // Red gradient color
  }
];

const todayAppointments = [
  { time: '09:00 AM', patient: 'John Doe', status: 'Completed', avatar: 'JD' },
  { time: '10:00 AM', patient: 'Chloe Harris', status: 'Waiting', avatar: 'CH' },
  { time: '11:30 AM', patient: 'Noah Foster', status: 'Scheduled', avatar: 'NF' }
];

const stats = [
  { title: 'Total Appointments', value: '45', color: '#3b82f6', icon: CalendarMonthIcon },
  { title: 'Pending Requests', value: '12', color: '#ef4444', icon: AssignmentTurnedInIcon },
  { title: "Today's Appointments", value: '8', color: '#22c55e', icon: AccessTimeIcon },
  { title: 'Registered Patients', value: '156', color: '#f59e0b', icon: PeopleIcon }
];

// Add this after the existing mock data
const departments = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Ophthalmology'
];

const doctors = {
  'Cardiology': ['Dr. Smith', 'Dr. Williams'],
  'Neurology': ['Dr. Johnson', 'Dr. Brown'],
  'Orthopedics': ['Dr. Davis', 'Dr. Miller'],
  'Pediatrics': ['Dr. Wilson', 'Dr. Moore'],
  'Dermatology': ['Dr. Taylor', 'Dr. Anderson'],
  'Ophthalmology': ['Dr. Thomas', 'Dr. Jackson']
};

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export default function ReceptionistDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState(mockPatients);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    doctor: '',
    appointmentTime: '',
    contact: '',
    status: '',
    notes: ''
  });

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(term.toLowerCase()) ||
      patient.contact.includes(term)
    );
    setPatients(filtered);
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Pending': { color: '#F4B400', bg: '#FFF8E1' },
      'Confirmed': { color: '#0F9D58', bg: '#E8F5E9' },
      'In Progress': { color: '#4285F4', bg: '#E3F2FD' }
    };
    return styles[status] || { color: '#757575', bg: '#F5F5F5' };
  };

  const getHeaderColor = (status) => {
    switch(status) {
      case 'Pending':
        return 'linear-gradient(90deg, #4CAF50 0%, #4CAF50 100%)';
      case 'Confirmed':
        return 'linear-gradient(90deg, #FF5252 0%, #FF7B31 100%)';
      case 'In Progress':
        return 'linear-gradient(90deg, #FF5252 0%, #FF7B31 100%)';
      default:
        return 'linear-gradient(90deg, #4CAF50 0%, #4CAF50 100%)';
    }
  };

  const getRandomGradient = () => {
    const gradients = [
      'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #f43f5e 0%, #f97316 100%)',
      'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const handleOpenDialog = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      department: patient.department,
      doctor: patient.doctor,
      appointmentTime: patient.appointmentTime,
      contact: patient.contact,
      status: patient.status,
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
    setFormErrors({});
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update doctor list when department changes
    if (name === 'department') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        doctor: '' // Reset doctor when department changes
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.doctor) errors.doctor = 'Doctor is required';
    if (!formData.appointmentTime) errors.appointmentTime = 'Appointment time is required';
    if (!formData.contact.trim()) errors.contact = 'Contact is required';
    if (!formData.status) errors.status = 'Status is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/receptionist/logout`, {
        withCredentials: true,
      });
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would typically make an API call to update the patient
      const updatedPatients = patients.map(p => 
        p.id === selectedPatient.id ? { ...p, ...formData } : p
      );
      setPatients(updatedPatients);
      handleCloseDialog();
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: 1201, 
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
        }}
      >
        <Toolbar>
          <Typography 
            variant="h5" 
            sx={{ 
              flexGrow: 1, 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600
            }}
          >
            HealthFirst Clinic
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#1e293b',
                  width: 32,
                  height: 32
                }}
              >
                S
              </Avatar>
              <Typography sx={{ color: '#1e293b', fontWeight: 500 }}>
                Sarah
              </Typography>
            </Box>
            <IconButton 
              sx={{ 
                bgcolor: '#f1f5f9',
                '&:hover': { bgcolor: '#e2e8f0' }
              }}
            >
              <LogoutIcon onClick={handleLogout} sx={{ color: '#64748b' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            borderRight: 'none'
          },
        }}
      >
        <Box sx={{ pt: 8, pb: 4, px: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', mb: 4 }}>
            Receptionist Dashboard
          </Typography>
          <List>
            {[
              { text: 'Dashboard', icon: DashboardIcon },
              { text: 'Patients', icon: PeopleIcon },
              { text: 'Appointments', icon: CalendarMonthIcon },
              { text: 'Reports', icon: AssignmentTurnedInIcon }
            ].map((item) => (
              <ListItem
                button
                key={item.text}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiListItemIcon-root': {
                      color: 'white'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#94a3b8', minWidth: 40, transition: 'color 0.2s' }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      fontSize: '0.95rem'
                    }
                  }} 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: `${drawerWidth}px` }}>
        <Toolbar />
        
        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3,
                  borderRadius: 4,
                  bgcolor: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box 
                    sx={{ 
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: stat.color,
                      mb: 2
                    }}
                  >
                    <stat.icon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Typography sx={{ color: '#64748b', mb: 1, fontSize: '0.875rem' }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#1e293b', fontWeight: 600 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '30%',
                    height: '100%',
                    background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                    borderLeft: `1px solid ${stat.color}10`
                  }} 
                />
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Today's Schedule */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 3 }}>
            Today's Schedule
          </Typography>
          <Grid container spacing={2}>
            {todayAppointments.map((apt, index) => {
              const statusStyle = getStatusStyle(apt.status);
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      bgcolor: 'white',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: getRandomGradient() }}>
                        {apt.avatar}
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: '#1e293b', fontWeight: 600 }}>
                          {apt.patient}
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                          {apt.time}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        color: statusStyle.color,
                        bgcolor: statusStyle.bg,
                        display: 'inline-block'
                      }}
                    >
                      {apt.status}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search patients by name or contact..."
            value={searchTerm}
            onChange={handleSearch}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'white',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                '& fieldset': {
                  borderColor: '#e2e8f0'
                },
                '&:hover fieldset': {
                  borderColor: '#cbd5e1'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6'
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            sx={{
              borderRadius: 3,
              px: 4,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -1px rgba(59, 130, 246, 0.1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
              }
            }}
          >
            Add Patient
          </Button>
        </Box>

        {/* Patient List */}
        <Box>
          <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600, mb: 3 }}>
            Recent Patient Requests
          </Typography>
          <Grid container spacing={2}>
            {patients.map((patient) => {
              const statusStyle = getStatusStyle(patient.status);
              return (
                <Grid item xs={12} sm={6} md={4} key={patient.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      bgcolor: 'white',
                      overflow: 'hidden',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Box sx={{ 
                      p: 2, 
                      background: getHeaderColor(patient.status),
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Avatar sx={{ bgcolor: 'white' }}>
                        <Typography sx={{ color: '#1e293b' }}>
                          {patient.avatar}
                        </Typography>
                      </Avatar>
                      <Typography sx={{ color: 'white', fontWeight: 500 }}>
                        {patient.name}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                            Doctor
                          </Typography>
                          <Typography sx={{ color: '#1e293b' }}>
                            {patient.doctor}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                            Department
                          </Typography>
                          <Typography sx={{ color: '#1e293b' }}>
                            {patient.department}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                            Appointment
                          </Typography>
                          <Typography sx={{ color: '#1e293b' }}>
                            {patient.appointmentTime}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                            Contact
                          </Typography>
                          <Typography sx={{ color: '#1e293b' }}>
                            {patient.contact}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                        <Typography
                          sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            fontSize: '0.875rem',
                            color: statusStyle.color,
                            bgcolor: statusStyle.bg,
                            display: 'inline-block'
                          }}
                        >
                          {patient.status}
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => handleOpenDialog(patient)}
                          sx={{
                            bgcolor: '#1976D2',
                            '&:hover': { bgcolor: '#1565C0' },
                            textTransform: 'uppercase',
                            px: 3,
                            py: 1,
                            borderRadius: 1
                          }}
                        >
                          MANAGE
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>

      {/* Add this Dialog component before the closing Box tag */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2
        }}>
          <Avatar sx={{ bgcolor: 'white' }}>
            <Typography sx={{ color: 'primary.main' }}>
              {selectedPatient?.name?.split(' ').map(n => n[0]).join('')}
            </Typography>
          </Avatar>
          <Typography variant="h6" component="div">
            Manage Patient Details
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  label="Department"
                >
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
                {formErrors.department && (
                  <FormHelperText>{formErrors.department}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.doctor}>
                <InputLabel>Doctor</InputLabel>
                <Select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleFormChange}
                  label="Doctor"
                  disabled={!formData.department}
                >
                  {formData.department && doctors[formData.department].map(doc => (
                    <MenuItem key={doc} value={doc}>{doc}</MenuItem>
                  ))}
                </Select>
                {formErrors.doctor && (
                  <FormHelperText>{formErrors.doctor}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.appointmentTime}>
                <InputLabel>Appointment Time</InputLabel>
                <Select
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleFormChange}
                  label="Appointment Time"
                >
                  {timeSlots.map(time => (
                    <MenuItem key={time} value={time}>{time}</MenuItem>
                  ))}
                </Select>
                {formErrors.appointmentTime && (
                  <FormHelperText>{formErrors.appointmentTime}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.status}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  label="Status"
                >
                  {['Pending', 'Confirmed', 'In Progress', 'Completed'].map(status => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
                {formErrors.status && (
                  <FormHelperText>{formErrors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contact"
                value={formData.contact}
                onChange={handleFormChange}
                error={!!formErrors.contact}
                helperText={formErrors.contact}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                multiline
                rows={4}
                placeholder="Add any additional notes about the patient..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
