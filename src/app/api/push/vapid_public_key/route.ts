export async function GET() {
  return fetch(`${process.env.NOTIFICATION_HOST}/vapid_public_key`);
}

export const config = {
  runtime: 'edge',
};
