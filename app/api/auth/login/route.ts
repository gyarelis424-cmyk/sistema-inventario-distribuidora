import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Interfaces estrictas para tipado
interface LoginBody {
  email?: string;
  password?: string;
}

interface SupabaseUser {
  id: string;
  email: string;
  password?: string; // Columna en tu tabla 'users'
  [key: string]: any; // Otros campos que puedas tener
}

export async function POST(request: NextRequest) {
  try {
    // 1. Prevención de "Unexpected end of JSON input"
    let body: LoginBody;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('[Auth Login] Error parseando JSON del request:', parseError);
      return NextResponse.json(
        { error: 'Cuerpo de la petición inválido o ausente' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // 2. Validación de datos faltantes (Error 400)
    if (!email || !password) {
      console.warn('[Auth Login] Intento de login rechazado: Email o password faltantes');
      return NextResponse.json(
        { error: 'Email y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    // 3. Inicialización segura del cliente Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    // Preferiblemente usar la Service Role Key para hacer bypass de RLS en el backend,
    // o la Anon Key si tus políticas de RLS permiten leer por email.
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[Auth Login] Variables de entorno de Supabase no configuradas');
      return NextResponse.json(
        { error: 'Error interno de configuración del servidor' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 4 & 5. Consulta directa a la base de datos a la tabla 'users'
    console.log(`[Auth Login] Buscando usuario con email: ${email}`);
    const { data: users, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    // Manejo de error interno de Supabase
    if (dbError) {
      console.error('[Auth Login] Error de base de datos:', dbError.message);
      return NextResponse.json(
        { error: 'Error interno conectando a la base de datos' },
        { status: 500 }
      );
    }

    // 6. Verificar si el usuario existe (Error 404)
    if (!users || users.length === 0) {
      console.warn(`[Auth Login] Usuario no encontrado para el email: ${email}`);
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const user = users[0] as SupabaseUser;

    if (!user.password) {
      console.error(`[Auth Login] El usuario ${email} no tiene una contraseña registrada en la BD`);
      return NextResponse.json(
        { error: 'Error de integridad en los datos del usuario' },
        { status: 500 }
      );
    }

    const storedPassword = user.password;
    let isPasswordValid = false;

    // 7. Detección automática y Verificación de la contraseña
    // Los hashes de bcrypt siempre comienzan con $2a$, $2b$, $2x$ o $2y$ y tienen 60 caracteres.
    const isBcryptHash = /^\$2[abyx]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/.test(storedPassword) || storedPassword.startsWith('$2');

    if (isBcryptHash) {
      console.log(`[Auth Login] Contraseña en formato bcrypt detectada para ${email}`);
      isPasswordValid = await bcrypt.compare(password, storedPassword);
    } else {
      console.log(`[Auth Login] Contraseña en texto plano detectada para ${email}. Comparando...`);
      // Comparación estricta para texto plano
      isPasswordValid = password === storedPassword;
    }

    if (!isPasswordValid) {
      console.warn(`[Auth Login] Credenciales inválidas (contraseña incorrecta) para: ${email}`);
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // 8. Éxito: Limpiar los datos sensibles antes de enviarlos al cliente
    console.log(`[Auth Login] Autenticación exitosa para: ${email}`);
    const { password: _, ...safeUser } = user;

    // 9. Retorno de JSON válido
    return NextResponse.json(
      { 
        message: 'Autenticación exitosa', 
        user: safeUser 
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    
    console.error('[Auth Login] Excepción global no controlada:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error interno desconocido';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}