declare module '*.svg' {
    const SvgIcon: React.ForwardRefExoticComponent<
        React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
            title?: string;
            titleId?: string;
        } & React.RefAttributes<SVGSVGElement>
    >;
    export { SvgIcon };
    //export default SvgIcon;
}
