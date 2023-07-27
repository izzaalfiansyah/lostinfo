import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate, useParams } from "solid-start";
import Button from "~/components/button";
import Card from "~/components/card";
import Input from "~/components/input";
import { useNotif } from "~/contexts/notif";
import User from "~/interfaces/user";
import http from "~/libs/http";

export default function () {
  const [req, setReq] = createStore({
    username: "",
    password: "",
    konfirmasi_password: "",
  });
  const [isLoading, setIsLoading] = createSignal(false);

  const nav = useNavigate();
  const notif = useNotif();
  const params = useParams();

  const nullable = () => {
    setReq("password", "");
    setReq("konfirmasi_password", "");
  };

  const getUser = async () => {
    setIsLoading(true);
    try {
      const { data } = await http.get("/user/" + params.md5id + "/md5");
      setReq("username", data.data.username);
    } catch (e: any) {
      nav("/login", { replace: true });
    }
    setIsLoading(false);
  };

  const resetPassword = async (e: SubmitEvent) => {
    e.preventDefault();

    if (req.password != req.konfirmasi_password) {
      notif.show("konfirmasi password salah", false);
      return null;
    }

    setIsLoading(true);
    try {
      const md5id = params.md5id;
      const { data } = await http.post("/user/reset-password/" + md5id, req);

      notif.show("password anda berhasil direset");

      nav("/login", { replace: true });
      nullable();
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  onMount(async () => {
    await getUser();
  });

  return (
    <div class="max-w-full w-[500px]">
      <Card class="py-10 rounded-xl">
        <form onSubmit={resetPassword}>
          <div class="mb-5">
            <div class="font-semibold text-lg">Reset Password</div>
          </div>
          <div class="mb-5">Untuk user @{req.username}</div>
          <Input
            label="Password"
            placeholder="********"
            required
            type="password"
            value={req.password}
            disabled={isLoading()}
            onChange={(e) => setReq("password", e.currentTarget.value)}
          />
          <Input
            label="Konfirmasi Password"
            type="password"
            placeholder="********"
            required
            value={req.konfirmasi_password}
            disabled={isLoading()}
            onChange={(e) =>
              setReq("konfirmasi_password", e.currentTarget.value)
            }
          />
          <div class="mt-3">Pastikan anda selalu mengingat password anda.</div>
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
