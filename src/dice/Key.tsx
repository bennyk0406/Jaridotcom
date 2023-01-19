/** @jsxImportSource @emotion/react */
import { type SerializedStyles, css } from "@emotion/react";

interface ContentProps extends React.PropsWithChildren {
    content: string;
    action: (value: string) => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    style?: SerializedStyles;
    operator?: boolean;
    number?: boolean;
}

const Button: React.FC<ContentProps> = (props) =>
    (<button
        css={css`
            font-family: ${props.operator ? "Arial, Helvetica" : "Noto Sans KR"}, sans-serif;
            background-color: ${props.number ? "#f1f3f4" : "#dadce0"};
            ${props.style};
            font-size: 20px;
            height: 40px;
            margin: 4px;
            border-radius: 4px;
            border: none;
        `}
        onClick={() => props.action(props.content)}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onTouchStart={props.onMouseDown}
        onTouchEnd={props.onMouseUp}
    >
        {props.content}
    </button>);

export default Button;