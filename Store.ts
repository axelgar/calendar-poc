import React, { useContext } from 'react';
import { Calendar, ICalendar } from './lib/Calendar';

class Store {
  calendar: ICalendar;

  constructor() {
    this.calendar = new Calendar();
  }
}

export const defaultStore = new Store();

export const StoreContext = React.createContext(defaultStore);

export const useCalendarStore = () => {
  const { calendar } = useContext(StoreContext);
  return calendar;
};
