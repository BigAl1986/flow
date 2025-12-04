import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumentTitle } from "utils";
import { Button } from "antd";
import { useProjects } from "utils/projects";
import { useUsers } from "utils/users";
import { useProjectModal, useProjectsSearchParams } from "./utils";
import { ErrorBox, MainContainer, Row } from "components/lib";

export const ProjectList = () => {
  useDocumentTitle("项目列表", false);

  const [param, setParam] = useProjectsSearchParams();
  const { error, data: list, isLoading } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();
  const { open } = useProjectModal();

  return (
    <MainContainer>
      <Row between>
        <h2>项目列表</h2>
        <Button type="link" onClick={open}>
          创建项目
        </Button>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error} />
      <List users={users || []} dataSource={list || []} loading={isLoading} />
    </MainContainer>
  );
};
