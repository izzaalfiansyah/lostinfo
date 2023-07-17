import Input from "~/components/input";

export default function () {
  return (
    <>
      <div class="bg-primary rounded-b-xl p-2.5 shadow"></div>
      <div class="mt-5">
        <Input placeholder="Ketik di sini untuk mulai mencari" />
      </div>
      <div class="mt-5 text-sm">
        <div class="font-semibold mb-3">Kehilangan Terbaru</div>
        <div class="bg-primary rounded-lg h-40"></div>
      </div>
    </>
  );
}
