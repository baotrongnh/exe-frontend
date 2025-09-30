import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Nếu next được truyền qua query params, sử dụng nó; ngược lại redirect về dashboard hoặc home
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // OAuth thành công, redirect về trang mong muốn
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // OAuth thất bại, redirect về trang login với error
  return NextResponse.redirect(`${origin}/login?error=authentication_failed`);
}
