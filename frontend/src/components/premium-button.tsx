import { useAuth } from "~/contexts/auth";
import { useNotif } from "~/contexts/notif";
import http from "~/libs/http";
import Button from "./button";
import { createSignal } from "solid-js";
import Modal from "./modal";

export default function (props: { text: string }) {
  const [auth] = useAuth();
  const notif = useNotif();

  const [showModalPremium, setShowModalPremium] = createSignal(false);

  const premiumkan = async (e: Event) => {
    e.preventDefault();
    try {
      setShowModalPremium(false);
      notif.show("Memuat...");
      const res = await http.get("/user/" + auth().id + "/premium");
      (window as any).snap.pay(res.data, {
        onSuccess: function (result: any) {
          notif.show("pembayaran sukses");
        },
        onPending: function (result: any) {
          notif.show("menunggu pembayaran kamu");
        },
        onError: function (result: any) {
          alert("pembayaran gagal!");
        },
        onClose: function () {
          notif.show("kamu menutup popup tanpa melanjutkan pembayaran", false);
        },
      });
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  return (
    <>
      <Modal
        show={showModalPremium()}
        onClose={() => setShowModalPremium(false)}
        title="Coba Akun Premium"
      >
        <form onSubmit={premiumkan} class="w-[500px] max-w-full text-left">
          <div class="mb-5">
            Jelajahi fitur yang ditawarkan pada akun premium :
          </div>
          <div class="flex lg:flex-row justify-between flex-col gap-3">
            <div class="pl-5">
              <ul class="list-disc text-sm">
                <li>
                  Melihat data barang hilang dan temuan yang serupa dengan milik
                  kamu untuk memudahkan dalam pencarian barangmu
                </li>
                <li>
                  Menghapus potongan biaya admin untuk pelelangan barang dari 5%
                  ke 2%
                </li>
                <li>Memberikan tag premium ke akun kamu</li>
              </ul>
            </div>
          </div>
          <div class="mt-4">
            Rp 25.000 per-bulan. Kamu bisa membatalkannya kapanpun.
          </div>
          <div class="mt-8 flex justify-end">
            <Button type="submit" variant="primary">
              Konfirmasi
            </Button>
            <Button onClick={() => setShowModalPremium(false)} class="ml-2">
              Batal
            </Button>
          </div>
        </form>
      </Modal>
      <Button
        type="button"
        variant="primary"
        onClick={() => setShowModalPremium(true)}
      >
        {props.text}
      </Button>
    </>
  );
}
