import { SetStoreFunction } from "solid-js/store";
import Modal from "../modal";
import User from "~/interfaces/user";
import http from "~/libs/http";
import { useNotif } from "~/contexts/notif";
import Button from "../button";

interface Props {
  show: boolean;
  onClose: () => void;
  req: [User, SetStoreFunction<User>];
  callback: () => void;
}

export default function (props: Props) {
  const [req, setReq] = props.req;

  const notif = useNotif();

  const destroy = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      await http.delete("/user/" + req.id);
      notif.show("data berhasil dihapus");
      props.onClose();
      props.callback();
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  return (
    <Modal show={props.show} onClose={props.onClose} title="Hapus Pengguna">
      <form onSubmit={destroy} class="max-w-full w-[500px]">
        <p>
          Anda yakin menghapus <strong>{req.nama}</strong>? Data akan dihapus
          secara permanen!
        </p>
        <div class="mt-8 flex justify-end">
          <Button type="submit" variant="red">
            Hapus
          </Button>
          <Button class="ml-2" onClick={props.onClose}>
            Batal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
