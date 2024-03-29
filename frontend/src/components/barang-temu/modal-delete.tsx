import BarangTemu from "~/interfaces/barang-temu";
import Modal from "../modal";
import { SetStoreFunction } from "solid-js/store";
import http from "~/libs/http";
import { useNotif } from "~/contexts/notif";
import Button from "../button";

interface Props {
  show: boolean;
  onClose: () => void;
  callback: () => void;
  req: [BarangTemu, SetStoreFunction<BarangTemu>];
}

export default function (props: Props) {
  const [req, setReq] = props.req;

  const notif = useNotif();

  const destroy = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      await http.delete("/barang/temu/" + req.id);
      notif.show("data berhasil dihapus");
      props.onClose();
      props.callback();
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  return (
    <Modal show={props.show} onClose={props.onClose} title="Hapus Barang Temu">
      <form onSubmit={destroy} class="max-w-full w-[500px]">
        <p>
          Anda yakin menghapus barang <strong>{req.nama}</strong>?
        </p>
        <div class="mt-8 justify-end flex">
          <Button type="submit" variant="red">
            Hapus
          </Button>
        </div>
      </form>
    </Modal>
  );
}
