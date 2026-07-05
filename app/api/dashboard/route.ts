import { NextRequest, NextResponse } from 'next/server';

async function proxyRequest(request: NextRequest, path: string) {
  try {
    const token = request.cookies.get('token')?.value;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

    if (!apiUrl) {
      return NextResponse.json(
        { error: 'API URL not configured' },
        { status: 500 }
      );
    }

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let url = `${apiUrl}${path}`;
    const searchParams = request.nextUrl.searchParams;
    if (searchParams.size > 0) {
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      method: request.method,
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, '/api/dashboard/stats');
}
