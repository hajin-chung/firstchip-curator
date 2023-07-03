import { init } from "@paralleldrive/cuid2";
import type { ArtStatus } from "./type";

export const createId = init({ length: 10 });

export const jsonToUrlEncoded = (body: { [key: string]: string }) => {
  let formBody: string[] = [];
  Object.keys(body).forEach((key) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(body[key]);
    formBody.push(`${encodedKey}=${encodedValue}`);
  });
  return formBody.join("&");
};

export function toISOLocal(adate: Date) {
  // var localdt = new Date(adate.valueOf() - adate.getTimezoneOffset() * 60000);
  return adate.toISOString().slice(0, -1);
}

export function artStatusToMessage(status: ArtStatus) {
  if (status === "PREPARE") return "준비중";
  else if (status === "SALE") return "판매중";
  else if (status === "SOLD") return "판매 완료";
}