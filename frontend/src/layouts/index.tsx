import { JSX, createSignal } from "solid-js";
import AuthProvider from "~/contexts/auth";
import Admin from "./admin";
import Auth from "./auth";
import { Dynamic } from "solid-js/web";
import UserInterface from "~/interfaces/user";
import NotifProvider from "~/contexts/notif";
import DialogImgProvider from "~/contexts/dialog-img";
import User from "./user";
import { useLocation } from "solid-start";
import Home from "./home";

export default function (props: JSX.HTMLAttributes<HTMLDivElement>) {
  const [auth, setAuth] = createSignal<UserInterface>({});

  const loc = useLocation();

  const getComponent = () => {
    if (loc.pathname == "/") {
      return Home;
    }

    if (auth()?.id) {
      if (auth()?.status == "0") {
        return Auth;
      }

      if (auth()?.role == "1") {
        return Admin;
      } else {
        return User;
      }
    } else {
      return Auth;
    }
  };

  return (
    <>
      <AuthProvider value={[auth, setAuth]}>
        <NotifProvider>
          <DialogImgProvider>
            <Dynamic component={getComponent()}>{props.children}</Dynamic>
          </DialogImgProvider>
        </NotifProvider>
      </AuthProvider>
    </>
  );
}
