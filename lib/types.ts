export interface Player {
  id: string;
  number?: number; // Jersey number (optional)
  name: string;
  studentId: string; // Student ID (hidden but searchable)
  period?: string; // Class period (optional, e.g., "Period 1", "Period 2", "Period 5")
  grade: string;
  position: string;
  height: string;
  weight: string;
  equipment: Equipment;
}

export interface Equipment {
  jersey: {
    red: boolean;
    black: boolean;
    white: boolean;
    sophomoreRed: boolean;
  };
  pants: {
    red: boolean;
    black: boolean;
    white: boolean;
  };
  helmet: boolean;
  guardian: boolean;
  shoulder: boolean;
  girdle: boolean;
  knee: boolean;
  practicePants: boolean;
  belt: boolean;
  winInTheDark: boolean;
  customItems: string[]; // Custom equipment items that were returned
  neverReceived: string[]; // Items the player never received
}

export const defaultEquipment: Equipment = {
  jersey: { red: false, black: false, white: false, sophomoreRed: false },
  pants: { red: false, black: false, white: false },
  helmet: false,
  guardian: false,
  shoulder: false,
  girdle: false,
  knee: false,
  practicePants: false,
  belt: false,
  winInTheDark: false,
  customItems: [],
  neverReceived: [],
};

