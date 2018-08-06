import { call, put, select, takeEvery } from 'redux-saga/effects';

import { format } from '@waldur/core/ErrorMessageFormatter';
import { translate } from '@waldur/i18n';
import { showError, showSuccess } from '@waldur/store/coreSaga';
import { getProject } from '@waldur/workspace/selectors';

import * as actions from './actions';
import * as api from './api';
import * as constants from './constants';
import * as selectors from './selectors';

function* createOrder() {
  const project = yield select(getProject);
  const items = yield select(selectors.getItems);
  try {
    yield call(api.createOrder, {
      project: project.url,
      items: items.map(item => ({ offering: item.url })),
    });
    yield put(showSuccess(translate('Order has been submitted.')));
    yield put(actions.setState('Approve'));
    yield put(actions.clearCart());
  } catch (error) {
    const errorMessage = `${translate('Unable to create order.')} ${format(error)}`;
    yield put(showError(errorMessage));
  }
}

export default function*() {
  yield takeEvery(constants.CREATE_ORDER, createOrder);
}