import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "solid-start";
import Button from "~/components/button";
import Card from "~/components/card";
import Input from "~/components/input";
import { useAuth } from "~/contexts/auth";
import { useNotif } from "~/contexts/notif";
import User from "~/interfaces/user";
import http from "~/libs/http";

export default function () {
  const [req, setReq] = createStore({
    email: "",
  });
  const [isLoading, setIsLoading] = createSignal(false);

  const nav = useNavigate();
  const [auth, authFn] = useAuth();
  const notif = useNotif();

  const nullable = () => {
    setReq("email", "");
  };

  const resetPassword = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await http.post("/user/reset-password", req);
      notif.show("Link reset password berhasil terkirim");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  return (
    <div class="max-w-full w-[500px]">
      <Card class="py-10 rounded-xl">
        <form onSubmit={resetPassword}>
          <div class="mb-5">
            <div class="font-semibold text-lg">Reset Password</div>
          </div>
          <Input
            placeholder="Masukkan Email Anda"
            type="email"
            required
            value={req.email}
            disabled={isLoading()}
            onChange={(e) => setReq("email", e.currentTarget.value)}
          />
          <div>
            Kami akan mengirimkan mengirimkan link untuk melakukan reset
            password ke email aktif anda.
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
        </form>
      </Card>
    </div>
  );
}
