import React, { useState, useEffect } from 'react';
import type { Participant, WeeklyData } from '../types';
import { ChartIcon } from './icons/ChartIcon';
import { ProgressChart } from './ProgressChart';

interface ParticipantTableProps {
  participants: Participant[];
  selectedWeek: number;
  onDataChange: (participantId: number, field: keyof Omit<WeeklyData, 'week' | 'bmi'>, value: string) => void;
}

const TableInput: React.FC<{
    value: string | number;
    onChange: (value: string) => void;
    placeholder: string;
}> = ({ value: propValue, onChange: onParentChange, placeholder }) => {
    const [localValue, setLocalValue] = useState(String(propValue));
    const [isInvalid, setIsInvalid] = useState(false);

    useEffect(() => {
        // This effect syncs the local state with the parent's prop value.
        // It's crucial for resetting the input when data is saved, discarded, or the week is changed.
        setLocalValue(String(propValue));
        setIsInvalid(false);
    }, [propValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        const num = Number(newValue);
        const isValid = newValue === '' || (!isNaN(num) && num >= 0);

        if (isValid) {
            setIsInvalid(false);
            onParentChange(newValue);
        } else {
            setIsInvalid(true);
            // Don't call parent's onChange, preventing state update with invalid data.
        }
    };
    
    const handleBlur = () => {
        // If the user clicks away from an invalid input, revert it to the last valid value.
        if(isInvalid) {
            setLocalValue(String(propValue));
            setIsInvalid(false);
        }
    };

    const invalidClasses = isInvalid
      ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-200 focus:ring-2 focus:ring-lime-400 focus:border-lime-400';

    return (
        <input
            type="number"
            className={`w-full px-2 py-1.5 bg-gray-50 border rounded-md focus:bg-white transition ${invalidClasses}`}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            aria-invalid={isInvalid}
            title={isInvalid ? 'Please enter a non-negative number.' : ''}
        />
    );
};


export const ParticipantTable: React.FC<ParticipantTableProps> = ({ participants, selectedWeek, onDataChange }) => {
  const [expandedParticipantId, setExpandedParticipantId] = useState<number | null>(null);

  const handleToggleChart = (participantId: number) => {
    setExpandedParticipantId(prevId => (prevId === participantId ? null : participantId));
  };

  const headers = [
    'Weight (kg)',
    'Height (cm)',
    'BMI',
    'Body Fat (%)',
    'Muscle Mass (kg)',
    'Body Fat Mass (kg)'
  ];
  
  const numColumns = headers.length + 2;

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-5">
          <tr>
            <th scope="col" className="px-6 py-3 sticky left-0 bg-gray-100 z-10 w-40">
              Participant
            </th>
            {headers.map(header => (
                <th key={header} scope="col" className="px-6 py-3 min-w-[150px]">
                    {header}
                </th>
            ))}
            <th scope="col" className="px-6 py-3 text-center min-w-[100px]">
                Progress
            </th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => {
            const data = participant.weeklyData[selectedWeek - 1];
            if (!data) return null;

            const isExpanded = expandedParticipantId === participant.id;

            return (
              <React.Fragment key={participant.id}>
                <tr className="bg-white border-b hover:bg-lime-50/50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap sticky left-0 bg-white z-5 w-40 border-r">
                    {participant.name}
                  </th>
                  <td className="px-6 py-4">
                    <TableInput
                      value={data.weight}
                      onChange={(value) => onDataChange(participant.id, 'weight', value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <TableInput
                      value={data.height}
                      onChange={(value) => onDataChange(participant.id, 'height', value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full px-2 py-1.5 bg-gray-200 text-gray-700 font-semibold border border-gray-300 rounded-md text-center">
                      {data.bmi || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TableInput
                      value={data.bodyFatPercentage}
                      onChange={(value) => onDataChange(participant.id, 'bodyFatPercentage', value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <TableInput
                      value={data.muscleMass}
                      onChange={(value) => onDataChange(participant.id, 'muscleMass', value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <TableInput
                      value={data.bodyFatMass}
                      onChange={(value) => onDataChange(participant.id, 'bodyFatMass', value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleChart(participant.id)}
                      className={`p-2 rounded-full transition-colors duration-200 ${isExpanded ? 'bg-lime-200 text-lime-700' : 'text-gray-500 hover:bg-lime-100 hover:text-lime-600'}`}
                      aria-label={`Show progress chart for ${participant.name}`}
                      aria-expanded={isExpanded}
                    >
                      <ChartIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="bg-white border-b">
                    <td colSpan={numColumns} className="p-0">
                      <ProgressChart data={participant.weeklyData} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};