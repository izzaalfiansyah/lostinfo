import { For, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "solid-start";
import Button from "~/components/button";
import Card from "~/components/card";
import Checkbox from "~/components/checkbox";
import FileInput from "~/components/file-input";
import Input from "~/components/input";
import Modal from "~/components/modal";
import Textarea from "~/components/textarea";
import { useNotif } from "~/contexts/notif";
import User from "~/interfaces/user";
import fileReader from "~/libs/file-reader";
import http from "~/libs/http";

interface ReqInterface extends User {
  konfirmasi_password?: string;
}

export default function () {
  const [req, setReq] = createStore<ReqInterface>({});
  const [showPassword, setShowPassword] = createSignal(false);
  const [showPrivacy, setShowPrivacy] = createSignal(false);
  const [isAgree, setIsAgree] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  const [privacy, setPrivacy] = createSignal<string[]>([]);

  const notif = useNotif();
  const nav = useNavigate();

  const getPrivacy = async () => {
    try {
      const { data } = await http.get("/privacy");
      setPrivacy(data.data);
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const handleKTPChange = async (e: any) => {
    const file = e.target.files[0];
    const value = await fileReader(file);

    setReq("ktp", value);
  };

  const store = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!isAgree()) {
      setShowPrivacy(true);
      return null;
    }

    if (req.password != req.konfirmasi_password) {
      notif.show("konfirmasi password salah", false);
      return null;
    }

    setIsLoading(true);
    try {
      setReq("role", "2");
      setReq("status", "0");

      await http.post("/user", req);
      notif.show(
        "Akun berhasil terdaftar. Periksa email anda untuk verifikasi akun!"
      );
      nav("/login");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
    setIsLoading(false);
  };

  onMount(() => {
    getPrivacy();
  });

  return (
    <div class="max-w-full w-[900px]">
      <Card class="py-10 rounded-xl">
        <form onSubmit={store}>
          <div class="mb-5">
            <div class="font-semibold text-lg">Register</div>
          </div>
          <div class="flex lg:flex-row flex-col gap-3">
            <div class="flex-1">
              <Input
                label="Nama"
                placeholder="Masukkan Nama"
                required
                value={req.nama}
                disabled={isLoading()}
                maxLength={255}
                onChange={(e) => setReq("nama", e.currentTarget.value)}
              />
              <Textarea
                label="Alamat"
                rows={3}
                placeholder="Masukkan Alamat"
                required
                value={req.alamat}
                disabled={isLoading()}
                onChange={(e) => setReq("alamat", e.currentTarget.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="Masukkan Email"
                required
                value={req.email}
                disabled={isLoading()}
                maxLength={255}
                onChange={(e) => setReq("email", e.currentTarget.value)}
              />
              <Input
                label="Telepon"
                type="tel"
                placeholder="Masukkan Telepon"
                required
                value={req.telepon}
                disabled={isLoading()}
                maxLength={255}
                onChange={(e) => setReq("telepon", e.currentTarget.value)}
              />
            </div>
            <div class="flex-1">
              <FileInput
                label="FotoKTP"
                title="Pilih Foto KTP"
                required
                disabled={isLoading()}
                maxLength={255}
                onChange={handleKTPChange}
              />
              <Input
                label="Username"
                maxlength={255}
                placeholder="Masukkan Username"
                required
                value={req.username}
                disabled={isLoading()}
                maxLength={255}
                onChange={(e) => setReq("username", e.currentTarget.value)}
              />
              <Input
                label="Password"
                type={showPassword() ? "text" : "password"}
                placeholder="*******"
                required
                value={req.password}
                disabled={isLoading()}
                maxLength={255}
                min={8}
                onChange={(e) => setReq("password", e.currentTarget.value)}
              />
              <Input
                label="Konfirmasi Password"
                type={showPassword() ? "text" : "password"}
                placeholder="*******"
                required
                value={req.konfirmasi_password}
                disabled={isLoading()}
                maxLength={255}
                min={8}
                onChange={(e) =>
                  setReq("konfirmasi_password", e.currentTarget.value)
                }
              />
              <Checkbox
                label="Tampilkan Password"
                onChange={(e) => setShowPassword(e.currentTarget.checked)}
              />
            </div>
          </div>
          <div class="lg:mt-3">
            <Checkbox
              checked={isAgree()}
              onChange={(e) => setIsAgree(e.currentTarget.checked)}
              label={
                <>
                  Saya mengerti dan setuju dengan syarat, ketentuan dan privasi.
                  Lihat{" "}
                  <button
                    class="text-primary"
                    type="button"
                    onClick={(e) => setShowPrivacy(true)}
                  >
                    Selengkapnya
                  </button>
                </>
              }
            />
          </div>
          <div class="mt-10">
            <Button
              disabled={isLoading()}
              type="submit"
              variant="primary"
              class="w-full"
            >
              {isLoading() ? "Menunggu..." : "Daftar"}
            </Button>
          </div>
          <div class="text-center mt-5">
            Sudah punya akun? login di{" "}
            <A href="/login" class="text-primary">
              sini
            </A>
          </div>
        </form>
      </Card>

      <Modal
        title="Syarat, Ketentuan, dan Privasi"
        show={showPrivacy()}
        onClose={() => setShowPrivacy(false)}
      >
        <div class="max-w-full w-[600px]">
          <div class="pl-5">
            <ul class="list-disc text-sm">
              <For each={privacy()}>{(item) => <li>{item}</li>}</For>
            </ul>
            <div class="text-sm mt-5">
              <Checkbox
                checked={isAgree()}
                onChange={(e) => setIsAgree(e.currentTarget.checked)}
                label={
                  <>
                    Saya mengerti dan setuju dengan syarat, ketentuan dan
                    privasi.
                  </>
                }
                required
              />
            </div>
          </div>
          <div class="mt-5 flex justify-end">
            <Button onClick={() => setShowPrivacy(false)}>Tutup</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
