import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumentTitle } from "utils";
import { MainContainer, Row } from "components/lib";

import { useUsers } from "utils/users";
import { useEffect, useState } from "react";
import { Flow } from "types";
import { Button } from "antd";

export const FlowList = () => {
  useDocumentTitle("流程列表", false);
  const { data: users } = useUsers();

  const [param, setParam] = useState<Partial<Pick<Flow, "name" | "personId">>>({});
  const debounceParam = useDebounce(param, 200);
  const [list, setList] = useState<Flow[]>([]);
  const [flowList, setFlowList] = useState<Flow[]>([]);
  const [adding, setAdding] = useState(false);

  const addingRow: Flow = {
    id: 'new',
    name: '',
    personId: 1,
    organization: '',
    created: -1,
  }

  const handleParamChange = (param: any) => {
    setParam(param);
  }

  const handleDelete = (id: string) => {
    if (!(list.findIndex(flow => flow.id === id) >= 0)) return;
    const arr = list.filter(flow => flow.id !== id)
    setList(arr);
    localStorage.setItem('flowList', JSON.stringify(arr));
  }

  const handleSave = (flow: Flow) => {
    const arr = [flow, ...list];
    setList(arr);
    localStorage.setItem('flowList', JSON.stringify(arr));
    setAdding(false);
  }

  useEffect(() => {
    const flowListStorage = localStorage.getItem('flowList');
    let arr = JSON.parse(flowListStorage || '[]') as Flow[];
    if (arr?.length) {
      setList(arr);
    } else {
      arr = [ { id: '1', name: 'my flow', personId: 1, organization: '快递组', created: 1678978787989 }];
      localStorage.setItem('flowList', JSON.stringify(arr));
      setList(arr);
    }
    const lineListStorage = localStorage.getItem("lineList");
    if (!lineListStorage) {
      localStorage.setItem('lineList', JSON.stringify([{
        flowId: '1',
        list: [
          {
            id: "07831680",
            sourceNodeId: "start",
            sourcePortIndex: 0,
            targetNodeId: "33228236",
            targetPortIndex: 0,
            startPos: { x: 106, y: 28 },
            endPos: { x: 253, y: 234 },
          },
          {
            id: "49097069",
            sourceNodeId: "33228236",
            sourcePortIndex: 1,
            targetNodeId: "27017427",
            targetPortIndex: 1,
            startPos: { x: 371, y: 168 },
            endPos: { x: 627, y: 236 },
          },
          {
            id: "56574285",
            sourceNodeId: "27017427",
            sourcePortIndex: 2,
            targetNodeId: "32619822",
            targetPortIndex: 0,
            startPos: { x: 787, y: 233 },
            endPos: { x: 974, y: 99 },
          },
          {
            id: "58456975",
            sourceNodeId: "33228236",
            sourcePortIndex: 2,
            targetNodeId: "27017427",
            targetPortIndex: 0,
            startPos: { x: 371, y: 296 },
            endPos: { x: 713, y: 150 },
          },
          {
            id: "30722765",
            sourceNodeId: "27017427",
            sourcePortIndex: 3,
            targetNodeId: "04785270",
            targetPortIndex: 0,
            startPos: { x: 707, y: 317 },
            endPos: { x: 927, y: 457 },
          },
          {
            id: "98740711",
            sourceNodeId: "04785270",
            sourcePortIndex: 1,
            targetNodeId: "12971379",
            targetPortIndex: 0,
            startPos: { x: 1087, y: 453 },
            endPos: { x: 1330, y: 538 },
          },
          {
            id: "56059125",
            sourceNodeId: "32619822",
            sourcePortIndex: 1,
            targetNodeId: "70488904",
            targetPortIndex: 0,
            startPos: { x: 1128, y: 97 },
            endPos: { x: 1377, y: 106 },
          },
        ],
      }]));
    }
    const nodeListStorage = localStorage.getItem("nodeList");
    if (!nodeListStorage) {
      localStorage.setItem('nodeList', JSON.stringify([{
        flowId: '1',
        list: [
          {
            id: "start",
            type: "start",
            position: { x: 10, y: 10 },
            ports: [{ type: "exit", offsetX: 96, offsetY: 18 }],
          },
          {
            id: "33228236",
            type: "triangle",
            position: { x: 223, y: 154 },
            ports: [
              { type: "entrance", offsetX: 28, offsetY: 78 },
              { type: "exit", offsetX: 148, offsetY: 14 },
              { type: "exit", offsetX: 148, offsetY: 142 },
            ],
          },
          {
            id: "27017427",
            type: "diamond",
            position: { x: 609, y: 135 },
            ports: [
              { type: "entrance", offsetX: 98, offsetY: 12 },
              { type: "entrance", offsetX: 18, offsetY: 98 },
              { type: "exit", offsetX: 178, offsetY: 98 },
              { type: "exit", offsetX: 98, offsetY: 182 },
            ],
          },
          {
            id: "32619822",
            type: "rectangle",
            position: { x: 952, y: 79 },
            ports: [
              { type: "entrance", offsetX: 18, offsetY: 18 },
              { type: "exit", offsetX: 176, offsetY: 18 },
            ],
          },
          {
            id: "04785270",
            type: "rectangle",
            position: { x: 911, y: 435 },
            ports: [
              { type: "entrance", offsetX: 18, offsetY: 18 },
              { type: "exit", offsetX: 176, offsetY: 18 },
            ],
          },
          {
            id: "70488904",
            type: "end",
            position: { x: 1357, y: 87 },
            ports: [{ type: "entrance", offsetX: 18, offsetY: 18 }],
          },
          {
            id: "12971379",
            type: "end",
            position: { x: 1307, y: 518 },
            ports: [{ type: "entrance", offsetX: 18, offsetY: 18 }],
          },
        ],
      }]));
    }
  }, []);

  useEffect(() => {
    setFlowList((debounceParam.personId ? list.filter(flow => flow.personId === debounceParam.personId) : list).filter(flow => flow.name.includes(debounceParam.name || '')));
  }, [debounceParam, list]);

  return (
    <MainContainer>
      <Row between>
        <h2>流程列表</h2>
        <Button type="link" onClick={() => setAdding(true)}>
          创建流程
        </Button>
      </Row>
      <SearchPanel param={param} setParam={handleParamChange} />
      <List
        users={users || []}
        dataSource={ adding ? [ addingRow, ...flowList] : flowList || []}
        onDelete={handleDelete}
        onSave={handleSave}
      />
    </MainContainer>
  );
};
