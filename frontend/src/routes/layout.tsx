import {
  $,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { AuthContext } from "~/contexts/auth";
import Notif, { NotifContext } from "~/contexts/notif";
import type User from "~/interfaces/user";
import Admin from "~/layouts/admin";
import Auth from "~/layouts/auth";

export default component$(() => {
  const location = useLocation();
  const nav = useNavigate();
  const isLoading = useSignal<boolean>(false);

  const notif = useStore({
    show: false,
    message: "",
    color: "bg-purple-500",
  });

  const auth = useSignal<User | undefined | 0>();

  useContextProvider(AuthContext, auth);

  useContextProvider(NotifContext, {
    show: $((message: string, color: string = "bg-purple-500") => {
      notif.show = true;
      notif.message = message;
      notif.color = color;

      setTimeout(() => {
        notif.show = false;
      }, 3000);
    }),
  });

  useVisibleTask$(({ track }) => {
    track(() => auth.value);

    if (auth.value == 0) {
      localStorage.removeItem("auth");
    }

    const authStorage = localStorage.getItem("auth");
    // isLoading.value = true;

    if (authStorage && !auth.value) {
      const authUser = JSON.parse(authStorage);
      auth.value = authUser;
      if (
        location.url.pathname == "/login/" ||
        location.url.pathname == "/register/"
      ) {
        nav("/");
      }
    }

    if (auth.value) {
      localStorage.setItem("auth", JSON.stringify(auth.value));
    }

    if (location.url.pathname == "/") {
      if (!auth.value) {
        nav("/login");
      }
    }

    setTimeout(() => {
      isLoading.value = false;
    }, 800);
  });

  return (
    <>
      {isLoading.value && (
        <div class="fixed top-0 left-0 right-0 bottom-0 z-[100] bg-white flex items-center justify-center space-x-4">
          <div class="animate animate-pulse rounded-full p-2 bg-purple-600"></div>
          <div class="animate animate-pulse rounded-full p-2 bg-purple-600"></div>
          <div class="animate animate-pulse rounded-full p-2 bg-purple-600"></div>
        </div>
      )}
      <Notif {...notif} />
      {auth.value ? (
        <Admin>
          <Slot />
        </Admin>
      ) : (
        <Auth>
          <Slot />
        </Auth>
      )}
    </>
  );
});
