import * as classNames from 'classnames';
import * as React from 'react';

export const StepsList = ({ steps, step }) => (
  <>
    {steps.length > 1 && (
      <div className="steps clearfix">
        <ul role="tablist">
          {steps.map((currentStep, index) => (
            <li
              role="tab"
              key={index}
              className={classNames({
                first: index === 0,
                current: index === step,
                disabled: index !== step,
              })}
              aria-selected={index === step}
              aria-disabled={index !== step}
            >
              <a>
                <span className="number">{index + 1}. </span>
                {currentStep}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
);
