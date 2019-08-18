import * as dscc from '@google/dscc';
import TreeMap, { ILink } from './treeMap';
import "./style.css";

function drawViz(data: dscc.TableFormat): void {
  let { rows, headers } = data.tables[dscc.TableType.DEFAULT];

  const height = dscc.getHeight();
  const width = dscc.getWidth();

  const rowIndex = (name: string) => headers.findIndex(i => i.name === name);

  const dataset = rows.map( row => {
    return {
      source: row[rowIndex('source')],
      target: row[rowIndex('target')],
      type: row[rowIndex('type')],
    }
  });

  const treemap = new TreeMap(
    dataset as ILink[],
    {
      initSelector: 'body',
      width: width,
      height: height
    });

  treemap.run();
}

dscc.subscribeToData(drawViz, { transform: dscc.tableTransform });