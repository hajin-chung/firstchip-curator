import type { ArtStatus } from "@db/schema";
import { artStatusToMessage } from "@lib/utils";
import type { Component } from "solid-js";

type Props = {
  status: ArtStatus | null;
};

export const ArtStatusBadge: Component<Props> = ({ status }) => {
  return (
    <div
      class="p-0.5 text-white text-sm rounded-lg border-2 border-opacity-60 bg-opacity-70"
      classList={{
        "bg-green-600 border-green-600": status === "SALE",
        "bg-blue-600 border-blue-600": status === "PREPARE",
        "bg-red-500 border-red-500": status === "SOLD",
      }}
    >
      {status && artStatusToMessage(status)}
    </div>
  );
};
