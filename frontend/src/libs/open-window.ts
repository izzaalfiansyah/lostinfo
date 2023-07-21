export default function (link: string) {
  const a = document.createElement("a");
  a.href = link;
  a.target = "_blank";
  a.click();

  setTimeout(() => {
    a.remove();
  }, 400);
}
