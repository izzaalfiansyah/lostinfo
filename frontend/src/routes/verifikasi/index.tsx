import { createEffect, createSignal, onMount } from "solid-js";
import Button from "~/components/button";
import Card from "~/components/card";
import { useAuth } from "~/contexts/auth";
import { useNotif } from "~/contexts/notif";
import http from "~/libs/http";

export default function () {
  const [isLoading, setIsLoading] = createSignal(false);

  const [auth, setAuth] = useAuth();
  const notif = useNotif();

  const getUser = async () => {
    try {
      const { data } = await http.get("/user/" + auth()?.id);
      if (data.data.status == "1") {
        setAuth.login(data.data);
      }
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const sendVerification = async () => {
    setIsLoading(true);
    try {
      await http.post("/user/verifikasi/" + auth()?.id);
      notif.show("Email verifikasi terkirim. Periksa email anda!");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  createEffect(() => {
    if (auth()?.id) {
      getUser();
    }
  });

  return (
    <div class="max-w-full w-[500px]">
      <Card class="py-10 rounded-xl">
        <div class="mb-5">
          <div class="font-semibold text-lg">Verifikasi Akun</div>
        </div>

        <p>
          Kami telah mengirimkan link verifikasi akun. Periksa email anda! Klik
          tombol di bawah untuk kirim ulang verifikasi apabila tidak ada email
          terbaru dari kami.
        </p>

        <div class="mt-10">
          <Button
            onClick={sendVerification}
            disabled={isLoading()}
            type="submit"
            variant="primary"
            class="w-full"
          >
            {isLoading() ? "Menunggu..." : "Kirim Ulang"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
