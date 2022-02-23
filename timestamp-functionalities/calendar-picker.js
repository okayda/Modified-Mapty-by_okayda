'use strict';

import { dataObj as queryName } from '../query_name.js';
import { objMethod } from './timestamp-share-methods.js';

const date = new Date();

const months = [
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
];

const selected_date_element = document.querySelector(queryName.dateText);
const mth_element = document.querySelector(queryName.monthText);
const days_element = document.querySelector(queryName.daysContainer);
const next_mth_element = document.querySelector(queryName.monthNextArrow);
const prev_mth_element = document.querySelector(queryName.monthPrevArrow);

let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

const alterSelected = function (selected, DOM) {
  if (selected === Number(DOM.textContent)) DOM.classList.add('selected');
  else DOM.classList.remove('selected');
};

const getDaysMonth = (month, year) => new Date(year, month, 0).getDate();

const populateDates = function () {
  days_element.innerHTML = '';

  let amount_days = getDaysMonth(month + 1, year);

  for (let i = 0; i < amount_days; i++) {
    let day_element = document.createElement('div');
    day_element.classList.add('day');
    day_element.textContent = i + 1;

    if (
      months[month] === months[date.getMonth()] &&
      year === date.getFullYear() &&
      day_element.textContent < day
    )
      day_element.classList.add('pass-date');

    if (
      selectedDay === i + 1 &&
      selectedYear === year &&
      selectedMonth === month
    ) {
      day_element.classList.add('selected');
    }

    day_element.addEventListener('click', e => {
      const days = days_element.querySelectorAll('.day');

      selectedDate = new Date(year + '-' + (month + 1) + '-' + (i + 1));
      selectedDay = i + 1;
      selectedMonth = month;
      selectedYear = year;

      if (
        months[month] === months[date.getMonth()] &&
        year === date.getFullYear()
      )
        for (let j = day - 1; j < amount_days; j++)
          alterSelected(selectedDay, days[j]);
      else
        for (let j = 0; j < amount_days; j++)
          alterSelected(selectedDay, days[j]);

      selected_date_element.textContent = objMethod.formatDate(selectedDate);
      selected_date_element.dataset.value = selectedDate;
    });

    days_element.appendChild(day_element);
  }
};

const goToNextMonth = function (e) {
  document.querySelector('.prev-mth').classList.remove('notShowArrow');
  ++month;
  if (month > 11) {
    month = 0;
    ++year;
  }
  mth_element.textContent = `${months[month]} ${year}`;
  populateDates();
};

const goToPrevMonth = function () {
  --month;
  if (month < 0) {
    month = 11;
    --year;
  }

  mth_element.textContent = `${months[month]} ${year}`;
  populateDates();

  if (new Date().getMonth() === month && year === new Date().getFullYear()) {
    document
      .querySelector(queryName.monthPrevArrow)
      .classList.add('notShowArrow');
    return;
  }
};

export const init_calendar = function () {
  mth_element.textContent = `${months[month]} ${year}`;
  selected_date_element.textContent = objMethod.formatDate(date);
  populateDates();
  next_mth_element.addEventListener('click', goToNextMonth);
  prev_mth_element.addEventListener('click', goToPrevMonth);
};
