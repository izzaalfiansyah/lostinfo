import { $, component$, useContext, useStore } from "@builder.io/qwik";
import { type DocumentHead, Link, useNavigate } from "@builder.io/qwik-city";
import { AuthContext } from "~/contexts/auth";
import { NotifContext } from "~/contexts/notif";
import type User from "~/interfaces/user";
import http from "~/libs/http";

export default component$(() => {
  const req = useStore<{
    username?: string;
    password?: string;
  }>({
    username: "",
    password: "",
  });
  const nav = useNavigate();
  const notif = useContext(NotifContext);
  const auth = useContext(AuthContext);

  const nullable = $(() => {
    req.username = "";
    req.password = "";
  });

  const login = $(async () => {
    try {
      const res = await http.post("/login", req);
      const item = res.data.data as User;
      auth.value = item;
      nav("/");
      nullable();
      notif.show("berhasil login");
    } catch (e: any) {
      notif.show(e.response.data.message, "bg-red-500");
    }
  });

  return (
    <form
      preventdefault:submit
      onSubmit$={login}
      class="bg-white p-5 rounded-lg shadow-sm py-10"
    >
      <div class="mb-5">
        <div class="font-semibold text-lg">Login</div>
      </div>
      <div class="mb-2">
        <label for="">Username atau Email</label>
        <input
          type="text"
          class="t-input"
          placeholder="Masukkan Username"
          value={req.username}
          onChange$={(e) => (req.username = e.target.value)}
        />
      </div>
      <div class="mb-2">
        <label for="">Password</label>
        <input
          type="password"
          class="t-input"
          placeholder="********"
          required
          value={req.password}
          onChange$={(e) => (req.password = e.target.value)}
        />
      </div>
      <div class="text-center text-sm mt-3">
        Belum punya akun? register di{" "}
        <Link href="/register" class="text-purple-500">
          sini
        </Link>
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
});

export const head: DocumentHead = {
  title: "Login",
};
