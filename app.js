'use strict';

import { dataObj as queryName } from './query_name.js';

import { initSideBar } from './sidebar.js';

import { initTheme } from './theme.js';

import { timestampObj as AppTimestamp } from './timestamp.js';

import { objectOverlays } from './overlays-functionalities.js';

import event_handlers_init from './eventHandlers-functionalities.js';

import { changeWorkoutInfo } from './edit_form_functionalities.js';

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

    this.specific_prop_for_type_exercise(cadence_or_elevation);

    this.getExerciseDetails();
  }

  specific_prop_for_type_exercise(unknow_exercise_prop) {
    // True --> Running
    // False --> Cycling
    if (this.exerciseType === 'running') {
      this.pace_or_speed = Math.round(this.duration / this.distance);
    } else {
      this.pace_or_speed = Math.round(this.distance / (this.duration / 60));
    }
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

    this._eventDelegationIcons();

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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

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

    const workoutValue = (exerciseType, arrVal) => {
      return exerciseType ? new Running(...arrVal) : new Cycling(...arrVal);
    };

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
    const workValueCondition = type === 'running' ? true : false;

    // workout = workoutValue(workValueCondition, arrVal);
    workout = new Excercise_Details(...arrVal);

    infoData.workouts.push(workout);

    this._renderWorkoutMarker(workout);

    renderMethods.renderWorkout(workout);

    this._hideForm();

    infoData.setLocalStorage();
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

  _burgerMenu() {
    document
      .querySelector(queryName.burgerIcon)
      .addEventListener('click', function () {
        console.log('Hello World');
      });
  }

  _alternateArrow(target, targetName) {
    const checkHaveEllips = function (value) {
      return value.filter(val => val.textContent.slice(1, 4) === '...').length;
    };

    const targetExerciseAddStyle = function (isDropDown) {
      const targetExercise = target
        .closest(queryName.workItself)
        .querySelector(queryName.workInfo);

      targetExercise.className = 'exercise-info-container';
      targetExercise.classList.toggle(
        renderMethods.conditionStyleAdd(
          isDropDown,
          null,
          renderMethods.addStyleContainer().addGridClass
        )
      );
      targetExercise.classList.toggle(
        renderMethods.conditionStyleAdd(
          isDropDown,
          null,
          renderMethods.addStyleContainer().addHeightClass
        )
      );
      targetExercise.classList.toggle(
        renderMethods.conditionStyleAdd(
          isDropDown,
          null,
          renderMethods.addStyleContainer().addPaddingClass
        )
      );
    }.bind(this);

    if (targetName === 'fa-arrow-down') {
      target.classList.add('togPlusAni');
      target.classList.toggle('togPlus');
      target.classList.toggle('click_icon_color');

      const exerciseTextNodes = target
        .closest(queryName.workItself)
        .querySelectorAll('.text_info');
      const exerciseTargetId = target.closest(queryName.workItself).dataset.id;

      infoData.workouts.forEach(eachExercise => {
        if (eachExercise.id === exerciseTargetId) {
          if (checkHaveEllips(Array.from(exerciseTextNodes)) === 0) {
            exerciseTextNodes.forEach(
              item => (item.textContent = item.textContent.slice(0, 1) + '...')
            );

            eachExercise.isDropDown = false;

            infoData.setLocalStorage();

            targetExerciseAddStyle(eachExercise.isDropDown);

            return;
          }

          exerciseTextNodes.forEach(
            (item, i) => (item.textContent = eachExercise.ExerciseDetails[i])
          );

          eachExercise.isDropDown = true;

          infoData.setLocalStorage();

          targetExerciseAddStyle(eachExercise.isDropDown);

          return;
        }
      });
    }
  }

  // *******************************************************
  // *******************************************************
  // *******************************************************
  // *******************************************************
  // *******************************************************

  _target_text_Edit_form(target) {
    infoData.specificEvents.push(
      target.closest(queryName.workItself).dataset.id,
      target.closest(queryName.workItself).querySelectorAll('.text_info'),
      target.closest(queryName.workItself).querySelectorAll('.icon_info'),
      target.closest('.workout__title').querySelector('.title')
    );
    editForm.setAttribute(
      'data-id',
      target.closest(queryName.workItself).dataset.id
    );
  }

  _editForm(target, targetName) {
    if (targetName === 'fa-edit') {
      this._target_text_Edit_form(target);
      objectOverlays.edit_form_init();
    }
  }

  _gotoMapmarker(target, targetName) {
    if (targetName === 'fa-map-marker-alt') {
      this._moveToPopUp(target);
      target.classList.toggle('click_icon_color');
    }
  }

  _removeErrorAlert(target) {
    if (target.className.split(' ')[0] === 'error-overlay') {
      document.querySelector('.error-overlay').classList.remove('active');
    }
  }

  _workout_icons_functionalities(e) {
    const target = e.target;
    const targetName = target.className.split(' ')[1];

    this._removeErrorAlert(target);
    this._alternateArrow(target, targetName);
    this._editForm(target, targetName);

    this._gotoMapmarker(target, targetName);
  }

  _eventDelegationIcons() {
    document
      .querySelector('body')
      .addEventListener(
        'click',
        this._workout_icons_functionalities.bind(this)
      );

    editForm.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();

        changeWorkoutInfo();

        console.log('the module for edit forms has been executed');
      }.bind(this)
    );
  }

  _getExerciseData() {
    return infoData.workouts;
  }
}

const app = new App();
