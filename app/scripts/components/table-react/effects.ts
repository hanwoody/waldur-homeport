import { call, put, select, takeEvery } from 'redux-saga/effects';

import * as actions from './actions';
import { getTableState } from './store';
import { getTableOptions } from './registry';
import { exportTable } from './export';
import { TableOptions } from './types';

function* fetchList(action) {
  const table = action.payload.table;
  try {
    const state = yield select(getTableState(table));
    const options = getTableOptions(table);
    const filter = yield select(options.getDefaultFilter);
    const request = {
      pagination: state.pagination,
      filter: {
        ...filter
      },
    };
    if (options.queryField && state.query !== '') {
      request.filter[options.queryField] = state.query;
    }

    const { rows, resultCount } = yield call(options.fetchData, request);
    yield put(actions.fetchListDone(table, rows, resultCount));
  } catch(error) {
    yield put(actions.fetchListError(table, error));
  }
}

export default function* watchFetchList() {
  yield takeEvery(actions.FETCH_LIST_START, fetchList);
  yield takeEvery(actions.EXPORT_TABLE_AS, exportTable);
}
