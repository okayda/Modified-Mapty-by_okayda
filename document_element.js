import { document_selector_name as queryName } from './query_name.js';

export const document_element_forms = {
  form: document.querySelector(queryName.form),

  inputType: document.querySelector(queryName.inputType),

  inputDistance: document.querySelector(queryName.inputDistance),

  inputDuration: document.querySelector(queryName.inputDuration),

  inputCadence: document.querySelector(queryName.inputCadence),

  inputElevation: document.querySelector(queryName.inputElevation),

  editForm: document.querySelector(queryName.editForm),
};
