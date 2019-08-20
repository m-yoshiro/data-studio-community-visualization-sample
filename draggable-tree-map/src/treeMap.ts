import * as d3 from 'd3';

export interface INode extends d3.SimulationNodeDatum {
  id: string;
};

export interface ILink extends d3.SimulationLinkDatum<INode> {
  type?: string
};

const width = 960;
const height = 500;

// Sample Dataset
// const dataset: ILink[] = [
//   {source: "Microsoft", target: "Amazon", type: "licensing"},
//   {source: "Microsoft", target: "HTC", type: "licensing"},
//   {source: "Samsung", target: "Apple", type: "suit"},
//   {source: "Motorola", target: "Apple", type: "suit"},
//   {source: "Nokia", target: "Apple", type: "resolved"},
//   {source: "HTC", target: "Apple", type: "suit"},
//   {source: "Kodak", target: "Apple", type: "suit"},
//   {source: "Microsoft", target: "Barnes & Noble", type: "suit"},
//   {source: "Microsoft", target: "Foxconn", type: "suit"},
//   {source: "Oracle", target: "Google", type: "suit"},
//   {source: "Apple", target: "HTC", type: "suit"},
//   {source: "Microsoft", target: "Inventec", type: "suit"},
//   {source: "Samsung", target: "Kodak", type: "resolved"},
//   {source: "LG", target: "Kodak", type: "resolved"},
//   {source: "RIM", target: "Kodak", type: "suit"},
//   {source: "Sony", target: "LG", type: "suit"},
//   {source: "Kodak", target: "LG", type: "resolved"},
//   {source: "Apple", target: "Nokia", type: "resolved"},
//   {source: "Qualcomm", target: "Nokia", type: "resolved"},
//   {source: "Apple", target: "Motorola", type: "suit"},
//   {source: "Microsoft", target: "Motorola", type: "suit"},
//   {source: "Motorola", target: "Microsoft", type: "suit"},
//   {source: "Huawei", target: "ZTE", type: "suit"},
//   {source: "Ericsson", target: "ZTE", type: "suit"},
//   {source: "Kodak", target: "Samsung", type: "resolved"},
//   {source: "Apple", target: "Samsung", type: "suit"},
//   {source: "Kodak", target: "RIM", type: "suit"},
//   {source: "Nokia", target: "Qualcomm", type: "suit"}
// ];

interface IConfig {
  initSelector: string;
  width: number;
  height: number;
}

class TreeMap {
  private config: IConfig;
  private dataset: ILink[];

  constructor (dataset: ILink[], config: IConfig) {
    this.config = {
      initSelector: config.initSelector || 'body',
      width: config.width || width,
      height: config.height || height,
    };
    this.dataset = dataset;
  }

  static existed: boolean = false;

  public run(): this {
    const nodes = this.nodes(this.dataset);
    this.tree(nodes as INode[]);
    TreeMap.existed = true;

    return this;
  }

  private nodes(dataset: ILink[]) {
    return dataset.reduce((allData, data) => {
      if (allData.indexOf(data.source) === -1) {
        allData.push(data.source);
      }
      if (allData.indexOf(data.target) === -1) {
        allData.push(data.target);
      }
      return allData;
    }, [] as (string | number | INode)[]).map(data => { return { id: data } });
  }

  private tree(nodes: INode[]) {
    const svg = d3.select(this.config.initSelector).append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    svg.append('defs').selectAll('marker')
        .data(['suit', 'licensing', 'resolved'])
      .enter().append('marker')
        .attr('id', d => d)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)
        .attr('refY', -1.5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
      .append('path')
        .attr('d', 'M0,-5L10,0L0,5');

    const path = svg.append('g').selectAll('path')
        .data(this.dataset)
      .enter().append('path')
        .attr('class', d => `link ${d.type}`)
        .attr('marker-end', d => `url(#${d.type})`);

    const circle = svg.append('g').selectAll('circle')
        .data(nodes as INode[])
      .enter().append('circle')
        .attr('r', 6)
      .call(d3.drag<SVGCircleElement, INode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    const text = svg.append('g').selectAll('text')
        .data(nodes as INode[])
      .enter().append('text')
        .attr('x', 8)
        .attr('y', '.31em')
        .text(d => d.id);

    const simulation = d3.forceSimulation(nodes as INode[])
      .force('link', (d3.forceLink(this.dataset) as d3.ForceLink<INode, ILink>).id((d) => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 4, height / 2));

    simulation.nodes(nodes as INode[])
      .on('tick', tick);

    function tick() {
      path.attr('d', linkArc);
      circle.attr('transform', transform);
      text.attr('transform', transform);
    }

    function linkArc<ValueFn extends any>(d: ValueFn): string {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      return `M${ d.source.x },${ d.source.y }A${ dr },${ dr } 0 0,1 ${d.target.x},${d.target.y}`;
    }

    function transform<ValueFn extends any>(d: ValueFn): string {
      return `translate(${d.x},${d.y})`;
    }

    function dragstarted<ValueFn extends any>(d: ValueFn): void {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged<ValueFn extends any>(d: ValueFn): void {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended<ValueFn extends any>(d: ValueFn): void {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
}

export default TreeMap;