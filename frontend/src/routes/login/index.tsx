import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "solid-start";
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

  const nav = useNavigate();
  const [auth, authFn] = useAuth();
  const notif = useNotif();

  const nullable = () => {
    setReq("username", "");
    setReq("password", "");
  };

  const login = async (e: SubmitEvent) => {
    e.preventDefault();

    try {
      const res = await http.post("/login", req);
      const item = res.data.data as User;
      nav("/");
      nullable();
      notif.show("berhasil login");
      authFn.login(item);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  return (
    <form onSubmit={login} class="bg-white p-5 rounded-lg shadow-sm py-10">
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
        <A href="/register" class="text-purple-500">
          sini
        </A>
      </div>
      <div class="mt-8">
        <button
          type="submit"
          class="bg-purple-500 text-white w-full p-2 rounded shadow-sm"
        >
          Masuk
        </button>
      </div>
    </form>
  );
}
