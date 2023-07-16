import { createStore } from "solid-js/store";
import { useParams } from "solid-start";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import http from "~/libs/http";
import { Save } from "./create";
import BarangTemu from "~/interfaces/barang-temu";

export default function () {
  const [req, setReq] = createStore<BarangTemu>({});

  const notif = useNotif();
  const params = useParams();

  const get = async () => {
    try {
      const { data } = await http.get("/barang/temu/" + params.id);
      setReq(data.data);
      setReq("foto", "");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const update = async () => {
    try {
      await http.put("/barang/temu/" + params.id, req);
      notif.show("data berhasil disimpan");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  return (
    <>
      <Title
        title="Detail Barang Temu"
        subtitle="Informasi lanjutan mengenai barang temu"
      ></Title>
      <Save item={[req, setReq]} onMount={get} onSubmit={update}></Save>
    </>
  );
}
