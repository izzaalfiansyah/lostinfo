import { JSX, Show } from "solid-js";
import { Title } from "solid-start";
import Card from "./card";
import { useAuth } from "~/contexts/auth";

interface Props {
  title: string;
  subtitle?: string;
  action?: JSX.Element;
}

export default function (props: Props) {
  const [auth] = useAuth();

  return (
    <>
      <Show when={auth().id}>
        <Card class="mb-3 border-t-4 border-primary">
          <Title>LostInfo - {props.title}</Title>
          <div class="flex lg:items-center justify-between lg:flex-row flex-col gap-3">
            <div>
              <div class="text-xl font-bold">{props.title}</div>
              {/* <p class="text-sm">{props.subtitle}</p> */}
            </div>

            {props.action}
          </div>
        </Card>
      </Show>
    </>
  );
}
