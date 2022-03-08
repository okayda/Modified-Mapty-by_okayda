'use strict';

export const utilities = {
  date: new Date(),

  my_icon(exerciseType) {
    return L.icon({
      iconUrl: `${
        exerciseType ? 'workout-icons/running.png' : 'workout-icons/cycling.png'
      }`,
      iconSize: [55, 55],
    });
  },

  popup_options: {
    maxWidth: 400,
    minWidth: 100,
    autoClose: false,
    offset: [3, -20],
    closeOnClick: false,
    closeButton: false,
  },

  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};
