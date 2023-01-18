import { isToday } from 'date-fns';
import { ICalendar } from '../lib/Calendar';

type Props = {
  calendar: ICalendar;
};

const Calendar = ({ calendar }: Props) => (
  <div>
    <h1>Calendar</h1>
    <h4>{calendar.currentYear}</h4>
    <h4>{calendar.currentMonth}</h4>
    <button onClick={calendar?.setPreviousMonth}>Previous month</button>
    <button onClick={calendar?.setNextMonth}>Next month</button>
    {calendar.month.map((week, index) => {
      return (
        <div key={index}>
          {week.map((day, j) => (
            <span
              key={j}
              style={{
                width: 100,
                height: 100,
                padding: 10,
                fontSize: 16,
                border: '1px white solid',
                display: 'inline-block',
                backgroundColor: isToday(day) ? 'gray' : 'black',
              }}
            >
              {day.getDate()}
            </span>
          ))}
        </div>
      );
    })}
  </div>
);

export default Calendar;
