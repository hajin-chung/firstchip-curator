import { authUser } from "@lib/server";
import { jsonToUrlEncoded } from "@lib/utils";
import type { APIRoute } from "astro";
import jwt_decode from "jwt-decode";

export const get: APIRoute = async ({ request, redirect }) => {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    if (code === null) {
      throw "code is null";
    }

    const tokenBody = {
      grant_type: "authorization_code",
      client_id: import.meta.env.PUBLIC_KAKAO_REST_API_KEY,
      redirect_uri: import.meta.env.PUBLIC_KAKAO_REDIRECT_URL,
      code,
    };

    const tokenRes = await (
      await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: jsonToUrlEncoded(tokenBody),
      })
    ).json();
    const jwtString = tokenRes.id_token as string | undefined;

    if (typeof jwtString !== "string") {
      throw "jwt string not string";
    }

    const { sub, nickname, email, picture } = jwt_decode(jwtString) as {
      sub: string;
      nickname: string;
      picture: string;
      email: string;
    };

    if (
      typeof sub !== "string" ||
      typeof picture !== "string" ||
      typeof nickname !== "string" ||
      typeof email !== "string"
    ) {
      throw "jwt object keys are not string";
    }

    const { sessionId, sessionExpires } = await authUser({
      name: nickname,
      email,
      sub,
      picture,
    });

    return new Response(null, {
      status: 307,
      headers: {
        "Set-Cookie": `session=${sessionId}; Expires=${sessionExpires.toUTCString()}; Path=/`,
        Location: "/",
      },
    });
  } catch (e) {
    console.error(e);
    return redirect(`/500?message=${e}`, 307);
  }
};
