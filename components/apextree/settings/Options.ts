export type TreeDirection = 'left' | 'top' | 'right' | 'bottom';

export interface NodeOptions {
  readonly nodeWidth: number;
  readonly nodeHeight: number;
  readonly nodeBGColor: string;
  readonly nodeBGColorHover: string;
  readonly nodeStyle: string;
  readonly nodeClassName: string;
  readonly nodeTemplate: (content: any, node: any) => any;
  readonly borderRadius: string;
  readonly borderWidth: number;
  readonly borderColor: string;
  readonly borderStyle: string;
  readonly borderColorHover: string;
  readonly enableExpandCollapse: boolean;
}

export interface TooltipOptions {
  readonly enableTooltip: boolean;
  readonly tooltipId: string;
  readonly tooltipTemplate?: (content: any) => any;
  readonly tooltipMaxWidth: number;
  readonly tooltipBorderColor: string;
  readonly tooltipBGColor: string;
}

export interface FontOptions {
  readonly fontSize: string;
  readonly fontFamily: string;
  readonly fontWeight: number;
  readonly fontColor: string;
}

export interface EdgeOptions {
  readonly edgeColor: string;
  readonly edgeColorHover: string;
}

export interface CommonOptions {
  readonly width: number;
  readonly height: number;
  readonly direction: TreeDirection;
  readonly contentKey: string;
  readonly siblingSpacing: number;
  readonly childrenSpacing: number;
  readonly highlightOnHover: boolean;
  readonly containerClassName: string;
  readonly canvasStyle: string;
  readonly enableToolbar: boolean;
}

export type TreeOptions = CommonOptions &
  NodeOptions &
  TooltipOptions &
  FontOptions &
  EdgeOptions;

const defaultNodeTemplate = (content: string) => {
  return `<div style='display: flex;justify-content: center;align-items: center; text-align: center; height: 100%;'>${content}</div>`;
};

export const DefaultOptions: TreeOptions = {
  width: 400,
  height: 400,
  contentKey: 'name',
  nodeWidth: 50,
  nodeHeight: 30,
  nodeTemplate: defaultNodeTemplate,
  nodeBGColor: '#FFFFFF',
  nodeBGColorHover: '#FFFFFF',
  nodeStyle: '',
  nodeClassName: 'apextree-node',
  borderWidth: 2,
  borderStyle: 'solid',
  borderRadius: '5px',
  borderColor: '#BCBCBC',
  borderColorHover: '#5C6BC0',
  enableExpandCollapse: false,
  siblingSpacing: 50,
  childrenSpacing: 50,
  direction: 'top',
  highlightOnHover: true,
  containerClassName: 'root',
  enableTooltip: false,
  tooltipId: 'apextree-tooltip-container',
  tooltipMaxWidth: 100,
  tooltipBorderColor: '#BCBCBC',
  tooltipBGColor: '#FFFFFF',
  fontSize: '14px',
  fontFamily: '',
  fontWeight: 400,
  fontColor: '#000000',
  canvasStyle: '',
  enableToolbar: false,
  edgeColor: '#BCBCBC',
  edgeColorHover: '#5C6BC0',
};
