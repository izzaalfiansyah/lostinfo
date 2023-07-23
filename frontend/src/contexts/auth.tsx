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
import http from "~/libs/http";

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
        localStorage.setItem("xid", val.id as string);
      },
      logout: () => {
        setIsLoading(true);
        setUser({
          id: undefined,
        });
        localStorage.removeItem("xid");
      },
    },
  ];

  const getUser = async () => {
    const id = localStorage.getItem("xid") as string;

    setUser({
      id: id,
    });

    try {
      if (id) {
        const { data } = await http.get("/user/" + id);
        setUser(data.data);
      }
    } catch (e) {
      setUser({ id: undefined });
    }
  };

  createEffect(() => {
    if (isLoading() == true) {
      setTimeout(() => {
        setIsLoading(false);
      }, 1200);
    }
  });

  createEffect((oldId) => {
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
      } else {
        if (path.includes("/admin") || path.includes("/user")) {
          nav("/login", { replace: true });
        }
      }
    }

    return user().id;
  });

  onMount(async () => {
    setIsLoading(true);
    await getUser();
    setIsLoading(false);
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
