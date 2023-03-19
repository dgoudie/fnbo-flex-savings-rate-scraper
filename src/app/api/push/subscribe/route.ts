import { NextRequest, NextResponse } from 'next/server';

import prisma from '../../../../../database/prisma';

export async function POST(req: NextRequest) {
  const { subscriptionBase64, email } = await req.json();
  const registrationForEmail = await prisma.registration.findFirst({
    where: { email },
  });
  if (!registrationForEmail) {
    await prisma.registration.create({
      data: { subscription: subscriptionBase64, email },
    });
  } else {
    await prisma.registration.update({
      where: { id: registrationForEmail.id },
      data: { subscription: subscriptionBase64 },
    });
  }
  return new NextResponse();
}
