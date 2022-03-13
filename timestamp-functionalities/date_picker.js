'use strict';

import { app_data } from '../app_data.js';

import { utilities } from '../utilities.js';

const current_month = utilities.date.getMonth() + 1;
const current_day = utilities.date.getDate();
const current_year = utilities.date.getFullYear();

let month = utilities.date.getMonth();
let year = utilities.date.getFullYear();

const user_Date_clicked = {
  day: current_day,
  month: month + 1,
  year: year,
};

const days_container = document.querySelector('.days');
const back_arrow = document.querySelector('.arrow-back');
const fore_arrow = document.querySelector('.arrow-fore');

const calendar_text = document.querySelector('.selected-date');
calendar_text.textContent = `${month + 1} / ${current_day} / ${year}`;

const month_text = document.querySelector('.mth');
month_text.textContent = `${utilities.months[month]} ${year}`;

document.querySelector('.prev-mth').style.visibility = 'hidden';

const get_days_month = (year, month) => new Date(year, month, 0).getDate();

const create_days_element = function (year, month) {
  month += 1;

  for (let i = 1; i <= get_days_month(year, month); i++) {
    if (i < current_day && month === current_month && year === current_year) {
      days_container.insertAdjacentHTML(
        'beforeend',
        `<p class="day pass-date">${i}</p>`
      );
    } else if (
      i === user_Date_clicked.day &&
      month === user_Date_clicked.month &&
      year === user_Date_clicked.year
    ) {
      days_container.insertAdjacentHTML(
        'beforeend',
        `<p class="day selected">${i}</p>`
      );
    } else {
      days_container.insertAdjacentHTML('beforeend', `<p class="day">${i}</p>`);
    }
  }
};

const remove_and_create_days = function (year, month) {
  document.querySelectorAll('.day').forEach(el => el.remove());
  create_days_element(year, month);
  month_text.textContent = `${utilities.months[month]} ${year}`;
};

const event_delegation = function (e) {
  const target = e.target;

  if (target.className === 'day') {
    document.querySelectorAll('.day')[user_Date_clicked.day - 1].className =
      'day';
    const data = app_data.timestamp_data;
    const day_selected = +e.target.textContent;

    target.className = 'day selected';
    data.day = user_Date_clicked.day = day_selected;
    data.month = user_Date_clicked.month = month + 1;
    data.year = user_Date_clicked.year = year;

    calendar_text.textContent = `${month + 1} / ${day_selected} / ${year}`;
  }
};

const back_handler_arrow = function () {
  if (current_month === month && current_year === year)
    document.querySelector('.prev-mth').style.visibility = 'hidden';

  month -= 1;
  if (month === -1) {
    month = 11;
    year -= 1;
  }

  remove_and_create_days(year, month);
};

const fore_handler_arrow = function () {
  document.querySelector('.prev-mth').style.visibility = 'visible';

  month += 1;
  if (month === 12) {
    month = 0;
    year += 1;
  }

  remove_and_create_days(year, month);
};

export const init_calendar = function () {
  days_container.addEventListener('click', event_delegation);
  back_arrow.addEventListener('click', back_handler_arrow);
  fore_arrow.addEventListener('click', fore_handler_arrow);
  create_days_element(year, month);
};
