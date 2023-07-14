const bulans = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function (dateString: string, short: boolean = false) {
  const date = new Date(dateString);
  const bulan = bulans[date.getMonth()];

  let val = date.getDate().toString();
  val += " ";
  val += short ? bulan.slice(0, 3) : bulan;
  val += " ";
  val += date.getFullYear();

  return val;
}
