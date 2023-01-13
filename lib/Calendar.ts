import { addDays, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek, addMonths } from 'date-fns';
import { Subscriber, SubscriberCollection, Subscription } from './SubscriberCollection';

export type ICalendar = {
  month: Date[][];
  currentMonth: String;
  currentYear: String;
  setNextMonth: () => void;
  setPreviousMonth: () => void;
  subscribeToUpdates: (subscriber: Subscriber<ICalendar>) => Subscription;
};

type IWeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export enum WeekDay {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

const NUMBER_DAYS_IN_WEEK = 7;
const DEFAULT_WEEK_START_DAY = WeekDay.MONDAY;
const DEFAULT_LOCALE_CODE = 'es-es';

export class Calendar implements ICalendar {
  month: Date[][] = [];
  currentMonth!: String;
  currentYear!: String;

  private weekStartsOn: IWeekStartsOn;
  private locale: Locale;
  private currentDate!: Date;
  private startMonthDate!: Date;
  private endMonthDate!: Date;
  private endCalendarDate!: Date;
  private subscribers = new SubscriberCollection<ICalendar>();

  constructor(
    date: Date = new Date(),
    weekStartsOn: IWeekStartsOn = DEFAULT_WEEK_START_DAY,
    locale: Locale = { code: DEFAULT_LOCALE_CODE }
  ) {
    this.weekStartsOn = weekStartsOn;
    this.locale = locale;
    this.updateCurrentDate(date);
  }

  private updateCurrentDate = (date: Date) => {
    this.currentDate = date;
    this.currentMonth = date.toLocaleDateString(this.locale.code, { month: 'long' });
    this.currentYear = date.toLocaleDateString(this.locale.code, { year: 'numeric' });
    this.startMonthDate = startOfDay(startOfMonth(date));
    this.endMonthDate = startOfDay(endOfMonth(date));
    this.endCalendarDate = startOfDay(
      endOfWeek(this.endMonthDate, { weekStartsOn: this.weekStartsOn, locale: this.locale })
    );
    this.month = this.takeMonth();
    this.notifySubscribers();
  };

  public setNextMonth = () => {
    const nextMonth = addMonths(this.currentDate, 1);
    this.updateCurrentDate(nextMonth);
  };

  public setPreviousMonth = () => {
    const previousMonth = addMonths(this.currentDate, -1);
    this.updateCurrentDate(previousMonth);
  };

  private takeWeek = (startDate: Date = this.currentDate) => {
    let date = startOfWeek(startOfDay(startDate), { weekStartsOn: this.weekStartsOn, locale: this.locale });
    return () => {
      const week = [...Array(NUMBER_DAYS_IN_WEEK)].map((_, index) => addDays(date, index));
      date = addDays(week[6], 1);
      return week;
    };
  };

  public takeMonth = () => {
    let month: Date[][] = [];

    const lastDayOfRange = (range: Date[][]) => {
      return range[range.length - 1][6];
    };

    const weekGenerate = this.takeWeek(this.startMonthDate);
    month.push(weekGenerate());

    while (lastDayOfRange(month) < this.endCalendarDate) {
      month.push(weekGenerate());
    }

    return month;
  };

  subscribeToUpdates(subscriber: Subscriber<ICalendar>): Subscription {
    return this.subscribers.subscribe(subscriber);
  }

  private notifySubscribers(): void {
    this.subscribers.notify(this);
  }
}
