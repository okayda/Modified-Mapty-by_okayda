'use strict';

import { app_data } from './app_data.js';

import { document_selector_name as queryName } from './query_name.js';

import { document_element_forms } from './document_element.js';

import event_handlers_init from './handlers_functionalities.js';

import web_page_theme from './theme.js';

import side_bar_init from './side-bar-functionalities/sidebar.js';

import timestamp_init from './timestamp-functionalities/timestamp_init.js';

import { overlays_data, overlay_init } from './overlays_functionalities.js';

import { render_methods } from './render_markup.js';

import { utilities } from './utilities.js';

import { activate_skeleton } from './skeleton_animation.js';

import { debug_handler } from './debug_handler.js';

class Workout {
  id = Number((Date.now() + '').slice(-10));
  constructor(coords, distance, duration, longJourney, isDropDown) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.longJourney = longJourney;
    this.isDropDown = isDropDown;
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
    this.ExerciseDetails = [
      this.distance,
      this.duration,
      this.pace_or_speed,
      this.cadence_or_elevation,
    ];
  }
}

class App {
  #mapEvent;
  #mapZoomLevel = 13;

  constructor() {
    this._get_user_position();

    this._getLocalStorage();

    this._workouts_container_event_delegation();

    document_element_forms.form.addEventListener(
      'submit',
      this._check_and_add_workout.bind(this)
    );

    document_element_forms.inputType.addEventListener(
      'change',
      this._toggleElevationField
    );

    event_handlers_init();

    timestamp_init();

    overlay_init();

    side_bar_init();

    web_page_theme();

    debug_handler(app_data);
  }

  _get_user_position() {
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

    app_data.map = L.map('map').setView(coords, this.#mapZoomLevel);

    const leafletStreets = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    const googleStreets = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    ).addTo(app_data.map);

    const satellite = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    const first_marker = L.marker(coords).addTo(app_data.map);

    const baseMaps = {
      'Satellite Maps': satellite,
      'Google Maps': googleStreets,
      'Leaflet Maps': leafletStreets,
    };

    const overlayMaps = {
      'City Location Marker': first_marker,
    };

    L.control
      .layers(baseMaps, overlayMaps, {
        position: 'bottomleft',
      })
      .addTo(app_data.map);

    app_data.map.on('click', this._showForm.bind(this));

    if (app_data.workouts.length === 0) activate_skeleton('add');

    app_data.workouts.forEach(work => this._renderWorkoutMarker(work));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    document_element_forms.form.classList.remove('hidden');
    document_element_forms.inputDistance.focus();
  }

