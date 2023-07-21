import { onMount } from "solid-js";
import { useNavigate } from "solid-start";

export default function () {
  const nav = useNavigate();

  onMount(() => {
    nav("/login", { replace: true });
  });

  return <></>;
}
