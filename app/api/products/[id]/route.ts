import { NextRequest, NextResponse } from 'next/server';

async function proxyRequest(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body =
      request.method === 'GET' || request.method === 'DELETE'
        ? undefined
        : await request.json().catch(() => ({}));

    const response = await fetch(`${apiUrl}/api/products/${params.id}`, {
      method: request.method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return proxyRequest(request, { params });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return proxyRequest(request, { params });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return proxyRequest(request, { params });
}
