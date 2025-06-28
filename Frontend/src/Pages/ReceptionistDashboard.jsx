import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Avatar, AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const drawerWidth = 240;

const patients = [
  {
    id: 1,
    name: 'Chloe Harris',
    registrationDate: '2024-07-25',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Noah Foster',
    registrationDate: '2024-07-24',
    status: 'Pending',
  },
];

export default function ReceptionistDashboard() {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            HealthFirst Clinic - Receptionist Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Patients" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><CalendarMonthIcon /></ListItemIcon>
              <ListItemText primary="Appointments" />
            </ListItem>
            <ListItem button>
              <ListItemIcon><AssignmentTurnedInIcon /></ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Typography variant="h5" gutterBottom>
          Patient Requests
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {patients.map((patient) => (
            <Card key={patient.id} sx={{ width: 300 }}>
              <CardContent>
                <Typography variant="h6">{patient.name}</Typography>
                <Typography variant="body2">Date: {patient.registrationDate}</Typography>
                <Typography variant="body2">Status: {patient.status}</Typography>
                <Button variant="outlined" sx={{ mt: 1 }} onClick={() => handleSelectPatient(patient)}>Fill Details</Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {selectedPatient && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Complete Patient Details for {selectedPatient.name}</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, maxWidth: 400 }}>
              <TextField label="Date of Birth" placeholder="YYYY-MM-DD" fullWidth />
              <TextField label="Contact Number" placeholder="Enter contact number" fullWidth />
              <TextField label="Address" placeholder="Enter address" fullWidth />
              <Button variant="contained">Save Details</Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
