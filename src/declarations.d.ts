declare module '*.svg' {
    const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement>
    >;
    export { ReactComponent };
    export default ReactComponent;
}
