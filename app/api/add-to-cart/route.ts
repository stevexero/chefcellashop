import { NextResponse } from 'next/server';
import { addItemToCartAction } from '@/app/lib/actions';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await addItemToCartAction(formData);

  console.log(result);

  //   if ('error' in result) {
  //     return NextResponse.json({ error: result.error }, { status: 500 });
  //   }

  return NextResponse.json(result);
}
