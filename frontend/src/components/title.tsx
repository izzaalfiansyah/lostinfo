import { JSX } from "solid-js";
import { Title } from "solid-start";
import Card from "./card";

interface Props {
  title: string;
  subtitle: string;
  action?: JSX.Element;
}

export default function (props: Props) {
  return (
    <>
      <Card class="mb-3 border-t-4 border-primary">
        <Title>LostInfo - {props.title}</Title>
        <div class="flex lg:items-center justify-between lg:flex-row flex-col">
          <div>
            <div class="text-xl font-bold">{props.title}</div>
            {/* <p class="text-sm">{props.subtitle}</p> */}
          </div>

          {props.action}
        </div>
      </Card>
    </>
  );
}
