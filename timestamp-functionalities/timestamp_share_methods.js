'use strict';
import { document_selector_name as queryName } from '../query_name.js';

export const objMethod = {
  formatDate(d) {
    let day = d.getDate();

    if (day < 10) day = '0' + day;

    let month = d.getMonth() + 1;
    if (month < 10) month = '0' + month;
    1;

    let year = d.getFullYear();

    return `${month} / ${day} / ${year}`;
  },

  getMeridiem() {
    const time = new Date();
    return time
      .toLocaleString('en-US', { hour: 'numeric', hour12: true })
      .split(' ')[1];
  },

  setMeridiem() {
    document.querySelector(queryName.meridiem).textContent = this.getMeridiem();
    document
      .querySelector(`.btn-${this.getMeridiem()}`)
      .classList.add('active-meridiem');
  },
};
