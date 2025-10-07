import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { ResetIcon } from './icons/ResetIcon';
import { SaveIcon } from './icons/SaveIcon';
import { CancelIcon } from './icons/CancelIcon';

interface HeaderProps {
  onReset: () => void;
  onSave: () => void;
  onDiscard: () => void;
  isDirty: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onSave, onDiscard, isDirty }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-8 w-8 text-lime-500" />
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Wellness Warrior <span className="text-lime-500">Challenge</span>
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {isDirty && (
                <>
                    <button
                        onClick={onDiscard}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                        aria-label="Discard changes"
                    >
                        <CancelIcon className="h-5 w-5" />
                        <span>Discard</span>
                    </button>
                    <button
                        onClick={onSave}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-lime-500 rounded-lg hover:bg-lime-600 transition-colors duration-200"
                        aria-label="Save changes"
                    >
                        <SaveIcon className="h-5 w-5" />
                        <span>Save Changes</span>
                    </button>
                </>
            )}
            <button
                onClick={onReset}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                aria-label="Reset all data"
            >
                <ResetIcon className="h-4 w-4" />
                <span>Reset All</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
