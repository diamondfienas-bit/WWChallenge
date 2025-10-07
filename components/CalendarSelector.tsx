import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface WeekCalendarProps {
  weekCount: number;
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
  startDate: string;
}

const areDatesSameDay = (d1: Date, d2: Date): boolean =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

export const WeekCalendar: React.FC<WeekCalendarProps> = ({ weekCount, selectedWeek, onSelectWeek, startDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date(startDate));

  const challengeWeeks = useMemo(() => {
    const weeks: { week: number; start: Date; end: Date }[] = [];
    let weekStartDate = new Date(startDate);
    weekStartDate.setHours(0, 0, 0, 0);

    for (let i = 1; i <= weekCount; i++) {
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);
      weeks.push({ week: i, start: new Date(weekStartDate), end: new Date(weekEndDate) });
      weekStartDate.setDate(weekStartDate.getDate() + 7);
    }
    return weeks;
  }, [startDate, weekCount]);

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(1);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const getWeekForDate = (date: Date): number | null => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    for (const week of challengeWeeks) {
      if (checkDate >= week.start && checkDate <= week.end) {
        return week.week;
      }
    }
    return null;
  };
  
  const handleDayClick = (date: Date) => {
    const week = getWeekForDate(date);
    if (week) {
      onSelectWeek(week);
    }
  };

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDateForCalendar = new Date(monthStart);
  startDateForCalendar.setDate(startDateForCalendar.getDate() - monthStart.getDay());
  
  const days: Date[] = [];
  let day = new Date(startDateForCalendar);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between px-2 py-2">
        <h3 className="font-bold text-gray-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex items-center space-x-1">
          <button onClick={() => changeMonth(-1)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5" /></button>
          <button onClick={() => changeMonth(1)} className="p-1 rounded-full text-gray-500 hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-semibold border-b pb-2">
        {dayNames.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((d, index) => {
          const weekNumber = getWeekForDate(d);
          const isChallengeDay = weekNumber !== null;
          const isSelectedWeek = weekNumber === selectedWeek;
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();

          let dayClasses = "flex items-center justify-center h-9 w-9 rounded-full transition-colors duration-200 text-sm ";
          
          dayClasses += isCurrentMonth ? 'text-gray-700 ' : 'text-gray-300 ';
          if (isChallengeDay) dayClasses += 'cursor-pointer ';
          
          if (isSelectedWeek) {
            dayClasses += 'bg-lime-500 text-white font-bold shadow ';
          } else if(isChallengeDay) {
            dayClasses += 'bg-lime-100 text-lime-800 hover:bg-lime-200 ';
          }
          
          if(areDatesSameDay(d, new Date()) && !isSelectedWeek){
              dayClasses += 'ring-2 ring-lime-400 ';
          }

          return (
            <div key={index} className="flex justify-center items-center">
                <button
                    onClick={() => handleDayClick(d)}
                    disabled={!isChallengeDay}
                    className={dayClasses}
                >
                    {d.getDate()}
                </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
