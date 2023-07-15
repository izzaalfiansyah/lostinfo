import { JSX, onMount } from "solid-js";
import { useNavigate } from "solid-start";
import { useAuth } from "~/contexts/auth";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [auth] = useAuth();
  const nav = useNavigate();

  onMount(() => {
    if (auth()) {
      nav("/");
    }
  });

  return (
    <div class="bg-gray-100 min-h-screen overflow-x-hidden flex items-center justify-center p-5">
      <div class="max-w-full w-[500px]">
        <div class="text-3xl font-semibold mb-8 text-center">
          LostInfo<span class="text-purple-500">.</span>
        </div>
        {props.children}
      </div>
    </div>
  );
}
