import * as dscc from '@google/dscc';

function drawViz(data: dscc.ObjectFormat): void {
  const margin = { top: 10, bottom: 50, right: 10, left: 10};
  const height = dscc.getHeight() - margin.top - margin.bottom;
  const width = dscc.getWidth() - margin.left - margin.right;

  if (document.querySelector('svg')) {
    let oldSvg = document.querySelector('svg') as SVGElement
    oldSvg.parentNode && oldSvg.parentNode.removeChild(oldSvg);
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', `${height}px`);
  svg.setAttribute('width', `${width}px`);

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('width', `${width/2}px`);
  rect.setAttribute('height', `${width/2}px`);
  rect.style.fill = 'blue';

  svg.append(rect);

  document.body.appendChild(svg);
}

dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });