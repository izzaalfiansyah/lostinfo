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
import User from "~/interfaces/user";

type Value = [Accessor<User>, Setter<User | null>];

interface Props extends JSX.HTMLAttributes<HTMLDivElement> {
  value: Value;
}

type ValueUse = [
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

  const value = [
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

  onMount(async () => {
    await getUser();
  });

  return (
    <>
      <Show when={isLoading()}>
        <div class="fixed top-0 left-0 right-0 bottom-0 z-[999999999] bg-white flex items-center justify-center space-x-4">
          <div class="animate animate-pulse rounded-full p-2 bg-purple-600"></div>
          <div class="animate animate-pulse rounded-full p-2 bg-purple-600"></div>
          <div class="animate animate-pulse rounded-full p-2 bg-purple-600"></div>
        </div>
      </Show>
      <AuthContext.Provider value={value}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
}

export function useAuth() {
  return useContext<ValueUse>(AuthContext as any);
}
