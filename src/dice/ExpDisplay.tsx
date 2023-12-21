/** @jsxImportSource @emotion/react */
import { type SerializedStyles, css } from "@emotion/react";

interface ExpressionProps extends React.PropsWithChildren {
    expression: string[];
    placeHolder: string;
    action: () => void;
    style?: SerializedStyles;
}

const ExpDisplay: React.FC<ExpressionProps> = (props) =>
    (<div css={css`
        ${props.style};
        height: 50px;
        background-color: white;
        color: ${props.expression.length === 0 ? "#7b7b7b" : "black"};
        border-radius: 8px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
    `}
    onClick={props.action}>
        <span css={css`
            margin: auto 7px;
            text-overflow: clip;
            overflow: hidden;
            white-space: nowrap;
        `}>
            {props.expression.length === 0 ? props.placeHolder : props.expression.join("")}
        </span>
    </div>);

export default ExpDisplay;