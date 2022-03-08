'use strict';

import { utilities } from './utilities.js';

export const app_data = {
  specificEvents: [],
  workouts: [],
  markers: [],
  map: null,

  timestamp_data: {
    day: utilities.date.getDate(),
    month: utilities.date.getMonth() + 1,
    year: utilities.date.getFullYear(),

    hour: '00',
    minutes: '00',
    meridiem: 'NN',

    reset_date_and_properties() {
      this.day = utilities.date.getDate();
      this.month = utilities.date.getMonth() + 1;
      this.year = utilities.date.getFullYear();

      this.hour = '00';
      this.minutes = '00';
      this.meridiem = 'NN';
    },
  },

  get_specificEvents_data() {
    return this.specificEvents;
  },

  get_workouts_data() {
    return this.workouts;
  },

  add_specificEvents_data(add) {
    this.specificEvents.push(...add);
  },

  add_workouts_data(add) {
    this.workouts.push(add);
  },

  reset_specificEvents_data() {
    this.specificEvents = [];
  },

  reset_workouts_data() {
    localStorage.removeItem('workouts');
    location.reload();
  },

  setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(app_data.workouts));
  },

  _remove_marker_and_info_data(el, i) {
    this.map.removeLayer(el);
    this.markers.splice(i, 1);
    this.workouts.splice(i, 1);
  },
};
