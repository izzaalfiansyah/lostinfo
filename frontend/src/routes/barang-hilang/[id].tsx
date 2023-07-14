import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { useParams } from "solid-start";
import Title from "~/components/title";
import { useNotif } from "~/contexts/notif";
import BarangHilang from "~/interfaces/barang-hilang";
import http from "~/libs/http";
import { Save } from "./create";

export default function () {
  const [req, setReq] = createStore<BarangHilang>({});

  const notif = useNotif();
  const params = useParams();

  const get = async () => {
    try {
      const { data } = await http.get("/barang/hilang/" + params.id);
      setReq(data.data);
      setReq("foto", "");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  const update = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      await http.put("/barang/hilang/" + params.id, req);
      notif.show("data berhasil disimpan");
    } catch (e: any) {
      notif.show(e.response.data.message, false);
    }
  };

  return (
    <>
      <Title
        title="Detail Barang Hilang"
        subtitle="Informasi lanjutan mengenai barang hilang"
      ></Title>
      <Save item={[req, setReq]} onMount={get} onSubmit={update}></Save>
    </>
  );
}
