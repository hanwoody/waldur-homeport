import { OrderState } from '@waldur/marketplace/cart/types';
import { AttributesType } from '@waldur/marketplace/types';

export interface StatusChange {
  processing: boolean;
  processed: boolean;
}

export interface OrderItemResponse {
  uuid: string;
  offering_uuid: string;
  offering_name: string;
  offering_description: string;
  offering_thumbnail: string;
  resource_uuid?: string;
  resource_type?: string;
  cost: string;
  estimate?: number;
  unit: string;
  state: string;
  attributes: AttributesType;
}

export interface State {
  items: OrderItemResponse[];
  state: OrderState;
  total_cost?: number;
}