import { useArray } from "utils";

export const TestDemo = () => {
  const persons: { name: string; age: number }[] = [
    { name: "jack", age: 12 },
    { name: "ma", age: 34 },
  ];

  const { value, clear, removeIndex, add } = useArray(persons);

  return (
    <>
      <button onClick={() => add({ name: "john", age: 56 })}>添加john</button>
      <button onClick={() => removeIndex(0)}>删除0项</button>
      <button onClick={() => clear()}>清除</button>
      {value.map((item, index) => {
        return (
          <div key={item.name}>
            <span>{index}</span>-<span>{item.name}</span>-
            <span>{item.age}</span>
          </div>
        );
      })}
    </>
  );
};
