import { Input, InputRef } from 'antd';
import { NodeContext } from 'context/node-context';
import { useContext, useEffect, useRef, useState } from 'react';
import { FlowNode, NodeContextType } from 'types';
import { libs } from '..';
import styled from '@emotion/styled';

export default function NodeName(props: { nodeInfo?: FlowNode }) {
  const currentLib = libs.find(lib => lib.type === props.nodeInfo?.type);
  const defaultLabel = currentLib?.defaultLabel || '';
  const [showLabel, setShowLabel] = useState(props.nodeInfo?.label || defaultLabel);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const { onRename } = useContext(NodeContext) as NodeContextType;

  const handleChange = () => {
    setEditing(false);
    onRename(props.nodeInfo?.id || '', showLabel);
  };

  useEffect(() => {
    if (editing) inputRef.current?.focus({ cursor: 'all' });
  }, [editing]);

  return (
    editing ?
    <Input
      ref={inputRef}
      value={showLabel}
      onBlur={handleChange}
      onPressEnter={handleChange}
      onChange={e => setShowLabel(e.target.value)}
    /> :
    <NameWrap onClick={() => setEditing(true)}>
      {showLabel}
    </NameWrap>
  );
};

const NameWrap = styled.div`
  transition: transform .5s ease-in-out;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;
