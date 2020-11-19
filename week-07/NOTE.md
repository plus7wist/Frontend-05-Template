# 学习笔记

## 宏任务和微任务

宏任务是传递给引擎执行的任务，微任务是引擎内部分发的任务。

## Realm 是什么

是保存了所有内置对象的「领域」，装箱对象的原型都来自 Realm。

## G6

G6 是一个数据可视化工具，它的基本 API 是：

    const graph = G6.Graph({
      container: 'g6-root', // id of canvas element
    });

    const data = {
      nodes: [
        { id: 'point1', x: 10, y: 0 },
        { id: 'point2', x: 0, y: 10 },
      ],
      edges: [
        { source: 'point1', target: 'point2' }
      ]
    };

    graph.data(data);
    graph.render();
