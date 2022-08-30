interface CalculatorHeaderProps {
    src: string;
    title: string;
}

const CalculatorHeader = (props: CalculatorHeaderProps) =>
    <header>
        <div className="img-container">
            <img src={props.src} />
        </div>
        <span className="title">{props.title}</span>
    </header>;

export default CalculatorHeader;