import * as dscc from '@google/dscc';
import TreeMap from './treeMap';
import "./style.css";

function drawViz(data: dscc.TableFormat): void {
  let rowData = data.tables[dscc.TableType.DEFAULT];
  console.log(rowData);

  const height = dscc.getHeight();
  const width = dscc.getWidth();

  const treemap = new TreeMap({
    initSelector: 'body',
    width: width,
    height: height
  });
  treemap.run();
}

dscc.subscribeToData(drawViz, { transform: dscc.tableTransform });