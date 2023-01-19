/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface CalculatorHeaderProps extends React.PropsWithChildren {
    src: string;
    title: string;
}

const CalculatorHeader: React.FC<CalculatorHeaderProps> = (props) =>
    <header>
        <div css={css`
            width: 100px;
            height: 100px;
            border-radius: 10px;
            border: 1px var(--border) solid;
            margin: auto 10px auto 0;
            display: inline-block;`
        }>
            <img src={props.src} />
        </div>
        <span css={css`
            font-size: 20px;
            font-weight: 600;
            margin-left: 10px;`
        }>
            {props.title}
        </span>
    </header>;

export default CalculatorHeader;