  _hideForm() {
    document_element_forms.inputDistance.value =
      document_element_forms.inputCadence.value =
      document_element_forms.inputDuration.value =
      document_element_forms.inputElevation.value =
        '';

    document_element_forms.form.style.display = 'none';
    document_element_forms.form.classList.add('hidden');

    setTimeout(
      () => (document_element_forms.form.style.display = 'grid'),
      1000
    );
  }

  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords, {
      icon: utilities.my_icon(
        workout.exerciseType === 'running' ? true : false
      ),
    })
      .addTo(app_data.map)
      .bindPopup(
        L.popup({
          ...utilities.popup_options,
        })
      )
      .setPopupContent(
        `<span class="marker-content-color-${
          workout.exerciseType === 'running' ? 'running' : 'cycling'
        }">${workout.description}</span> <p id="${
          workout.id
        }" class="remove">X</p>`
      )
      .openPopup();

    marker.id = workout.id;

    app_data.markers.push(marker);
  }

  _moveToPopUp(target) {
    const targetExerciseId = target.closest(queryName.workItself);

    if (!targetExerciseId) return;

    const workout = app_data.workouts.find(
      work => work.id === +targetExerciseId.dataset.id
    );

    app_data.map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    app_data.workouts = data;

    app_data.workouts.forEach(work =>
      render_methods.renderWorkout(work, work.isDropDown)
    );
  }

  _toggleElevationField() {
    document_element_forms.inputElevation
      .closest('.form__row')
      .classList.toggle('form__row--hidden');
    document_element_forms.inputCadence
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

  _show_error_setForm_alert(msg) {
    overlays_data.overlay_state.error_alert_setForm_enabled = true;

    document.querySelector(queryName.overlay).classList.add('active');

    document.querySelector(queryName.error_container).classList.add('active');

    document.querySelector(queryName.error_message).textContent = msg;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  _check_and_add_workout(e) {
    const type =
      document_element_forms.inputType.value === 'running'
        ? 'running'
        : 'cycling';
    const distance = +document_element_forms.inputDistance.value;
    const duration = +document_element_forms.inputDuration.value;

    //for Running
    const cadence = +document_element_forms.inputCadence.value;
    //for Cycling
    const elevation = +document_element_forms.inputElevation.value;

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
      return this._show_error_setForm_alert(
        'Inputs have to be positive numbers!'
      );
    }

    const isLongJourney =
      render_methods.check_is_long_journey(
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

    document.querySelector(queryName.customSched).textContent =
      'Custom Schedule';

    workout = new Excercise_Details(...arrVal);
    console.log(workout.id);

    workout.timestamp = {
      ...app_data.timestamp_data,
    };

    workout.description = `${workout.title} on ${
      utilities.months[workout.timestamp.month]
    } ${workout.timestamp.day}`;

    activate_skeleton('remove');

    app_data.timestamp_data.reset_date_and_properties();

    app_data.workouts.push(workout);

    this._renderWorkoutMarker(workout);

    render_methods.renderWorkout(workout);

    this._hideForm();

    app_data.setLocalStorage();
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

    const exerciseTargetId = Number(
      target.closest(queryName.workItself).dataset.id
    );

    app_data.workouts.forEach(eachExercise => {
      if (eachExercise.id === exerciseTargetId) {
        if (check_if_contains_ellipsis(Array.from(exercise_text_nodes)) === 0) {
          exercise_text_nodes.forEach(item => {
            if (item.textContent > 999)
              item.textContent = render_methods.make_ellipsis(item.textContent);
          });

          eachExercise.isDropDown = false;

          app_data.setLocalStorage();
          console.log('lol');
          return;
        }

        exercise_text_nodes.forEach(
          (item, i) => (item.textContent = eachExercise.ExerciseDetails[i])
        );

        eachExercise.isDropDown = true;

        app_data.setLocalStorage();
        console.log('lol22');

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

    app_data.specificEvents.push(
      target_exercise.dataset.id,
      target_exercise.querySelectorAll('.text_info'),
      target_exercise.querySelectorAll('.icon_info'),
      target_exercise.querySelector('.title'),
      target_exercise.querySelector('.date'),
      target_exercise.querySelector('.time'),
      target_exercise
    );

    document_element_forms.editForm.setAttribute(
      'data-id',
      target_exercise.dataset.id
    );

    target_exercise.classList.add('active-edit');

    overlays_data.show_edit_form();
  }

  _remove_icon(target) {
    if (target.id !== 'remove-icon') return;

    const target_element = target.closest('.exercise-container');
    const target_id = Number(target_element.dataset.id);
    target_element.classList.add('active-delete');

    app_data.markers.forEach((el, i) => {
      if (el.id === target_id) {
        app_data._remove_marker_and_info_data(el, i);
        app_data.setLocalStorage();

        setInterval(function () {
          target_element.remove();
        }, 600);
        return;
      }
    });

    if (app_data.workouts.length === 0) activate_skeleton('add');
  }

  _workout_icons_init(e) {
    const target = e.target;

    this._arrow_alternate_icon(target);

    this._map_marker_icon(target);

    this._edit_form_icon(target);

    this._remove_icon(target);
  }

  // only for workout icons functionalities
  _workouts_container_event_delegation() {
    document
      .querySelector(queryName.workouts)
      .addEventListener('click', this._workout_icons_init.bind(this));
  }
}
const app = new App();
