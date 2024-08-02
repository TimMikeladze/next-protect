# 🔒 next-protect

Protect your Next.js app with a password. A drop-in solution to keep your deployments protected with a basic password system.

> Check-out a [NextJS example](./examples/nextjs-example/) or view the [Demo](https://next-protect.vercel.app/).

## ✨ Features

- [x] App Router support out of the box.
- [x] Supports Next.js Middleware, Edge runtime, RSC and SSR.
- [x] Protect just a specific page or the entire app.
- [x] Use one or more passwords.
- [x] Customizable form and styles.

## 📡 Install

```console
npm install next-protect

yarn add next-protect

pnpm add next-protect
```

> 👋 Hello there! Follow me [@linesofcode](https://twitter.com/linesofcode) or visit [linesofcode.dev](https://linesofcode.dev) for more cool projects like this one.

## 🚀 Getting started

First, modify your `.env` file to include a new environment variable: `NEXT_PROTECT_PASSWORD="password-goes-here"`.

Next we need to instantiate the `NextProtect` class. This instance provides the core functionality of the package. Create a new file `src/app/api/next-protect/index.ts` and export the `NextProtect` class.

```ts
/* src/app/api/next-protect/index.ts */
import { NextProtect } from 'next-protect/server';

export const np = new NextProtect();
```

Now we need to expose a `POST` route to our Next.js app. Create a new file `src/app/api/next-protect/route.ts` and export the `POST` method.

```ts
/* src/app/api/next-protect/route.ts */
import { NextRequest } from 'next/server';
import { np } from '.';

export const POST = (req: NextRequest) => np.POST(req);
```

The server-side code is now ready to go, but we still need to render a password form to the user and protect the page.

Create a `src/middleware.ts` file and export the `middleware` function. This middleware will be called before every request to your app, checks if the user is authenticated, and redirects them into the app or to a login page.

```ts
/* src/middleware.ts */
import { NextRequest } from 'next/server';
import { np } from './app/api/next-protect';

export const middleware = async (req: NextRequest) => np.middleware(req);
```

The final step is to create a Next.js page that will render a password form to the user.

Create a `src/app/next-protect/page.tsx` file and simply re-export the `NextProtect` component.

```tsx
/* src/app/next-protect/page.tsx */
import 'next-protect/styles.css';
import { NextProtect } from 'next-protect/react';

const Page = () => <NextProtect />;

export default Page;
```

Done! Now open your browser and navigate to `http://localhost:3000`. You will be redirected to a password form. After entering the correct password, you will be granted access to the entire app. Simple as that! Now you can clear your cookies and refresh the page to see the password form again.

> 🙌 Want to see a fully working codebase? Check out the [NextJS example](./examples/nextjs-example/) or view the [Demo](https://next-protect.vercel.app/).

## 💪 Advanced usage

### Server side rendering (without middleware)

If you are using React Server Components (RSC), you can call `await np.isProtected()` in your `async` React component to check if the user is authenticated.

> ❗ Important note: just because a layout component is protected does not mean that its child pages are protected.

```tsx
/* src/app/page.tsx */
import 'next-protect/styles.css';
import { NextProtect } from 'next-protect/react';

const Page = async () => {
  const isProtected = await np.isProtected();

  return (
    <NextProtect isProtected={isProtected}>
      <p>This content is only visible to authenticated users.</p>
    </NextProtect>
  );
};
```

### Client side rendering (without middleware)

If you are using React Client Components, simply render a `NextProtect` component without any props. Internally the logic will fall-back to sending a request to `/api/next-protect` to check if the user is authenticated.

```tsx
/* src/app/page.tsx */
import 'next-protect/styles.css';
import { NextProtect } from 'next-protect/react';

const Page = () => {
  return (
    <NextProtect>
      <p>This content is only visible to authenticated users.</p>
    </NextProtect>
  );
};

export default Page;
```

### Multiple Passwords

You can configure multiple passwords to be used for authentication by passing an array of passwords to the `NextProtect` component.

```ts
/* src/app/api/next-protect/index.ts */
import { NextProtect } from 'next-protect/server';

export const np = new NextProtect({
  password: ['password', 'another-password'],
});
```

### Customizing and Styling the Form

The `NextProtect` component accepts a number of props that allow you to customize the form. Here are some examples:

```tsx
/* src/app/next-protect/page.tsx */
import 'next-protect/styles.css';
import { NextProtect } from 'next-protect/react';

const Page = () => (
  <NextProtect
    slotProps={{
      passwordInput: {
        placeholder: 'The password is password',
      },
    }}
    header={<h1>Custom Header</h1>}
    footer={<p>Custom Footer</p>}
  />
);

export default Page;
```

### Custom redirects and rewrites

You can customize the redirect and rewrite behavior of the `NextProtect` component by passing the following options to the `NextProtect` constructor.

- `redirectTo`: Redirect the user to a specific URL.
- `rewriteTo`: Rewrite the URL to a specific URL.

```ts
/* src/app/api/next-protect/index.ts */
import { NextProtect } from 'next-protect/server';

export const np = new NextProtect({
  redirectTo: '/dashboard',
});
```

### Custom API endpoint

By default, the `NextProtect` component will use the `/api/next-protect` endpoint to check if the user is authenticated. You can customize this endpoint by passing the `api` prop to the `NextProtect` component.

```ts
/* src/app/api/next-protect/index.ts */
import { NextProtect } from 'next-protect/server';

export const np = new NextProtect({
  api: '/api/my-custom-endpoint',
});
```

```tsx
/* src/app/next-protect/page.tsx */
import 'next-protect/styles.css';
import { NextProtect } from 'next-protect/react';

const Page = () => <NextProtect api="/api/my-custom-endpoint" />;

export default Page;
```

## 📚 TSDoc

<!-- TSDOC_START -->

## :toolbox: Functions

- [NextProtect](#gear-nextprotect)
- [NextProtectForm](#gear-nextprotectform)
- [useNextProtect](#gear-usenextprotect)

### :gear: NextProtect

| Function      | Type                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NextProtect` | `(props: NextProtectProps) => string or number or bigint or boolean or Iterable<ReactNode> or Promise<AwaitedReactNode> or Element or null or undefined` |

### :gear: NextProtectForm

| Function          | Type                                       |
| ----------------- | ------------------------------------------ |
| `NextProtectForm` | `(props: NextProtectFormProps) => Element` |

### :gear: useNextProtect

| Function         | Type                                                                      |
| ---------------- | ------------------------------------------------------------------------- |
| `useNextProtect` | `(props: NextProtectHookProps) => { isProtected: boolean or undefined; }` |

## :wrench: Constants

- [defaultOptions](#gear-defaultoptions)
- [defaultNextProtectEndpoint](#gear-defaultnextprotectendpoint)

### :gear: defaultOptions

| Constant         | Type                 |
| ---------------- | -------------------- |
| `defaultOptions` | `NextProtectOptions` |

### :gear: defaultNextProtectEndpoint

| Constant                     | Type                  |
| ---------------------------- | --------------------- |
| `defaultNextProtectEndpoint` | `"/api/next-protect"` |

## :factory: NextProtect

### Methods

- [isProtected](#gear-isprotected)
- [middleware](#gear-middleware)
- [GET](#gear-get)
- [POST](#gear-post)

#### :gear: isProtected

| Method        | Type                     |
| ------------- | ------------------------ |
| `isProtected` | `() => Promise<boolean>` |

#### :gear: middleware

| Method       | Type                                               |
| ------------ | -------------------------------------------------- |
| `middleware` | `(req: Request) => Promise<NextResponse<unknown>>` |

#### :gear: GET

| Method | Type                                                                               |
| ------ | ---------------------------------------------------------------------------------- |
| `GET`  | `(req?: Request or undefined) => Promise<NextResponse<{ isProtected: boolean; }>>` |

#### :gear: POST

| Method | Type                                               |
| ------ | -------------------------------------------------- |
| `POST` | `(req: Request) => Promise<NextResponse<unknown>>` |

<!-- TSDOC_END -->
