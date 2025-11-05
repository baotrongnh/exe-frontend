import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // OAuth thành công, redirect based on user role
      const role = data.user.user_metadata?.role;

      if (role === 'employer') {
        return NextResponse.redirect(`${origin}/employer/dashboard`);
      } else {
        return NextResponse.redirect(`${origin}/find-jobs`);
      }
    }
  }

  // OAuth thất bại, redirect về trang login với error
  return NextResponse.redirect(`${origin}/login?error=authentication_failed`);
}
