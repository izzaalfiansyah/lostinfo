// @refresh reload
import { Suspense } from "solid-js";
import {
  useLocation,
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  Link,
} from "solid-start";

import "./root.css";
import Layouts from "./layouts";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>LostInfo</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link
          rel="icon"
          href="https://polije.ac.id/wp-content/uploads/elementor/thumbs/LOGO-POLITEKNIK-NEGERI-JEMBER-200x200-p501e8qsx93hro564g7wmlj5f1d6bn1idluqt46f2o.png"
        />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Layouts>
              <Routes>
                <FileRoutes />
              </Routes>
            </Layouts>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
