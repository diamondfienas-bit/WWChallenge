
import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
      clipRule="evenodd"
    />
    <path
      d="M12 2.25c.32 0 .633.027.94.08C11.96 4.45 11.25 6.85 11.25 9.375c0 2.526.71 4.926 1.81 7.046a9.712 9.712 0 01-1.81.129c-5.385 0-9.75-4.365-9.75-9.75S6.615 2.25 12 2.25z"
      opacity="0.5"
    />
  </svg>
);
