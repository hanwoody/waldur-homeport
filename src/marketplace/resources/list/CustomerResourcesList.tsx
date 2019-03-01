import * as React from 'react';
import { connect } from 'react-redux';
import { Option } from 'react-select';
import { compose } from 'redux';
import { getFormValues } from 'redux-form';

import { translate } from '@waldur/i18n';
import { Category } from '@waldur/marketplace/types';
import { Table, connectTable, createFetcher } from '@waldur/table-react';
import { getCustomer } from '@waldur/workspace/selectors';
import { Customer, Project } from '@waldur/workspace/types';

import { ResourceState } from '../types';
import { ResourceNameField } from './ResourceNameField';
import { ResourceStateField } from './ResourceStateField';

interface ResourceFilter {
  state?: Option<ResourceState>;
  project?: Project;
  category?: Category;
}

interface StateProps {
  customer: Customer;
  filter: ResourceFilter;
}

export const TableComponent = props => {
  const columns = [
    {
      title: translate('Name'),
      render: ResourceNameField,
    },
    {
      title: translate('Project'),
      render: ({ row }) => <span>{row.project_name}</span>,
    },
    {
      title: translate('Category'),
      render: ({ row }) => <span>{row.category_title}</span>,
    },
    {
      title: translate('State'),
      render: ResourceStateField,
    },
    {
      title: translate('Plan'),
      render: ({ row }) => <span>{row.plan_name || 'N/A'}</span>,
    },
  ];

  return (
    <Table
      {...props}
      columns={columns}
      verboseName={translate('Resources')}
    />
  );
};

const mapPropsToFilter = (props: StateProps) => {
  const filter: Record<string, string> = {};
  if (props.customer) {
    filter.customer_uuid = props.customer.uuid;
  }
  if (props.filter) {
    if (props.filter.state) {
      filter.state = props.filter.state.value;
    }
    if (props.filter.project) {
      filter.project_uuid = props.filter.project.uuid;
    }
    if (props.filter.category) {
      filter.category_uuid = props.filter.category.uuid;
    }
  }
  return filter;
};

const exportRow = row => [
  row.name,
  row.project_name,
  row.category_title,
  row.state,
  row.plan_name,
];

const exportFields = [
  'Name',
  'Project',
  'Category',
  'State',
  'Plan',
];

const TableOptions = {
  table: 'CustomerResourcesList',
  fetchData: createFetcher('marketplace-resources'),
  mapPropsToFilter,
  exportRow,
  exportFields,
};

const mapStateToProps = state => ({
  customer: getCustomer(state),
  filter: getFormValues('CustomerResourcesFilter')(state),
});

const enhance = compose(
  connect<StateProps>(mapStateToProps),
  connectTable(TableOptions),
);

export const CustomerResourcesList = enhance(TableComponent) as React.ComponentType<{}>;