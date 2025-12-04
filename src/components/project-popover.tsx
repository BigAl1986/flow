import styled from "@emotion/styled";
import { Popover, Typography, List, Divider, Button } from "antd";
import { Link } from "react-router-dom";
import { useProjectModal } from "screens/project-list/utils";
import { Project } from "types";
import { useProjects } from "utils/projects";

export const ProjectPopover = () => {
  const { data, isLoading, refetch } = useProjects();
  const projects = data?.filter((project: Project) => project.pin);
  const { open } = useProjectModal();

  const Content = (
    <ContentContainer>
      <Typography.Text type="secondary">收藏项目</Typography.Text>
      <List loading={isLoading}>
        {projects?.map((project: Project) => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <Button type="link" onClick={open}>
        创建项目
      </Button>
    </ContentContainer>
  );

  return (
    <Popover
      onOpenChange={() => refetch()}
      placement="bottom"
      content={Content}
    >
      <Link to={"projects"}>项目</Link>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
