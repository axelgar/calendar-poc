import { useEffect, useState } from 'react';
import { ICalendar } from '../lib/Calendar';
import { useCalendarStore } from '../Store';

export const useCalendar = () => {
  const calendar = useCalendarStore();
  const [state, setState] = useState(calendar);

  useEffect(() => {
    return calendar.subscribeToUpdates((updatedCalendar: ICalendar): void => {
      setState({ ...updatedCalendar });
    });
  }, [calendar]);

  return state;
};
