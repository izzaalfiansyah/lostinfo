import { SetStoreFunction, createStore } from "solid-js/store";
import Modal from "../modal";
import User from "~/interfaces/user";
import http from "~/libs/http";
import { useNotif } from "~/contexts/notif";
import Button from "../button";
import UserLapor from "~/interfaces/user-lapor";
import { useAuth } from "~/contexts/auth";
import Textarea from "../textarea";
import { createEffect } from "solid-js";

interface Props {
  show: boolean;
  onClose: () => void;
  user_id: string | number;
}

export default function (props: Props) {
  const [auth] = useAuth();
  const notif = useNotif();

  const [req, setReq] = createStore<UserLapor>({
    user_id: props.user_id,
    pelapor_id: auth().id,
  });

  const report = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      console.log(req);
      await http.post("/user/lapor", req);

      setReq("user_id", "");
      setReq("pelapor_id", "");
      setReq("alasan", "");

      notif.show("user telah dilaporkan");
      props.onClose();
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  createEffect(() => {
    setReq("user_id", props.user_id);
  });

  return (
    <Modal show={props.show} onClose={props.onClose} title="Laporkan Pengguna">
      <form onSubmit={report} class="max-w-full w-[500px]">
        <Textarea
          label="Alasan"
          placeholder="Melakukan penipuan, pemalsuan data, atau lain-lain."
          value={req.alasan}
          onChange={(e) => setReq("alasan", e.currentTarget.value)}
          rows={3}
          required
        />
        <div class="mt-5 flex justify-end">
          <Button type="submit" variant="red">
            Laporkan
          </Button>
          <Button class="ml-2" onClick={props.onClose}>
            Batal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
