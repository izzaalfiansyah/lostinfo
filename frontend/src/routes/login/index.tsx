import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "solid-start";
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
    <div class="max-w-full w-[500px]">
      <Card class="py-10">
        <form onSubmit={login}>
          <div class="mb-5">
            <div class="font-semibold text-lg">Login</div>
          </div>
          <Input
            label="Username"
            placeholder="Masukkan Username"
            required
            value={req.username}
            onChange={(e) => setReq("username", e.currentTarget.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="********"
            required
            value={req.password}
            onChange={(e) => setReq("password", e.currentTarget.value)}
          />
          <div class="text-center text-sm mt-3">
            Belum punya akun? register di{" "}
            <A href="/register" class="text-primary">
              sini
            </A>
          </div>
          <div class="mt-8">
            <button
              type="submit"
              class="bg-primary text-white w-full p-2 rounded shadow-sm"
            >
              Masuk
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
