import styled from "@emotion/styled";
import { Popover, Typography, List } from "antd";
import { User } from "types";
import { useUsers } from "utils/users";

export const UserPopover = () => {
  const { data: users, isLoading, refetch } = useUsers();

  const Content = (
    <ContentContainer>
      <Typography.Text type="secondary">组员列表</Typography.Text>
      <List loading={isLoading}>
        {users?.map((user: User) => (
          <List.Item key={user.id}>
            <List.Item.Meta title={user.name} />
          </List.Item>
        ))}
      </List>
    </ContentContainer>
  );

  return (
    <Popover
      onOpenChange={() => refetch()}
      placement="bottom"
      content={Content}
    >
      <span>组员</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
