import { JSX } from "solid-js";
import { Title } from "solid-start";

interface Props {
  title: string;
  subtitle: string;
  action?: JSX.Element;
}

export default function (props: Props) {
  return (
    <>
      <Title>LostInfo - {props.title}</Title>
      <div class="py-3 mb-3 flex lg:items-center justify-between lg:flex-row flex-col">
        <div>
          <div class="text-xl font-bold">{props.title}</div>
          <p class="text-sm">{props.subtitle}</p>
        </div>

        {props.action}
      </div>
    </>
  );
}
