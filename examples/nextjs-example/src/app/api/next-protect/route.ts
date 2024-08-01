import { NextRequest } from 'next/server';
import { np } from '.';

export const POST = (req: NextRequest) => np.POST(req);

export const GET = (req: NextRequest) => np.GET(req);
