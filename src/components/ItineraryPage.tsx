import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import Navbar from './Navbar';
import { DateTime, Interval } from 'luxon';
import './styles/ItineraryPage.css';
import ExpenditureTracker from './ExpenditureTracker';
import { saveAs } from 'file-saver';

interface Meeting {
  time: string;
  description: string;
}

interface Itinerary {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

const ItineraryPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Record<string, Meeting[]>>({});
  const location = useLocation();
  const itinerary = location.state as Itinerary;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      if (itinerary) {
        try {
          const { data, error } = await supabase
            .from('Plans')
            .select('*')
            .eq('itinerary_id', itinerary.id);

          if (error) {
            throw error;
          }

          const fetchedMeetings = data.reduce((acc: Record<string, Meeting[]>, meeting) => {
            const date = meeting.date;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push({ time: meeting.time, description: meeting.description });
            return acc;
          }, {});
          Object.keys(fetchedMeetings).forEach(date => {
            fetchedMeetings[date].sort((a, b) => a.time.localeCompare(b.time));
          });
          setMeetings(fetchedMeetings);
        } catch (error) {
          console.error('Error fetching meetings:', error);
        }
      }
    };

    fetchMeetings();
  }, [itinerary]);

  const daysInRange = Interval.fromDateTimes(
    DateTime.fromISO(itinerary.start_date),
    DateTime.fromISO(itinerary.end_date).plus({ days: 1 })
  )
    .splitBy({ day: 1 })
    .map((day) => day.start?.toISODate() || '');

  const handleEditClick = () => {
    const startMonth = new Date(itinerary.start_date).getMonth() + 1;
    const startYear = new Date(itinerary.start_date).getFullYear();
    navigate(`/CalendarHandler?month=${startMonth}&year=${startYear}`, {
      state: { 
        id: itinerary.id, 
        name: itinerary.name, 
        start_date: itinerary.start_date, 
        end_date: itinerary.end_date,
        startMonth: startMonth,
        startYear: startYear 
      }
    });
  };

  const handleEditExpenditure = () => {
    setIsModalOpen(true);
  };

  const handleDownloadItinerary = () => {
    const itineraryText = generateItineraryText();
    const blob = new Blob([itineraryText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${itinerary.name}-Itinerary.txt`);
  };

  const generateItineraryText = () => {
    let itineraryText = `Itinerary: ${itinerary.name}\n`;
    itineraryText += `Start Date: ${itinerary.start_date}\n`;
    itineraryText += `End Date: ${itinerary.end_date}\n\n`;

    daysInRange.forEach((date) => {
      const meetingsForDay = meetings[date];
      itineraryText += `${DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)}\n`;
      if (meetingsForDay?.length) {
        meetingsForDay.forEach((meeting) => {
          itineraryText += `  - ${meeting.time}: ${meeting.description}\n`;
        });
      } else {
        itineraryText += '  No activities planned.\n';
      }
      itineraryText += '\n';
    });

    return itineraryText;
  };

  return (
    <div>
      <Navbar />
      <div className="itinerary-page">
        <h1>{itinerary.name}</h1>
        <p>{itinerary.start_date} to {itinerary.end_date}</p>
        <div className="meetings-list">
          {daysInRange.map((date) => (
            <div key={date} className="day-meetings">
              <h2>{DateTime.fromISO(date).toLocaleString(DateTime.DATE_FULL)}</h2>
              <ul>
                {meetings[date]?.length ? (
                  meetings[date].map((meeting, index) => (
                    <li key={index}>
                      {meeting.time} - {meeting.description}
                    </li>
                  ))
                ) : (
                  <li>No activities planned.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
        <button onClick={handleEditClick} className="edit-itinerary-button">
          Edit Itinerary
        </button>
        <div>
          <button onClick={handleEditExpenditure} className="edit-expenses-button">
            View/Add Expenses
          </button>
        </div>
        <div>
          <button onClick={handleDownloadItinerary} className="download-itinerary-button">
            Download Itinerary
          </button>
        </div>
      </div>
      <ExpenditureTracker isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} itineraryid={itinerary.id} />
    </div>
  );
};

export default ItineraryPage;
  