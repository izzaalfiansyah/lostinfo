import { JSX, createSignal } from "solid-js";
import AuthProvider from "~/contexts/auth";
import Admin from "./admin";
import Auth from "./auth";
import { Dynamic } from "solid-js/web";
import User from "~/interfaces/user";
import NotifProvider from "~/contexts/notif";
import DialogImgProvider from "~/contexts/dialog-img";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [auth, setAuth] = createSignal<User>({});

  return (
    <>
      <AuthProvider value={[auth, setAuth]}>
        <NotifProvider>
          <DialogImgProvider>
            <Dynamic component={auth()?.id ? Admin : Auth}>
              {props.children}
            </Dynamic>
          </DialogImgProvider>
        </NotifProvider>
      </AuthProvider>
    </>
  );
}
