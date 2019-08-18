import * as dscc from '@google/dscc';
import TreeMap from './treeMap';

function drawViz(data: dscc.TableFormat): void {
  let rowData = data.tables[dscc.TableType.DEFAULT];

  const treemap = new TreeMap().run();
}

dscc.subscribeToData(drawViz, { transform: dscc.tableTransform });