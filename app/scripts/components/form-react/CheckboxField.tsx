import * as React from 'react';

import { FormField } from './types';

interface CheckboxFieldProps extends FormField {
  className?: string;
  checked?: boolean;
}

export const CheckboxField = (props: CheckboxFieldProps) => {
  const { input, label, validate, ...rest } = props;
  return (
    <input
      {...props.input}
      type="checkbox"
      {...rest}
    />
  );
};
