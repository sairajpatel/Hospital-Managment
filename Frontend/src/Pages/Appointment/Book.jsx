import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import axios from 'axios';

function Book() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/patient/doctorschedule`,
          { withCredentials: true }
        );
        setSchedules(res.data.schedules || []);
      } catch (err) {
        console.error('Error fetching schedules', err);
      }
    };

    fetchSchedules();
  }, []); // run once on mount

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {schedules.map((item) => (
        <div className="p-4" key={item._id}>
          <Card sx={{ maxWidth: 250 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image="https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icon_617655-48.jpg"
                alt="doctor"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {/* show doctor name */}
                  {item.doctor?.firstname}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Available slots: {item.availableSlots?.length || 0} days
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary">
                Book Appointment
              </Button>
            </CardActions>
          </Card>
        </div>
      ))}
    </div>
  );
}

export default Book;
