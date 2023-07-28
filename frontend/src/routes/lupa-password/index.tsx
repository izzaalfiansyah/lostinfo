import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import AuthTitle from "~/components/auth-title";
import Button from "~/components/button";
import Card from "~/components/card";
import Input from "~/components/input";
import { useNotif } from "~/contexts/notif";
import http from "~/libs/http";

export default function () {
  const [req, setReq] = createStore({
    email: "",
  });
  const [isLoading, setIsLoading] = createSignal(false);
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
          <AuthTitle title="Lupa Password" />
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
              {isLoading() ? "Menunggu..." : "Reset Password"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
