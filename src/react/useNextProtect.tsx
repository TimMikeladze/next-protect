import { useState, useEffect } from 'react';
import { defaultNextProtectEndpoint } from '.';

export interface NextProtectHookProps {
  api?: string;

  disabled?: boolean;

  isProtected?: boolean;
}

export const useNextProtect = (props: NextProtectHookProps) => {
  const [isProtected, setIsProtected] = useState(props.isProtected);

  useEffect(() => {
    if (props.disabled) {
      return;
    }
    if (props.isProtected === undefined) {
      fetch(props.api || defaultNextProtectEndpoint)
        .then((res) => res.json())
        .then((data) => {
          setIsProtected(data.isProtected);
        });
    }
  }, [props.isProtected, props.disabled]);

  return { isProtected };
};
