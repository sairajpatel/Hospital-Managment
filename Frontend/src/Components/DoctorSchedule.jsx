import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns'

const DoctorSchedule = ({ onClose }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDay, setSelectedDay] = useState('monday');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlots, setSelectedSlots] = useState([]);

  const days = [
    'monday', 'tuesday', 'wednesday',
    'thursday', 'friday', 'saturday', 'sunday'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  useEffect(() => {
    fetchSchedule();
  }, []);
const getDayFromDate = (dateStr) => {
  const date = parseISO(dateStr);
  const dayName = format(date, 'eeee').toLowerCase(); // returns "monday", "tuesday", etc.
  return dayName;
};
const fetchSchedule = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/doctor/schedule`, { withCredentials: true });
    if (response.data.doctorSlots) {
      const slots = response.data.doctorSlots.availableSlots || [];
      setSchedule(slots);

      // Pick first available slot with a date
      const firstWithDate = slots.find(s => s.date) || slots[0];
      const date = firstWithDate?.date ? firstWithDate.date.split('T')[0] : '';
      const day = date ? getDayFromDate(date) : firstWithDate?.day || 'monday';

      setSelectedDate(date);
      setSelectedDay(day);
      setSelectedSlots(firstWithDate?.slots || []);
    }
  } catch (err) {
    setError('Failed to fetch schedule');
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const handleDateChange = (e) => {
  const date = e.target.value;
  const day = getDayFromDate(date);
  setSelectedDate(date);
  setSelectedDay(day);

  const daySlots = schedule.find(slot => slot.day === day && slot.date === date);
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
    if (!selectedDate) {
      setError('Please pick a date before saving');
      return;
    }

    try {
      setLoading(true);
      const updatedSchedule = [...schedule];
      const dayIndex = updatedSchedule.findIndex(slot => slot.day === selectedDay);

      if (dayIndex !== -1) {
        updatedSchedule[dayIndex] = {
          day: selectedDay,
          date: selectedDate,
          slots: selectedSlots
        };
      } else {
        updatedSchedule.push({
          day: selectedDay,
          date: selectedDate,
          slots: selectedSlots
        });
      }

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/doctor/doctorSchedule`,
        { availableSlots: updatedSchedule },
        { withCredentials: true }
      );

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

        {/* Day Buttons */}
      

        {/* Date Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
          </label>
         <input
  type="date"
  value={selectedDate}
  onChange={handleDateChange}  // <-- updated
  className="border rounded-lg px-3 py-2 w-full"
/>
        </div>

        {/* Slots */}
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

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6">
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
