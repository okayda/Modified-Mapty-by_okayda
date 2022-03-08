'use strict';

export const document_selector_name = {
  form: '.set-form',
  workouts: '.workouts-container',
  inputType: '.form__input--type',
  inputDistance: '.form__input--distance',
  inputDuration: '.form__input--duration',
  inputCadence: '.form__input--cadence',
  inputElevation: '.form__input--elevation',

  editForm: '.edit-form',
  overlay: '.overlay',

  //error message modal !!
  error_container: '.error-container',
  errOverlay: '.error-overlay',
  error_message: '.error-message',
  error_Btn: '.error-okay-btn',

  //timestamp modal !!
  //tidar = time + calendar
  //_offForm()
  tidar_container: '.timestamp-container',

  //_setMeridiem()
  meridiem: '.meridiem-set',

  // _deleteCustomData()
  timeH: '.hours-set',
  timeM: '.minutes-set',
  //   dateText: '.date-picker .selected-date',
  dateText: '.selected-date',

  //_offDisplaySchedule(s)
  editOverlay: '.overlay-edit-form',
  editContainer: '.edit-form',

  //_getCustomScheduleApp()
  monthText: '.date-picker .mth',
  daysContainer: '.date-picker .days',
  monthNextArrow: '.date-picker .next-mth',
  monthPrevArrow: '.date-picker .prev-mth',

  //_meridiemSetText()
  btnBN: '.btn-AM',
  btnAN: '.btn-PM',

  customSched: '.custom__schedule',
  timestamp_edit_run: '.custom-schedule-running',
  timestamp_edit_cyc: '.custom-schedule-cycling',

  //clearErrorInput()
  inputFormDistance: '.form__input--distance',
  inputFromDuration: '.form__input--duration',
  inputFormCadence: '.form__input--cadence',

  //_burgerMenu()
  burgerIcon: '.fa-bars',
  searchInput: 'mysearch',
  searchContainer: '.search',

  workItself: '.exercise-container',
  workInfo: '.exercise-info-container',

  editRun: '#running',
  editCyc: '#cycling',

  edit_rDistance: '.rDistance',
  edit_rDuration: '.rDuration',
  edit_rCadence: '.rCadence',

  edit_cDistance: '.cDistance',
  edit_cDuration: '.cDuration',
  edit_cElevation: '.cElevation',

  // Side-bar
  menuOpen: '.menu-btn',
  menuClose: '.close-btn',
  slideBar: '.side-bar',
  nestedLinkContainer: '.container-nested-option',
  overlaySide: '.overlay-side-bar',

  exerciseContainer: '.container-row-nav-exercise',
  runningContainer: '.container-row-nav-running',
  cyclingContainer: '.container-row-nav-cycling',

  exerDrop: '.exercise-dropdown',
  nestedIcon: '.nested-drop-icon',

  optionSelector: '.nested-unorder-list > .nested-list',
  /* *************** */
};
