'use strict';

export const init_time = function () {
  const hours_set = document.querySelector('.hours-set');
  const minutes_set = document.querySelector('.minutes-set');
  const merediem_set = document.querySelector('.meridiem-set');

  const select_hours_drop = document.querySelector('.selected-hours-drop');
  const options_hours_container = document.querySelector(
    '.options-hours-container'
  );

  const select_minutes_drop = document.querySelector('.selected-minutes-drop');
  const options_minutes_container = document.querySelector(
    '.options-minutes-container'
  );

  const morning_btn = document.querySelector('.morning');
  const afternoon_btn = document.querySelector('.afternoon');

  const meridiem_btn_text = function (this_obj) {
    merediem_set.textContent = this_obj.textContent;
    this_obj.classList.add('active');
  };

  morning_btn.addEventListener('click', function () {
    meridiem_btn_text(this);
    afternoon_btn.classList.remove('active');
  });

  afternoon_btn.addEventListener('click', function () {
    meridiem_btn_text(this);
    morning_btn.classList.remove('active');
  });

  select_hours_drop.addEventListener('click', () => {
    options_hours_container.classList.toggle('active');
  });

  const get_text = function (e) {
    const target_text = e.target.querySelector('.text');
    const tartget_class = e.target.className;

    return tartget_class === 'text'
      ? e.target.textContent
      : target_text.textContent;
  };

  options_hours_container.addEventListener('click', function (e) {
    select_hours_drop.textContent = get_text(e);
    const hours_text = get_text(e).split(' ')[0];

    hours_set.textContent = hours_text;

    this.classList.toggle('active');
  });

  select_minutes_drop.addEventListener('click', () => {
    options_minutes_container.classList.toggle('active');
  });

  options_minutes_container.addEventListener('click', function (e) {
    select_minutes_drop.textContent = get_text(e);
    const minutes_text = get_text(e).split(' ')[0];

    minutes_set.textContent = minutes_text;

    this.classList.toggle('active');
  });

  const time_markup_text = function (i, time_type) {
    return `<div class="option">
    <input type="radio" class="radio" name="category">
    <label class="text">${i} ${time_type}</label>
    </div>`;
  };

  const create_time_element = function (obj) {
    for (let i = obj.time_start; i <= obj.time_end; i++)
      obj.markup_insert_container.insertAdjacentHTML(
        'beforeend',
        obj.create_text(i, obj.time_type)
      );
  };

  const hours_values = {
    time_type: 'Hour',
    time_start: 1,
    time_end: 12,
    create_text: time_markup_text,
    markup_insert_container: options_hours_container,
  };

  const minutes_values = {
    time_type: 'Minutes',
    time_start: 0,
    time_end: 59,
    create_text: time_markup_text,
    markup_insert_container: options_minutes_container,
  };

  create_time_element(hours_values);
  create_time_element(minutes_values);
};
