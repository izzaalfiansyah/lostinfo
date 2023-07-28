import { Title } from "solid-start";

export default function (props: { title: string }) {
  return (
    <>
      <Title>LostInfo - {props.title}</Title>
      <div class="mb-5">
        <div class="font-semibold text-lg">{props.title}</div>
      </div>
    </>
  );
}
