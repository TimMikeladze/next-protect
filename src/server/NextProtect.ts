import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verify, sign } from './jwt';

export interface NextProtectOptions {
  api?: string;
  cookieMaxAge?: number;
  cookieName?: string;
  cookieSameSite?: boolean | 'lax' | 'none' | 'strict';
  cookieSecure?: boolean;
  domain?: string;

  page?: string;
  password?: string | string[];

  redirectTo?: string;
  rewriteTo?: string;
}

export const defaultOptions: NextProtectOptions = {
  cookieName: 'next-protect',
  page: '/next-protect',
  api: '/api/next-protect',
};

export class NextProtect {
  private readonly options: NextProtectOptions;

  private passwords: string[];

  constructor(options: NextProtectOptions = {}) {
    this.options = {
      ...defaultOptions,
      password: (options.password ||
        process.env.NEXT_PROTECT_PASSWORD) as string,
      ...options,
    };

    this.passwords = (
      Array.isArray(this.options.password)
        ? this.options.password
        : [this.options.password]
    ) as string[];
  }

  /**
   *
   * @returns true if the user has not authenticated
   */
  public async isProtected(): Promise<boolean> {
    const cookieStore = cookies();

    const cookieName = this.options.cookieName as string;

    const cookie = cookieStore.get(cookieName);

    if (!cookie?.value) {
      return true;
    }

    try {
      await verify(cookie?.value as string, this.passwords.join());
      return false;
    } catch (e) {
      return true;
    }
  }

  // eslint-disable-next-line consistent-return, @typescript-eslint/no-unused-vars
  public async middleware(req: Request) {
    const { origin, pathname } = (req as NextRequest).nextUrl;
    if (await this.isProtected()) {
      if (pathname === this.options.page) {
        return NextResponse.next();
      }
      if (pathname === this.options.api) {
        return NextResponse.next();
      }
      const path = [origin, this.options.page].join('');
      console.log((req as NextRequest).nextUrl);
      console.log('redirecting to 1', path);
      return NextResponse.redirect(path);
    }
    if (pathname === this.options.page) {
      const path = [origin, '/'].join('');
      console.log('redirecting to 2', path);
      return NextResponse.redirect(path);
    }

    return NextResponse.next();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async GET(req?: Request) {
    return NextResponse.json(
      {
        isProtected: await this.isProtected(),
      },
      { status: 200 }
    );
  }

  public async POST(req: Request) {
    if (!this.passwords.length) {
      return NextResponse.json(
        {
          error:
            'NEXT_PROTECT_PASSWORD or NextProtect.options.password is missing.',
        },
        { status: 400 }
      );
    }
    const body = await req.formData();
    const password = body.get('password') as string;

    if (!password) {
      return NextResponse.json(
        { error: 'No password provided' },
        { status: 400 }
      );
    }

    const { origin } = (req as NextRequest).nextUrl;

    const cookieStore = cookies();

    const name = this.options.cookieName as string;

    const foundMatch = this.passwords.some((x) => x === password);

    if (foundMatch) {
      const value = await sign({}, this.passwords.join());

      cookieStore.set({
        value,
        name,
        domain: this.options.domain,
        httpOnly: true,
        sameSite: this.options.cookieSameSite || false,
        secure:
          this.options.cookieSecure !== undefined
            ? this.options.cookieSecure
            : process.env.NODE_ENV === 'production',
        path: '/',
        ...(this.options.cookieMaxAge
          ? {
              maxAge: this.options.cookieMaxAge,
            }
          : {}),
      });

      if (this.options.rewriteTo) {
        console.log(
          'rewriteTo',
          this.options.rewriteTo?.startsWith('http')
            ? this.options.rewriteTo
            : [origin, this.options.rewriteTo].join('')
        );
        return NextResponse.rewrite(
          this.options.rewriteTo?.startsWith('http')
            ? this.options.rewriteTo
            : [origin, this.options.rewriteTo].join('')
        );
      }
      if (this.options.redirectTo) {
        console.log(
          'redirectTo',
          this.options.redirectTo?.startsWith('http')
            ? this.options.redirectTo
            : [origin, this.options.redirectTo].join('')
        );
        return NextResponse.redirect(
          this.options.redirectTo?.startsWith('http')
            ? this.options.redirectTo
            : [origin, this.options.redirectTo].join('')
        );
      }

      console.log('redirecting to 3', origin);

      return NextResponse.redirect(origin);
    }

    console.log('redirecting to 4', `${origin}?error=Invalid`);

    return NextResponse.redirect(`${origin}?error=Invalid`);
  }
}
