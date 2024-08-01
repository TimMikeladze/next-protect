'use client';

import { useSearchParams } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';

export interface NextProtectFormProps {
  api?: string;

  footer?: ReactNode;

  header?: ReactNode;

  slotProps?: Partial<Record<'form' | 'passwordInput' | 'submitButton', any>>;
  slotStyles?: Partial<
    Record<
      | 'container'
      | 'header'
      | 'footer'
      | 'form'
      | 'passwordInput'
      | 'submitButton'
      | 'inputContainer'
      | 'submitButtonContainer',
      CSSProperties
    >
  >;
}

export const NextProtectForm = (props: NextProtectFormProps) => {
  const params = useSearchParams();

  const error = params.get('error');
  const content = (
    <div className="next-protect-container" style={props.slotStyles?.container}>
      <form
        method="POST"
        action={props.api}
        className="next-protect-form"
        style={props.slotStyles?.form}
        {...props.slotProps?.form}
      >
        {props.header && (
          <div className="next-protect-header" style={props.slotStyles?.header}>
            {props.header}
          </div>
        )}
        <div
          className="next-protect-input-container"
          style={props.slotStyles?.inputContainer}
        >
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={[
              'next-protect-password',
              error ? 'next-protect-password-error' : undefined,
            ]
              .filter(Boolean)
              .join(' ')}
            style={props.slotStyles?.passwordInput}
            required
            {...props.slotProps?.passwordInput}
          />
        </div>
        <div
          className="next-protect-submit-button-container"
          style={props.slotStyles?.submitButtonContainer}
        >
          <button
            type="submit"
            className="next-protect-submit-button"
            style={props.slotStyles?.submitButton}
            {...props.slotProps?.submitButton}
          >
            {props.slotProps?.submitButton?.children || 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );

  return content;
};
