export default function (val: any) {
  const number = parseInt(val);
  return "Rp " + number.toLocaleString("id-ID");
}
