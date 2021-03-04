export default class VNode {
  constructor(
    tag,
    data, // VNodeData 任何可以对vnode进行描述的内容，都存放到vnodedata中
    children,
    text,
    elm,
    context,
    componentOptions,
    key,
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.context = context;
    this.componentOptions = componentOptions;
    this.key = data && data.key;
  }
}
