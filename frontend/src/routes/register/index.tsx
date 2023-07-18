import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "solid-start";
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

  const notif = useNotif();
  const nav = useNavigate();

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

    setIsLoading(true);
    try {
      if (req.password != req.konfirmasi_password) {
        notif.show("konfirmasi password salah", false);
        return null;
      }

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

  return (
    <div class="max-w-full w-[800px]">
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
            <button
              disabled={isLoading()}
              type="submit"
              class="bg-primary text-white w-full p-2 rounded shadow-sm"
            >
              {isLoading() ? "Menunggu..." : "Daftar"}
            </button>
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
              <li>
                Pengguna dengan ini menyatakan bahwa pengguna adalah orang yang
                cakap dan mampu untuk mengikatkan dirinya dalam sebuah
                perjanjian yang sah menurut hukum. Pengguna yang tidak cakap dan
                mampu mengikatkan dirinya dalam sebuah perjanjian yang sah
                menurut hukum dalam mengakses Situs, menggunakan Situs dan/atau
                melakukan pendaftaran akun melalui situs LostInfo, atau
                melakukan aktivitas lain di Situs, dengan ini menyatakan bahwa
                seluruh tindakan-tindakan tersebut dilakukan dalam
                sepengetahuan, pengawasan dan persetujuan yang sah dari orang
                tua atau wali atau pengampu pengguna bagi yang berusia dibawah
                17 tahun.
              </li>
              <li>
                Sebelum menggunakan Situs, Pengguna menyetujui Syarat &
                Ketentuan ini dan Kebijakan Privasi.
              </li>
              <li>
                Untuk dapat melakukan Pendaftaran Akun LostInfo, Pengguna harus
                melakukan pendaftaran Akun terlebih dahulu pada Situs. Untuk
                menghindari keraguan, Manajemen Pelaksana tidak bekerja sama
                dengan pihak ketiga manapun dalam penyelenggaraan Pendaftaran
                Akun LostInfo.
              </li>
              <li>
                Pendaftaran Akun harus menggunakan email Pengguna yang masih
                aktif dan dilakukan verifikasi pada saat mendaftar.
              </li>
              <li>
                Dalam melakukan pendaftaran Akun, Pengguna wajib memasukkan data
                diri Pengguna yang meliputi, paling sedikit, (i) nama lengkap,
                (ii) alamat, (iii) email, (iv) telepon, (v) foto KTP, (vi)
                username, dan (vii) password atas nama Pengguna.
              </li>
              <li>
                Pengguna wajib mengisi dan/atau memberikan data atau informasi
                pada Situs dengan benar, dan Pengguna dilarang memberikan data
                atau informasi yang tidak benar dan/atau melakukan manipulasi
                data dan/atau pemalsuan data. Pengguna memahami bahwa pemberian
                data atau informasi yang tidak benar dapat dianggap sebagai
                suatu perbuatan melawan hukum yang dapat menimbulkan konsekuensi
                hukum, baik secara perdata dan/atau pidana sebagaimana diatur
                dalam, termasuk namun tidak terbatas pada, Kitab Undang-Undang
                Hukum Pidana dan Undang-Undang Nomor 11 Tahun 2008 tentang
                Informasi dan Transaksi Elektronik.
              </li>
              <li>
                Pengguna wajib bertanggungjawab atas barang temuan dengan
                bersungguh-sungguh. Pengguna memahami bahwa pertanggungjawaban
                atas barang temuan telah di atur di sisi hukum, tindakan
                mengambil barang yang ditemukan di tengah jalan untuk dimiliki,
                bisa dijerat Pasal 372 KUHP (tindak pidana penggelapan) atau
                Pasal 362 KUHP (tindak pidana pencurian).
              </li>
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
            <button
              class="px-4 p-2 bg-gray-400 text-white rounded shadow-sm"
              onClick={() => setShowPrivacy(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
