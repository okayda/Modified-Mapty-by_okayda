'use strict';

import { dataObj as queryName } from './query_name.js';

import { initSideBar } from './sidebar.js';

import { initTheme } from './theme.js';

import { timestampObj as AppTimestamp } from './timestamp.js';

import { objectOverlays } from './overlays-functionalities.js';

import event_handlers_init from './eventHandlers-functionalities.js';

import { renderMethods } from './render_markup.js';

import { initDebugHandlers } from './debug.js';

export let CustomData = {};

export const infoData = {
  workouts: [],
  specificEvents: [],

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

  delete_specific_specificEvents_data() {
    //do something
  },

  delete_specific_workouts_data() {
    //do something
  },

  setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(infoData.workouts));
  },
};

const form = document.querySelector(queryName.form);
const inputType = document.querySelector(queryName.inputType);
const inputDistance = document.querySelector(queryName.inputDistance);
const inputDuration = document.querySelector(queryName.inputDuration);
const inputCadence = document.querySelector(queryName.inputCadence);
const inputElevation = document.querySelector(queryName.inputElevation);

const editForm = document.querySelector(queryName.editForm);

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration, longJourney, isDropDown) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.longJourney = longJourney;
    this.isDropDown = isDropDown;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'];

    const weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    // below, this is the title of each market in the leaflep map.

    this.description = `${this.exerciseType[0].toUpperCase()}${this.exerciseType.slice(
      1
    )} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    this.dateSchedule = `0 \\ 00 \\ 0000`;
    this.timeSchedule = `00:00 NN`;
    // this.exerciseType = `${this.exerciseType[0].toUpperCase()}${this.exerciseType.slice(
    //   1
    // )}`;

    this.month = `${this.date.getMonth() + 1}`;

    // this.dayName = `${weekDays[this.date.getDay()]}`;
    this.year = `${this.date.getFullYear()}`;

    this.dayNumber = `${this.date.getDate()}`;

    this.hours = `${this.date.getHours()}`;

    this.minutes = `${this.date.getMinutes()}`;
  }
}

class Excercise_Details extends Workout {
  constructor(
    coords,
    distance,
    duration,
    cadence_or_elevation,
    longJourney,
    exerciseType,
    isDropDown
  ) {
    super(coords, distance, duration, longJourney, isDropDown);

    this.cadence_or_elevation = cadence_or_elevation;
    this.exerciseType = exerciseType;
    this.title =
      this.exerciseType[0].toUpperCase() + this.exerciseType.slice(1);

    this._setDescription();

    this.specific_prop_for_type_exercise();

    this.getExerciseDetails();
  }

  specific_prop_for_type_exercise() {
    // True --> Running
    // False --> Cycling
    if (this.exerciseType === 'running')
      this.pace_or_speed = Math.round(this.duration / this.distance);
    else this.pace_or_speed = Math.round(this.distance / (this.duration / 60));
  }

  getExerciseDetails() {
    // this.ExerciseDetails = [this.distance, this.duration, this.cadence];
    this.ExerciseDetails = [
      this.distance,
      this.duration,
      this.pace_or_speed,
      this.cadence_or_elevation,
    ];
  }
}

class App {
  date = new Date();

  #map;
  #mapEvent;
  #mapZoomLevel = 13;

  constructor() {
    this._getPosition();

    initSideBar();

    initTheme();

    event_handlers_init();

    AppTimestamp.getCustomSchedule();

    objectOverlays.overlays_init();

    this._getLocalStorage();

    // form.addEventListener('submit', this._newWorkout.bind(this));
    form.addEventListener('submit', this._check_and_add_workout.bind(this));

    this._workouts_container_event_delegation();

    inputType.addEventListener('change', this._toggleElevationField);

    // below this, is used for debugging purposes
    initDebugHandlers(infoData, CustomData);
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your location');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    //   maxZoom: 20,
    //   subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    // }).addTo(this.#map);

    // L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    //   attribution:
    //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    // }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));

    infoData.workouts.forEach(work => this._renderWorkoutMarker(work));
  }

