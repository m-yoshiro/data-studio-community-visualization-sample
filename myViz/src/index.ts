import * as dscc from '@google/dscc';
import "./style.css";

let titleElement = document.createElement('div');
titleElement.id = 'myVixTitle';
document.body.appendChild(titleElement);

function drawViz(data: dscc.ObjectFormat): void {
  // Data Studioのデータ
  let rowData = data.tables.DEFAULT;

  const margin = { top: 10, bottom: 50, right: 10, left: 10};
  const padding = { top: 15, bottom: 15 };

  // Data Studioでの表示サイズをもとにグラフのサイズを決定
  const height = dscc.getHeight() - margin.top - margin.bottom;
  const width = dscc.getWidth() - margin.left - margin.right;

  // body内にsvgが既にある場合、古いsvgとして削除する
  // Data Studioでデータソースの更新が起こるたびにsvgが追加されることを防ぐ
  if (document.querySelector('svg')) {
    let oldSvg = document.querySelector('svg') as SVGElement
    oldSvg.parentNode && oldSvg.parentNode.removeChild(oldSvg);
  }

  // グラフを描画するsvgを作成
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', `${height}px`);
  svg.setAttribute('width', `${width}px`);

  const fillColor =  data.style.barColor.value
    ? data.style.barColor.value.color
    : data.style.barColor.defaultValue;

  const maxBarHeight = height - padding.top - padding.bottom;
  const barWidth = width / (rowData.length * 2);

  let largestMetric = 0;
  
  rowData.forEach(function(row: any) {
    largestMetric = Math.max(largestMetric, row['barMetric'][0]);
  });

  // loop処理により、グラフのバーを複数作成する
  rowData.forEach(function(row: any, i) {
    const barData = {
      dim: row['barDimension'][0],
      met: row['barMetric'][0],
      dimId: data.fields['barDimension'][0].id
    };

    let barHeight = Math.round((barData['met'] * maxBarHeight) / largestMetric);

    let barX = (width / rowData.length) * i + barWidth / 2;

    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', `${barX}`);
    rect.setAttribute('y', `${maxBarHeight - barHeight}`);
    rect.setAttribute('width', `${barWidth}px`);
    rect.setAttribute('height', `${barHeight}px`);
    rect.setAttribute('data', JSON.stringify(barData));
    rect.style.fill = fillColor;
    svg.appendChild(rect);

    let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    let textX = barX + barWidth / 2;
    text.setAttribute('x', `${textX}`);
    text.setAttribute('text-anchor', 'middle');
    let textY = maxBarHeight + padding.top;
    text.setAttribute('y', `${textY}`);
    text.setAttribute('fill', fillColor);
    text.innerHTML = barData['dim'];

    svg.appendChild(text);
  });

  // Data Studioのグラフはbodyタグを持つ。
  // 最後にsvgをbodyに挿入することで、Data Studioでグラフを描画出来る。
  document.body.appendChild(svg);

  let metricName = data.fields['barMetric'][0].name;
  let dimensionName = data.fields['barDimension'][0].name;

  titleElement.innerText = `${metricName} by ${dimensionName}`;
}

dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });