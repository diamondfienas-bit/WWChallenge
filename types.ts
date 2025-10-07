
export interface WeeklyData {
  week: number;
  weight: number | string;
  height: number | string;
  bmi: number | null;
  bodyFatPercentage: number | string;
  muscleMass: number | string;
  bodyFatMass: number | string;
}

export interface Participant {
  id: number;
  name: string;
  weeklyData: WeeklyData[];
}