  _errorAlert(msg) {
    const popupBox = document.querySelector(queryName.errOverlay);
    const errorMessage = document.querySelector(queryName.errMessage);
    const okBtn = document.querySelector(queryName.errBtn);

    errorMessage.textContent = msg;

    popupBox.classList.add('active');

    okBtn.addEventListener('click', () => {
      popupBox.classList.remove('active');
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');

    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚲'} ${workout.description}`
      )
      .openPopup();
  }

  _moveToPopUp(target) {
    const targetExerciseId = target.closest(queryName.workItself);

    if (!targetExerciseId) return;

    const workout = infoData.workouts.find(
      work => work.id === targetExerciseId.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    infoData.workouts = data;

    infoData.workouts.forEach(work =>
      // this._renderWorkout(work, work.isDropDown)
      renderMethods.renderWorkout(work, work.isDropDown)
    );
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _burgerMenu() {
    document
      .querySelector(queryName.burgerIcon)
      .addEventListener('click', function () {
        console.log('Hello World');
      });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  _check_and_add_workout(e) {
    const type = inputType.value === 'running' ? 'running' : 'cycling';
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    //for Running
    const cadence = +inputCadence.value;
    //for Cycling
    const elevation = +inputElevation.value;

    const exerciseTypeProp = type === 'running' ? cadence : elevation;

    const validInputs = arr => arr.every(inp => Number.isFinite(inp));

    const allPositive = arr => arr.every(inp => inp > 0);

    const clearErrorInput = function (otherInput, initial) {
      document.querySelector(queryName.inputFormDistance).blur();
      document.querySelector(queryName.inputDuration).blur();
      document.querySelector(queryName.inputFormCadence).blur();

      if (!Number.isFinite(distance) || distance <= 0)
        document.querySelector(queryName.inputFormDistance).value = '';

      if (!Number.isFinite(duration) || duration <= 0)
        document.querySelector(queryName.inputDuration).value = '';

      if (!Number.isFinite(otherInput) || otherInput <= 0)
        document.querySelector(`.form__input--${initial}`).value = '';
    };

    e.preventDefault();

    const { lat, lng } = this.#mapEvent.latlng;
    const arr_val_inputs = [distance, duration, exerciseTypeProp];
    let workout;

    if (!validInputs(arr_val_inputs) || !allPositive(arr_val_inputs)) {
      clearErrorInput(
        exerciseTypeProp,
        type === 'running' ? 'cadence' : 'elevation'
      );
      return this._errorAlert('Inputs have to be positive numbers!');
    }

    const isLongJourney =
      renderMethods.checkIsLongJourney(distance, duration, exerciseTypeProp) > 0
        ? true
        : false;

    const arrVal = [
      [lat, lng],
      distance,
      duration,
      exerciseTypeProp,
      isLongJourney,
      type,
      isLongJourney,
    ];

    workout = new Excercise_Details(...arrVal);

    infoData.workouts.push(workout);

    this._renderWorkoutMarker(workout);

    renderMethods.renderWorkout(workout);

    this._hideForm();

    infoData.setLocalStorage();
  }

  // *******************************************************
  // *******************************************************

  _arrow_alternate_icon(target) {
    if (target.id !== 'arrow-icon') return;

    const target_workout_container = target.closest(queryName.workItself);

    const check_if_contains_ellipsis = function (value) {
      return value.filter(val => val.textContent.slice(1, 4) === '...').length;
    };

    const determine_if_is_row_or_column_and_add_style = function () {
      const target_info_display = target_workout_container.querySelector(
        queryName.workInfo
      );

      target_info_display.classList.toggle('display-grid');
      target_info_display.classList.toggle('not-display-grid');
    };

    target.classList.toggle('arrow-up-rotate');
    target.classList.toggle('arrow-active');
    target.classList.toggle('arrow-deactive');

    const exercise_text_nodes =
      target_workout_container.querySelectorAll('.text_info');

    const exerciseTargetId = target.closest(queryName.workItself).dataset.id;

    infoData.workouts.forEach(eachExercise => {
      if (eachExercise.id === exerciseTargetId) {
        if (check_if_contains_ellipsis(Array.from(exercise_text_nodes)) === 0) {
          exercise_text_nodes.forEach(item => {
            if (item.textContent > 999)
              item.textContent = renderMethods.make_ellipsis(item.textContent);
          });

          eachExercise.isDropDown = false;

          infoData.setLocalStorage();

          determine_if_is_row_or_column_and_add_style();

          return;
        }

        exercise_text_nodes.forEach(
          (item, i) => (item.textContent = eachExercise.ExerciseDetails[i])
        );

        eachExercise.isDropDown = true;

        infoData.setLocalStorage();

        determine_if_is_row_or_column_and_add_style();

        return;
      }
    });
  }

  _edit_form_icon(target) {
    if (target.id !== 'edit-icon') return;

    const target_text_Edit_form = function (target) {
      infoData.specificEvents.push(
        target.closest(queryName.workItself).dataset.id,
        target.closest(queryName.workItself).querySelectorAll('.text_info'),
        target.closest(queryName.workItself).querySelectorAll('.icon_info'),
        target.closest(queryName.workItself).querySelector('.title')
      );
      editForm.setAttribute(
        'data-id',
        target.closest(queryName.workItself).dataset.id
      );
    };

    target_text_Edit_form(target);

    objectOverlays.show_edit_form();
  }

  _map_marker_icon(target) {
    if (target.id !== 'marker-icon') return;

    this._moveToPopUp(target);
    target.classList.toggle('click_icon_color');
  }

  _remove_error_alert(target) {
    if (target.className.split(' ')[0] !== 'error-overlay') return;

    document.querySelector('.error-overlay').classList.remove('active');
  }

  _workout_icons_init(e) {
    const target = e.target;
    if (target.className === 'workouts-container') return;

    console.log(target);

    this._remove_error_alert(target);

    this._arrow_alternate_icon(target);

    this._map_marker_icon(target);

    this._edit_form_icon(target);
  }

  // only for workout icons functionalities
  _workouts_container_event_delegation() {
    document
      .querySelector('.workouts-container')
      .addEventListener('click', this._workout_icons_init.bind(this));
  }
}
const app = new App();
