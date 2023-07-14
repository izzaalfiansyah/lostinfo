import { JSX, createSignal } from "solid-js";
import AuthProvider from "~/contexts/auth";
import Admin from "./admin";
import Auth from "./auth";
import { Dynamic } from "solid-js/web";
import User from "~/interfaces/user";
import NotifProvider from "~/contexts/notif";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [auth, setAuth] = createSignal<User>({});

  return (
    <>
      <AuthProvider value={[auth, setAuth]}>
        <NotifProvider>
          <Dynamic component={auth() ? Admin : Auth}>{props.children}</Dynamic>
        </NotifProvider>
      </AuthProvider>
    </>
  );
}
