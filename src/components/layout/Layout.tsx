import { Spacer } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Container } from "../Container";
import { Hero } from "../landing-page/Hero";
import { Main } from "../Main";
import { Footer } from "./Footer";

export const Layout = (props: { children: ReactNode }) => (
  <Container minHeight="100vh">
    <Hero title="ProvideQ" />
    <Main>{props.children}</Main>

    <Spacer mb="5rem" />
    <Footer />
  </Container>
);
