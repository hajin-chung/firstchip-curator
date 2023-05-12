import type { Component } from "solid-js";

export const KakaoLoginButton: Component = () => {
  const handleClick = () => {
    if (window) {
      const REDIRECT_URI = import.meta.env.PUBLIC_KAKAO_REDIRECT_URL;
      const REST_API_KEY = import.meta.env.PUBLIC_KAKAO_REST_API_KEY;
      window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    }
  };

  return (
    <button
      class="w-full text-lg font-bold border-yellow-kakao border-2 rounded-lg text-center py-1 hover:bg-yellow-kakao transition"
      onClick={handleClick}
    >
      카카오로 시작하기
    </button>
  );
};
