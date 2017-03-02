import selectWorkspaceToggle from './select-workspace-toggle';
import selectWorkspaceDialog from './select-workspace-dialog';
import sidebar from './sidebar';
import sidebarToggle from './sidebar-toggle';
import siteHeader from './site-header';
import titleService from './title-service';
import setTitleFromState from './set-title-from-state';
import uiSrefActiveIf from './ui-sref-active-if';
import WorkspaceService from './workspace-service';
import { breadcrumbs } from './breadcrumbs';
import { appFooter } from './app-footer';
import headerModule from './header/module';

export default module => {
  module.directive('selectWorkspaceToggle', selectWorkspaceToggle);
  module.directive('selectWorkspaceDialog', selectWorkspaceDialog);
  module.directive('sidebar', sidebar);
  module.component('sidebarToggle', sidebarToggle);
  module.component('siteHeader', siteHeader);
  module.service('titleService', titleService);
  module.run(setTitleFromState);
  module.directive('uiSrefActiveIf', uiSrefActiveIf);
  module.service('WorkspaceService', WorkspaceService);
  module.component('breadcrumbs', breadcrumbs);
  module.component('appFooter', appFooter);
  headerModule(module);
};
