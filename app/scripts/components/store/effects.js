import formActionSaga from 'redux-form-saga';

import chartSaga from '@waldur/dashboard/chart/effects';
import jiraSaga from '@waldur/jira/issue/effects';
import modalSaga from '@waldur/modal/effects';
import tableSaga from '@waldur/table-react/effects';

import coreSaga from './coreSaga';

export default [
  coreSaga,
  formActionSaga,
  chartSaga,
  jiraSaga,
  modalSaga,
  tableSaga,
];