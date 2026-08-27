import { useState, useEffect } from "react";

const CalendarApp = () => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const eventColors = [
    '#FF2E93',
    '#5c0303',
    '#FFD000',
    '#10B981',
    '#25655d',
    '#00BFFF',
    '#8B5CF6',
    '#EC4899',
    '#F43F5E'
  ];
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectDate, setSelectedDate] = useState(currentDate);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventTime, setEventTime] = useState({ hours: "00", minutes: "00" });
  const [eventText, setEventText] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventColor, setEventColor] = useState("#00a3ff");
  const [intervalStudy, setIntervalStudy] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        const data = await response.json();

        // Перетворюємо дані з бази для React
        const formattedEvents = data.map((ev) => ({
          ...ev,
          id: ev._id, // MongoDB автоматично створює поле _id
          date: new Date(ev.date), // Перетворюємо рядок на об'єкт Date
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Помилка завантаження подій:", error);
      }
    };

    fetchEvents();
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const getDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const firstDayOfMonth = getDayOfWeek === 0 ? 6 : getDayOfWeek - 1;

  const hasEventOnDay = (day) => {
    return events.some(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear
    );
  };

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  };
  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? prevYear + 1 : prevYear
    );
  };
  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);

    setSelectedDate(clickedDate);
    setShowEventPopup(true);
    setEventTime({ hours: "00", minutes: "00" });
    setEventText("");
    setEditingEvent(null);
  };
  const handleEventSubmit = async () => {
    const intervals = [0, 1, 3, 7, 14, 30, 60];
    if (!eventText.trim()) {
      alert("Будь ласка, введіть текст події!");
      return;
    }

    if (!eventTime.hours || !eventTime.minutes) {
      alert("Будь ласка, вкажіть коректний час!");
      return;
    }

    if (editingEvent) {
      const updatedEventData = {
        date: selectDate,
        time: `${eventTime.hours.padStart(2, "0")}:${eventTime.minutes.padStart(2, "0")}`,
        text: eventText,
        color: eventColor,
      };

      try {
        // Відправляємо оновлені дані на бекенд
        const response = await fetch(`http://localhost:5000/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEventData),
        });

        const savedUpdatedEvent = await response.json();

        // Форматуємо отриману з бази подію для React
        const formattedUpdatedEvent = {
          ...savedUpdatedEvent,
          id: savedUpdatedEvent._id,
          date: new Date(savedUpdatedEvent.date)
        };

        // Оновлюємо масив подій у стані
        const updatedEvents = events.map((event) =>
            event.id === editingEvent.id ? formattedUpdatedEvent : event
        );

        setEvents(updatedEvents);
      } catch (error) {
        console.error("Помилка при оновленні:", error);
      }
    } else {
      let newEvents = [];

      if (intervalStudy) {
        newEvents = intervals.map((days) => {
          const eventDate = new Date(selectDate);
          eventDate.setDate(eventDate.getDate() + days);
          return {
            date: eventDate,
            time: `${eventTime.hours.padStart(
              2,
              "0"
            )}:${eventTime.minutes.padStart(2, "0")}`,
            text: eventText,
            color: eventColor,
            intervalStudy: true,
          };
        });
      } else {
        newEvents = [
          {
            date: selectDate,
            time: `${eventTime.hours.padStart(
              2,
              "0"
            )}:${eventTime.minutes.padStart(2, "0")}`,
            text: eventText,
            color: eventColor,
            intervalStudy: false,
          },
        ];
      }

      try {
        const savedEventsPromises = newEvents.map(async (eventData) => {
          const response = await fetch("http://localhost:5000/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData),
          });
          return await response.json();
        });

        const savedEventsDB = await Promise.all(savedEventsPromises);

        const formattedSavedEvents = savedEventsDB.map((ev) => ({
          ...ev,
          id: ev._id,
          date: new Date(ev.date),
        }));

        const updatedEvents = [...events, ...formattedSavedEvents];
        updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(updatedEvents);
      } catch (error) {
        console.error("Помилка при збереженні в БД:", error);
      }
    }

    setEventTime({ hours: "00", minutes: "00" });
    setEventText("");
    setEventColor(eventColors[0]);
    setIntervalStudy(false);
    setShowEventPopup(false);
    setEditingEvent(null);
  };
  const handleEditEvent = (event) => {
    setSelectedDate(new Date(event.date));
    setEventTime({
      hours: event.time.split(":")[0],
      minutes: event.time.split(":")[1],
    });
    setEventText(event.text);
    setEditingEvent(event);
    setShowEventPopup(true);
    setEventColor(event.color);
  };
  const handleDeleteEvent = async (eventId) => {
    try {
      await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
      });

      const updatedEvents = events.filter((event) => event.id !== eventId);
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Помилка при видаленні:", error);
    }
  };
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setEventTime((prevTime) => ({
      ...prevTime,
      [name]: value.padStart(2, "0"),
    }));
  };

  return (
    <div className="calendar-app">
      <div className="calendar">
        <h1 className="heading">Calendar</h1>
        <div className="navigate-date">
          <h2 className="month">{monthOfYear[currentMonth]},</h2>
          <h2 className="year">{currentYear}</h2>
          <div className="buttons">
            <i className="bx bx-chevron-left" onClick={prevMonth}></i>
            <i className="bx bx-chevron-right" onClick={nextMonth}></i>
          </div>
        </div>
        <div className="weekdays">
          {daysOfWeek.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="days">
          {[...Array(firstDayOfMonth).keys()].map((_, index) => (
            <span key={`empty-${index}`} />
          ))}
          {[...Array(daysInMonth).keys()].map((day) => (
            <span
              key={day + 1}
              className={
                day + 1 === currentDate.getDate() &&
                currentMonth === currentDate.getMonth() &&
                currentYear === currentDate.getFullYear()
                  ? "current-day"
                  : hasEventOnDay(day + 1)
                  ? "event-day"
                  : ""
              }
              style={{
                backgroundColor: events.find(
                  (event) =>
                    event.date.getDate() === day + 1 &&
                    event.date.getMonth() === currentMonth &&
                    event.date.getFullYear() === currentYear
                )?.color,
              }}
              onClick={() => handleDayClick(day + 1)}
            >
              {day + 1}
            </span>
          ))}
        </div>
      </div>
      <div className="events">
        {showEventPopup && (
          <div className="event-popup">
            <div className="time-input">
              <div className="event-popup-time">Time</div>
              <input
                type="number"
                name="hours"
                min={0}
                max={24}
                className="hours"
                value={eventTime.hours}
                onChange={handleTimeChange}
              />
              <input
                type="number"
                name="minutes"
                min={0}
                max={60}
                className="minutes"
                value={eventTime.minutes}
                onChange={handleTimeChange}
              />
            </div>
            <div className="interval-study">
              <label>
                <input
                  type="checkbox"
                  checked={intervalStudy}
                  onChange={(e) => setIntervalStudy(e.target.checked)}
                />
              </label>
            </div>
            <textarea
              placeholder="Enter Event Text(Maximum 60 Characters)"
              value={eventText}
              onChange={(e) => {
                if (e.target.value.length <= 60) {
                  setEventText(e.target.value);
                }
              }}
            ></textarea>
            <div className="color-picker">
              <div className="color-options">
                {eventColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${
                      eventColor === color ? "selected" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setEventColor(color)}
                  />
                ))}
              </div>
            </div>
            <button className="event-popup-btn" onClick={handleEventSubmit}>
              {editingEvent ? "Update Event" : "Add Event"}
            </button>
            <button
              className="close-event-popup"
              onClick={() => setShowEventPopup(false)}
            >
              <i className="bx bx-x"></i>
            </button>
          </div>
        )}
        {events.map((event, index) => (
          <div
            className="event"
            key={index}
            style={{ backgroundColor: event.color }}
          >
            <div className="event-date-wrapper">
              <div className="event-date">{`${
                monthOfYear[event.date.getMonth()]
              }, ${event.date.getDate()}, ${event.date.getFullYear()}`}</div>
              <div className="event-time">{event.time}</div>
            </div>
            <div className="event-text">{event.text}</div>
            <div className="event-buttons">
              <i
                className="bx bxs-edit-alt"
                onClick={() => handleEditEvent(event)}
              ></i>
              <i
                className="bx bxs-message-alt-x"
                onClick={() => handleDeleteEvent(event.id)}
              ></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarApp;
