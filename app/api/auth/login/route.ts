import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

interface SupabaseUser {
  id: string;
  email: string;
  password?: string;
  names: string;
  phone?: string | null;
  role: string;
  status: string;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  try {
    let body: LoginBody;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json({ error: 'Cuerpo de la petición inválido' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Configuración de base de datos ausente' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: users, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (dbError) {
      return NextResponse.json({ error: 'Error conectando a la base de datos' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = users[0] as SupabaseUser;

    if (user.status !== 'ACTIVO') {
      return NextResponse.json({ error: 'La cuenta de usuario está inactiva' }, { status: 403 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Error de integridad: Usuario sin contraseña' }, { status: 500 });
    }

    const storedPassword = user.password;
    let isPasswordValid = false;

    const isBcryptHash = /^\$2[abyx]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/.test(storedPassword) || storedPassword.startsWith('$2');

    if (isBcryptHash) {
      isPasswordValid = await bcrypt.compare(password, storedPassword);
    } else {
      isPasswordValid = password === storedPassword;
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;

    // Actualizar el último acceso de forma asíncrona
    supabase.from('users').update({ lastLogin: new Date().toISOString() }).eq('id', safeUser.id).then();

    // ==========================================
    // ¡EL CAMBIO CLAVE AQUÍ!
    // Generamos un token (usando su id) para que el middleware/dashboard de tu app
    // lo reconozca, te valide la sesión y te deje entrar al panel.
    // ==========================================
    const fakeToken = `session_user_${safeUser.id}`;

    return NextResponse.json(
      { 
        message: 'Autenticación exitosa', 
        token: fakeToken, // <--- Enviamos el token que tu frontend y guardado esperan
        user: safeUser 
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}