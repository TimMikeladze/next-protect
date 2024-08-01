import 'next-protect/styles.css';

import { NextProtect } from 'next-protect/react';

const Page = () => (
  <NextProtect
    slotProps={{
      passwordInput: {
        placeholder: 'The password is password',
      },
    }}
  />
);

export default Page;
