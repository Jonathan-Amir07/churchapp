import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // Clear the cookies
  response.cookies.delete('ACCESS_TOKEN');
  response.cookies.delete('MOCK_USER_ROLE');
  response.cookies.delete('HAS_CHANGED_PASSWORD');
  
  return response;
}
