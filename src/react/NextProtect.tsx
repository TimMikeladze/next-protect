import { ReactNode, Suspense } from 'react';
import { NextProtectForm, NextProtectFormProps } from '.';
import { useNextProtect } from './useNextProtect';

export const defaultNextProtectEndpoint = '/api/next-protect';

export interface NextProtectProps extends NextProtectFormProps {
  children?: ReactNode;

  disabled?: boolean;

  isProtected?: boolean;
}

export const NextProtect = (props: NextProtectProps) => {
  const { isProtected } = useNextProtect({
    ...props,
    isProtected: props.isProtected,
    disabled: props.disabled,
  });

  if (isProtected === false) {
    return props.children;
  }

  if (isProtected === undefined || isProtected === true) {
    return (
      <Suspense>
        <NextProtectForm
          api={props.api || defaultNextProtectEndpoint}
          footer={props.footer}
          header={props.header}
          slotStyles={props.slotStyles}
          slotProps={props.slotProps}
        />
      </Suspense>
    );
  }

  return null;
};
