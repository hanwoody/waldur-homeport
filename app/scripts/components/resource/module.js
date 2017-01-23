import resourceUtils from './resource-utils-service';
import resourceDetails from './resource-details';
import resourceSummary from './resource-summary';
import resourceEvents from './resource-events';
import resourceRoutes from './routes';
import resourceState from './resource-state';
import ResourceStateConfiguration from './resource-state-configuration';
import resourceAlerts from './resource-alerts';
import resourceIssues from './resource-issues';
import resourceHeader from './resource-header';
import resourceTab from './resource-tab';
import resourceTabs from './resource-tabs';
import ResourceTabsConfiguration from './resource-tabs-configuration';
import { DEFAULT_RESOURCE_TABS } from './constants';
import { resourceSummaryBase } from './resource-summary-base';
import { resourceBreadcrumbs } from './resource-breadcrumbs';
import ResourceBreadcrumbsService from './resource-breadcrumbs-service';
import { CATEGORY_ITEMS } from './resource-categories';
import resourceStorageTabs from './resource-storage-tabs';
import resourcesService from './resources-service';

export default module => {
  module.service('resourceUtils', resourceUtils);
  module.provider('ResourceStateConfiguration', ResourceStateConfiguration);
  module.component('resourceDetails', resourceDetails);
  module.component('resourceSummary', resourceSummary);
  module.component('resourceEvents', resourceEvents);
  module.component('resourceState', resourceState);
  module.component('resourceAlerts', resourceAlerts);
  module.component('resourceIssues', resourceIssues);
  module.directive('resourceHeader', resourceHeader);
  module.config(resourceRoutes);
  module.directive('resourceTab', resourceTab);
  module.component('resourceTabs', resourceTabs);
  module.provider('ResourceTabsConfiguration', ResourceTabsConfiguration);
  module.constant('DEFAULT_RESOURCE_TABS', DEFAULT_RESOURCE_TABS);
  module.component('resourceSummaryBase', resourceSummaryBase);
  module.component('resourceBreadcrumbs', resourceBreadcrumbs);
  module.service('ResourceBreadcrumbsService', ResourceBreadcrumbsService);
  module.constant('CATEGORY_ITEMS', CATEGORY_ITEMS);
  module.component('resourceStorageTabs', resourceStorageTabs);
  module.service('resourcesService', resourcesService);
};
