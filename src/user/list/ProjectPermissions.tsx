import * as React from 'react';

import { CUSTOMER_OWNER_ROLE } from '@waldur/core/constants';
import { ProjectLink } from '@waldur/project/ProjectLink';
import { Table, connectTable, createFetcher } from '@waldur/table';
import { filterByUser } from '@waldur/workspace/selectors';

const TableComponent = (props) => {
  const { translate } = props;
  return (
    <Table
      {...props}
      columns={[
        {
          title: translate('Project name'),
          render: ProjectLink,
        },
        {
          title: translate('Organization'),
          render: ({ row }) => <span>{row.customer_name}</span>,
        },
        {
          title: translate('Role'),
          render: ({ row }) => <span>{translate(row.role)}</span>,
        },
      ]}
      verboseName={translate('projects')}
      enableExport={true}
    />
  );
};

const TableOptions = {
  table: 'projects',
  fetchData: createFetcher('project-permissions'),
  getDefaultFilter: filterByUser,
  exportFields: ['customer', 'is_owner'],
  exportRow: (row) => [row.customer_name, row.role === CUSTOMER_OWNER_ROLE],
};

export const ProjectPermissions = connectTable(TableOptions)(TableComponent);
