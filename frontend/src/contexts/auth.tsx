import {
  Accessor,
  JSX,
  Setter,
  Show,
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { useLocation, useNavigate } from "solid-start";
import Loading from "~/components/loading";
import User from "~/interfaces/user";

type Value = [Accessor<User>, Setter<User | null>];

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  value: Value;
}

type ValProps = [
  Accessor<User>,
  {
    login: (val: User, loading?: boolean) => void;
    logout: () => void;
  }
];

const AuthContext = createContext();

export default function AuthProvider(props: Props) {
  const [user, setUser] = props.value;
  const [isLoading, setIsLoading] = createSignal<boolean>(true);

  const loc = useLocation();
  const nav = useNavigate();

  const value: ValProps = [
    user,
    {
      login: (val: User, loading: boolean = true) => {
        setIsLoading(loading);
        setUser(val);
        localStorage.setItem("xuser", JSON.stringify(val));
      },
      logout: () => {
        setIsLoading(true);
        setUser({
          id: undefined,
        });
        localStorage.removeItem("xuser");
      },
    },
  ];

  const getUser = async () => {
    const user = JSON.parse(localStorage.getItem("xuser") as string);
    setUser(user);
  };

  createEffect(() => {
    if (isLoading() == true) {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  });

  createEffect(() => {
    const id = user()?.id;
    const role = user()?.role;
    const path = loc.pathname;

    if (!isLoading()) {
      if (id) {
        if (user()?.status == "0") {
          nav("/verifikasi", { replace: true });
        } else if (role == "1" && !path.includes("/admin")) {
          nav("/admin", { replace: true });
        } else if (role == "2" && !path.includes("/user")) {
          nav("/user", { replace: true });
        }
      }

      if (!id) {
        if (path.includes("/admin")) {
          nav("/login", { replace: true });
        }
      }
    }
  });

  onMount(async () => {
    await getUser();
  });

  return (
    <>
      <Show when={isLoading()}>
        <Loading />
      </Show>
      <AuthContext.Provider value={value}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
}

export function useAuth() {
  return useContext<ValProps>(AuthContext as any);
}
