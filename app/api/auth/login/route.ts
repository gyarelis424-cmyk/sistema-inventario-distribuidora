import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Interfaz adaptada EXACTAMENTE a tu esquema SQL
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
    // 1. Parseo seguro del Body
    let body: LoginBody;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[Auth Login] Error parseando JSON:', parseError);
      return NextResponse.json({ error: 'Cuerpo de la petición inválido' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 });
    }

    // 2. Validación estricta de Variables de Entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[Auth Login] FALTAN VARIABLES DE ENTORNO: Verifica tu archivo .env.local');
      return NextResponse.json({ error: 'Configuración de base de datos ausente' }, { status: 500 });
    }

    // Prevenir crash por URL malformada
    try {
      new URL(supabaseUrl);
    } catch (e) {
      console.error('[Auth Login] LA URL DE SUPABASE ES INVÁLIDA:', supabaseUrl);
      return NextResponse.json({ error: 'Configuración de base de datos incorrecta' }, { status: 500 });
    }

    // 3. Inicialización del cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 4. Consulta a la tabla 'users'
    const { data: users, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (dbError) {
      console.error('[Auth Login] Error de base de datos:', dbError.message, dbError.details);
      return NextResponse.json({ error: 'Error conectando a la base de datos' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const user = users[0] as SupabaseUser;

    // 5. Verificación del estado del usuario según tu esquema SQL
    if (user.status !== 'ACTIVO') {
      console.warn(`[Auth Login] Intento de acceso de usuario no activo: ${email} (Status: ${user.status})`);
      return NextResponse.json({ error: 'La cuenta de usuario está inactiva o suspendida' }, { status: 403 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Error de integridad: Usuario sin contraseña' }, { status: 500 });
    }

    const storedPassword = user.password;
    let isPasswordValid = false;

    // 6. Verificación de Contraseña (Híbrida)
    const isBcryptHash = /^\$2[abyx]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/.test(storedPassword) || storedPassword.startsWith('$2');

    if (isBcryptHash) {
      isPasswordValid = await bcrypt.compare(password, storedPassword);
    } else {
      isPasswordValid = password === storedPassword;
    }

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // 7. Éxito: Preparar objeto de usuario seguro (sin el password)
    const { password: _, ...safeUser } = user;

    // (Opcional) Actualizar el lastLogin
    // Esto se ejecuta de forma asíncrona en segundo plano para no demorar la respuesta
    supabase.from('users').update({ lastLogin: new Date().toISOString() }).eq('id', safeUser.id).then();

    return NextResponse.json(
      { 
        message: 'Autenticación exitosa', 
        user: safeUser 
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('[Auth Login] Excepción global:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno desconocido';
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}