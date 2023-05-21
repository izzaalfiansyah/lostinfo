import { type Signal, createContextId } from "@builder.io/qwik";
import type User from "~/interfaces/user";

export const AuthContext = createContextId<Signal<User>>("auth-context");
