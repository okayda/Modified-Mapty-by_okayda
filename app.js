'use strict';

import { dataObj as queryName } from './query_name.js';

import { document_obj } from './document_element.js';

import { initSideBar } from './sidebar.js';

import { initTheme } from './theme.js';

import { init_timestamp } from './timestamp-functionalities/init-timestamp.js';

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

    init_timestamp();

    event_handlers_init();

    objectOverlays.overlays_init();

    this._getLocalStorage();

    // form.addEventListener('submit', this._newWorkout.bind(this));
    document_obj.form.addEventListener(
      'submit',
      this._check_and_add_workout.bind(this)
    );

    this._workouts_container_event_delegation();

    document_obj.inputType.addEventListener(
      'change',
      this._toggleElevationField
    );

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

  _showForm(mapE) {
    this.#mapEvent = mapE;
    document_obj.form.classList.remove('hidden');
    document_obj.inputDistance.focus();
  }

  _hideForm() {
    document_obj.inputDistance.value =
      document_obj.inputCadence.value =
      document_obj.inputDuration.value =
      document_obj.inputElevation.value =
        '';

    document_obj.form.style.display = 'none';
    document_obj.form.classList.add('hidden');

    setTimeout(() => (document_obj.form.style.display = 'grid'), 1000);
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
      renderMethods.renderWorkout(work, work.isDropDown)
    );
  }

  _toggleElevationField() {
    document_obj.inputElevation
      .closest('.form__row')
      .classList.toggle('form__row--hidden');
    document_obj.inputCadence
      .closest('.form__row')
      .classList.toggle('form__row--hidden');
  }

  _burgerMenu() {
    document
      .querySelector(queryName.burgerIcon)
      .addEventListener('click', function () {
        console.log('Hello World');
      });
  }

  _error_alert(msg) {
    objectOverlays.overlay_state.error_alert_setForm_enabled = true;

    document.querySelector(queryName.overlay).classList.add('active');

    document.querySelector(queryName.error_container).classList.add('active');

    document.querySelector(queryName.error_message).textContent = msg;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  _check_and_add_workout(e) {
    const type =
      document_obj.inputType.value === 'running' ? 'running' : 'cycling';
    const distance = +document_obj.inputDistance.value;
    const duration = +document_obj.inputDuration.value;

    //for Running
    const cadence = +document_obj.inputCadence.value;
    //for Cycling
    const elevation = +document_obj.inputElevation.value;

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
      return this._error_alert('Inputs have to be positive numbers!');
    }

    const isLongJourney =
      renderMethods.check_is_long_journey(
        distance,
        duration,
        exerciseTypeProp
      ) > 0
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

    const target_info_display = target_workout_container.querySelector(
      queryName.workInfo
    );

    target.classList.toggle('arrow-up-rotate');
    target.classList.toggle('arrow-active');
    target.classList.toggle('arrow-deactive');

    target_info_display.classList.toggle('display-grid');
    target_info_display.classList.toggle('not-display-grid');

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

          return;
        }

        exercise_text_nodes.forEach(
          (item, i) => (item.textContent = eachExercise.ExerciseDetails[i])
        );

        eachExercise.isDropDown = true;

        infoData.setLocalStorage();

        return;
      }
    });
  }

  _map_marker_icon(target) {
    if (target.id !== 'marker-icon') return;

    this._moveToPopUp(target);
    target.classList.toggle('click_icon_color');
  }

  _edit_form_icon(target) {
    if (target.id !== 'edit-icon') return;

    const target_exercise = target.closest(queryName.workItself);

    infoData.specificEvents.push(
      target_exercise.dataset.id,
      target_exercise.querySelectorAll('.text_info'),
      target_exercise.querySelectorAll('.icon_info'),
      target_exercise.querySelector('.title'),
      target_exercise
    );

    document_obj.editForm.setAttribute('data-id', target_exercise.dataset.id);

    target_exercise.classList.add('active-edit');

    objectOverlays.show_edit_form();
  }

  _workout_icons_init(e) {
    const target = e.target;

    this._arrow_alternate_icon(target);

    this._map_marker_icon(target);

    this._edit_form_icon(target);
  }

  // only for workout icons functionalities
  _workouts_container_event_delegation() {
    document
      .querySelector(queryName.workouts)
      .addEventListener('click', this._workout_icons_init.bind(this));
  }
}
const app = new App();
