import styled from "@emotion/styled";
import { GithubOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from "antd";
import { Row } from "components/lib";
import { useAuth } from "context/auth-context";
import { ProjectList } from "screens/project-list";
import { ReactComponent as SoftwareLogo } from "assets/software-logo.svg";
import { toIndex } from "utils";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  Link,
} from "react-router-dom";
import { Project } from "screens/project";
import { ProjectModal } from "components/project-modal";
import { UserPopover } from "components/user-popover";
import Comfy from "screens/comfy";
import { FlowList } from "screens/flow-list";

export const AuthenticatedApp = () => {
  return (
    <Container>
      <Router>
        <PageHeader />
        <Main>
          <Routes>
            <Route path="/comfy/:id" element={<Comfy />} />
            <Route path="/flows" element={<FlowList />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id/*" element={<Project />} />
            <Route index element={<Navigate to={"flows"} replace={true} />} />
          </Routes>
        </Main>
        <ProjectModal />
      </Router>
    </Container>
  );
};

const PageHeader = () => {
  const { logout, user } = useAuth();

  const menus: MenuProps["items"] = [
    {
      key: "logout",
      label: (
        <Button type="link" onClick={logout}>
          登出
        </Button>
      ),
    },
  ];

  return (
    <Header between>
      <HeaderLeft gap>
        <MiddleAlignButton type="link" onClick={toIndex}>
          <SoftwareLogo width="18rem" color="rgb(38, 132, 255)" />
        </MiddleAlignButton>
        <Link to={'/flows'}>流程</Link>
        <Link to={'/projects'}>项目</Link>
        <UserPopover />
      </HeaderLeft>
      <HeaderRight>
        <GithubLink href="https://github.com/BigAl1986/flow" target="blank"><GithubOutlined /></GithubLink>
        <Dropdown menu={{ items: menus }}>
          <Button type="link">HI, {user?.name}</Button>
        </Dropdown>
      </HeaderRight>
    </Header>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
`;

const Header = styled(Row)`
  padding: 3.2rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const HeaderLeft = styled(Row)``;

const MiddleAlignButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const GithubLink = styled.a`
  font-size: 3rem;
`;

const Main = styled.main`
  display: flex;
  overflow: hidden;
`;
