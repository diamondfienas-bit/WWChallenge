import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { WeekCalendar } from './components/CalendarSelector';
import { ParticipantTable } from './components/ParticipantTable';
import { Motivation } from './components/Motivation';
import { WEEK_COUNT, PARTICIPANT_COUNT, START_DATE } from './constants';
import type { Participant, WeeklyData } from './types';

const generateInitialData = (): Participant[] => {
  const participants: Participant[] = [];
  for (let i = 1; i <= PARTICIPANT_COUNT; i++) {
    const weeklyData: WeeklyData[] = [];
    for (let j = 0; j < WEEK_COUNT; j++) {
      weeklyData.push({
        week: j + 1,
        weight: '',
        height: '',
        bmi: null,
        bodyFatPercentage: '',
        muscleMass: '',
        bodyFatMass: '',
      });
    }
    participants.push({
      id: i,
      name: `WWC${i}`,
      weeklyData,
    });
  }
  return participants;
};

const calculateBMI = (weightKg: number, heightCm: number): number | null => {
  if (weightKg > 0 && heightCm > 0) {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    return parseFloat(bmi.toFixed(2));
  }
  return null;
};

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>(generateInitialData());
  const [draftParticipants, setDraftParticipants] = useState<Participant[] | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const isDirty = useMemo(() => {
    if (!draftParticipants) return false;
    return JSON.stringify(participants) !== JSON.stringify(draftParticipants);
  }, [participants, draftParticipants]);

  const handleDataChange = useCallback((participantId: number, field: keyof Omit<WeeklyData, 'week' | 'bmi'>, value: string) => {
    setDraftParticipants(prevDraft => {
        const sourceData = prevDraft || participants;
        const newDraft = JSON.parse(JSON.stringify(sourceData));

        const participant = newDraft.find((p: Participant) => p.id === participantId);
        if (!participant) return newDraft;

        if (field === 'height' && value) {
            participant.weeklyData.forEach((weekData: WeeklyData) => {
                weekData.height = value;
                const weightNum = parseFloat(weekData.weight as string);
                const heightNum = parseFloat(weekData.height as string);
                weekData.bmi = calculateBMI(weightNum, heightNum);
            });
        } else {
            const weekIndex = selectedWeek - 1;
            const weekData = participant.weeklyData[weekIndex];
            if (weekData) {
                (weekData as any)[field] = value;
                if (field === 'weight') {
                    const weightNum = parseFloat(weekData.weight as string);
                    const heightNum = parseFloat(weekData.height as string);
                    weekData.bmi = calculateBMI(weightNum, heightNum);
                }
            }
        }
        return newDraft;
    });
  }, [selectedWeek, participants]);

  const handleSave = useCallback(() => {
    if (draftParticipants) {
      setParticipants(draftParticipants);
      setDraftParticipants(null);
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 2500);
    }
  }, [draftParticipants]);

  const handleDiscard = useCallback(() => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
        setDraftParticipants(null);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      setParticipants(generateInitialData());
      setDraftParticipants(null);
      setSelectedWeek(1);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased">
       {showSaveConfirmation && (
          <div className="fixed top-20 right-8 bg-lime-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-transform transform-gpu animate-pulse">
            Changes saved successfully!
          </div>
        )}
      <Header onReset={handleReset} onSave={handleSave} onDiscard={handleDiscard} isDirty={isDirty} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg h-min">
                 <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Challenge Calendar</h2>
                 <p className="text-gray-500 mb-6">Select a week to view and edit data.</p>
                 <WeekCalendar
                    weekCount={WEEK_COUNT}
                    selectedWeek={selectedWeek}
                    onSelectWeek={setSelectedWeek}
                    startDate={START_DATE}
                 />
                 <div className="mt-8 pt-8 border-t border-gray-200">
                    <Motivation />
                 </div>
            </div>
            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Weekly Progress: Week {selectedWeek}</h2>
                    <p className="text-gray-500 mb-6">Enter data for the selected week. Click "Save Changes" in the header to commit.</p>
                    <div className="mt-2">
                        <ParticipantTable
                        participants={draftParticipants || participants}
                        selectedWeek={selectedWeek}
                        onDataChange={handleDataChange}
                        />
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;