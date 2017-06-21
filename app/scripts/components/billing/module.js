import invoicesService from './invoices-service';
import BillingUtils from './billing-utils';
import billingDetails from './billing-details';
import invoiceHeader from './invoice-header';
import invoiceDetails from './invoice-details';
import invoicesList from './invoices-list';
import billingIssuerDetails from './billing-issuer-details';
import billingCustomerDetails from './billing-customer-details';
import billingRecordDetails from './billing-record-details';
import billingRecordHeader from './billing-record-header';
import billingRecordsList from './billing-records-list';
import billingTabs from './billing-tabs';
import billingRoutes from './routes';

export default module => {
  module.service('invoicesService', invoicesService);
  module.service('BillingUtils', BillingUtils);
  module.component('billingDetails', billingDetails);
  module.component('invoiceHeader', invoiceHeader);
  module.component('invoiceDetails', invoiceDetails);
  module.component('invoicesList', invoicesList);
  module.component('billingIssuerDetails', billingIssuerDetails);
  module.component('billingCustomerDetails', billingCustomerDetails);
  module.component('billingRecordDetails', billingRecordDetails);
  module.component('billingRecordHeader', billingRecordHeader);
  module.component('billingRecordsList', billingRecordsList);
  module.component('billingTabs', billingTabs);
  module.config(billingRoutes);
};
