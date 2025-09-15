import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import axios from 'axios';
import Navbar from '../Patient/Navbar';

function Book() {
  const [schedules, setSchedules] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

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
  }, []);

  // find selected doctor’s schedule
  const selectedSchedule = schedules.find(
    (s) => s.doctor?._id === selectedDoctorId
  );

  return (
    <div className=" h-screen bg-gray-50">
      <Navbar/>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                    {item.doctor?.firstname}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Available on {item.availableSlots?.length || 0} days
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => setSelectedDoctorId(item.doctor?._id)}
                >
                  View Slots
                </Button>
              </CardActions>
            </Card>
          </div>
        ))}
      </div>

      {/* show slots if a doctor selected */}
      {selectedSchedule && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Slots for {selectedSchedule.doctor?.firstname}
          </h2>
          {selectedSchedule.availableSlots?.map((dayBlock) => (
            <div key={dayBlock._id} className="mb-4">
              <h3 className="font-semibold">{dayBlock.day}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {dayBlock.slots.map((time, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 rounded-full text-sm"
                  >
                    <Button>{time}</Button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Book;
