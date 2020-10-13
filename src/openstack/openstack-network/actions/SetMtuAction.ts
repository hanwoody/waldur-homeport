import { translate } from '@waldur/i18n';
import { closeModalDialog } from '@waldur/modal/actions';
import { updateSubnet } from '@waldur/openstack/api';
import { validateState } from '@waldur/resource/actions/base';
import { ResourceActionDialog } from '@waldur/resource/actions/ResourceActionDialog';
import { ResourceAction } from '@waldur/resource/actions/types';
import { showErrorResponse, showSuccess } from '@waldur/store/coreSaga';

export default function createAction({ resource }): ResourceAction {
  return {
    name: 'set_mtu',
    title: translate('Set MTU'),
    type: 'form',
    validators: [validateState('OK')],
    fields: [
      {
        name: 'mtu',
        type: 'integer',
        label: translate('MTU'),
      },
    ],
    getInitialValues: () => ({
      mtu: resource.mtu,
    }),
    component: ResourceActionDialog,
    useResolve: true,
    submitForm: async (dispatch, formData) => {
      try {
        await updateSubnet(resource.uuid, formData);
        dispatch(showSuccess(translate('Subnet has been updated.')));
        dispatch(closeModalDialog());
      } catch (e) {
        dispatch(showErrorResponse(e, translate('Unable to update subnet.')));
      }
    },
  };
}
