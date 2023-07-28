import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "solid-start";
import AuthTitle from "~/components/auth-title";
import Button from "~/components/button";
import Card from "~/components/card";
import Input from "~/components/input";
import { useAuth } from "~/contexts/auth";
import { useNotif } from "~/contexts/notif";
import User from "~/interfaces/user";
import http from "~/libs/http";

export default function () {
  const [req, setReq] = createStore({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = createSignal(false);

  const nav = useNavigate();
  const [auth, authFn] = useAuth();
  const notif = useNotif();

  const nullable = () => {
    setReq("username", "");
    setReq("password", "");
  };

  const login = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await http.post("/login", req);
      const item = data.data as User;

      if (item.status == "1") {
        notif.show("berhasil login");
      } else if (item.status == "9") {
        notif.show(
          "Upss.. akun anda ter-banned. Silahkan hubungi admin",
          false
        );
        setIsLoading(false);
        return null;
      }

      nav("/");
      nullable();
      authFn.login(item);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div class="max-w-full w-[500px]">
        <Card class="py-10 rounded-xl">
          <form onSubmit={login}>
            <AuthTitle title="Login" />
            <Input
              label="Username atau Email"
              placeholder="Masukkan Username atau Email"
              required
              value={req.username}
              disabled={isLoading()}
              onChange={(e) => setReq("username", e.currentTarget.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="********"
              required
              value={req.password}
              disabled={isLoading()}
              onChange={(e) => setReq("password", e.currentTarget.value)}
            />
            <div class="flex justify-end">
              <A href="/lupa-password" class="text-primary">
                Lupa password?
              </A>
            </div>
            <div class="mt-10">
              <Button
                type="submit"
                disabled={isLoading()}
                variant="primary"
                class="w-full"
              >
                {isLoading() ? "Menunggu..." : "Masuk"}
              </Button>
            </div>
            <div class="text-center mt-5">
              Belum punya akun? register di{" "}
              <A href="/register" class="text-primary">
                sini
              </A>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
