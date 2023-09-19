import { ReactElement, ReactNode } from "react";
import { Hero } from "../landing-page/Hero";
import { Main } from "../Main";
import { Container } from "../Container";
import { Footer } from "./Footer";
import { Spacer } from "@chakra-ui/react";

export const Layout = (props: { children: ReactNode }) => (
  <Container minHeight="100vh">
    <Hero title="ProvideQ" />
    <Main>{props.children}</Main>

    <Spacer mb="5rem"/>
    <Footer />
  </Container>
);
