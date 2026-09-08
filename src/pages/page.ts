export interface PageContext {
  route: string;
  root: HTMLElement;
  refresh: () => void;
}

export interface Page {
  render: (context: PageContext) => string;
  mount?: (context: PageContext) => void;
}
