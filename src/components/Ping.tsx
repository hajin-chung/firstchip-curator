import { client } from "@lib/client";
import { createSignal, type Component, onMount } from "solid-js";

export const Ping: Component = () => {
  const [message, setMessage] = createSignal("no message");
  const [privateMessage, setPrivateMessage] =
    createSignal("no private message");

  onMount(async () => {
    const newMessage = await client.ping.query();
    setMessage(newMessage);
    try {
      const newPrivate = await client.private.query();
      setPrivateMessage(newPrivate);
    } catch (e) {
      setPrivateMessage("error");
    }
  });

  return (
    <div>
      <p>{message()}</p>
      <p>{privateMessage()}</p>
    </div>
  );
};
