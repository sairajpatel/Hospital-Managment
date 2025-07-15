import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorSchedule = ({ onClose }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedSlots, setSelectedSlots] = useState([]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/doctor/schedule');
      if (response.data.doctorSlots) {
        setSchedule(response.data.doctorSlots.availableSlots || []);
        // Set initial selected slots for the first day
        const daySlots = response.data.doctorSlots.availableSlots.find(slot => slot.day === selectedDay);
        setSelectedSlots(daySlots?.slots || []);
      }
    } catch (err) {
      setError('Failed to fetch schedule');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDayChange = (day) => {
    setSelectedDay(day);
    const daySlots = schedule.find(slot => slot.day === day);
    setSelectedSlots(daySlots?.slots || []);
  };

  const handleSlotToggle = (slot) => {
    setSelectedSlots(prev => {
      if (prev.includes(slot)) {
        return prev.filter(s => s !== slot);
      } else {
        return [...prev, slot];
      }
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedSchedule = [...schedule];
      const dayIndex = updatedSchedule.findIndex(slot => slot.day === selectedDay);
      
      if (dayIndex !== -1) {
        updatedSchedule[dayIndex] = { day: selectedDay, slots: selectedSlots };
      } else {
        updatedSchedule.push({ day: selectedDay, slots: selectedSlots });
      }

      await axios.post('/api/doctor/doctorSchedule', {
        availableSlots: updatedSchedule
      });

      setSchedule(updatedSchedule);
      setError(null);
    } catch (err) {
      setError('Failed to save schedule');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg w-full max-w-4xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            {days.map(day => (
              <button
                key={day}
                onClick={() => handleDayChange(day)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {timeSlots.map(slot => (
              <button
                key={slot}
                onClick={() => handleSlotToggle(slot)}
                className={`p-2 rounded-lg text-sm ${
                  selectedSlots.includes(slot)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule; 