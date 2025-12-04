import styled from "@emotion/styled";
import { Menu } from "antd";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Epic } from "screens/epic";
import { Kanban } from "screens/kanban";

export const Project = () => {
  const pathKey = useLocation().pathname.split("/").at(-1) || "";
  return (
    <Container>
      <Aside>
        <Menu mode="inline" selectedKeys={[pathKey]}>
          <Menu.Item key="kanban">
            <Link to="kanban">看板</Link>
          </Menu.Item>
          <Menu.Item key="epic">
            <Link to="epic">任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/epic" element={<Epic />} />
          <Route index element={<Navigate to={"kanban"} replace={true} />} />
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;

const Main = styled.div`
  display: flex;
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 60rem;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
`;
