/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";

interface InputProps {
    width: number;
    action: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    defaultValue?: number;
    value?: number | string;
    style?: SerializedStyles;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = (props) => {
    return (
        <input
            type="number"
            css={css`
                background-color: ${props.disabled ? "var(--input-disabled)" : "var(--input)"};
                color: var(--text);
                border: none;
                height: 20px;
                text-align: right;
                font-size: 17px;
                font-weight: 500;
                font-family: Noto Sans KR, sans-serif;
                padding: 3px 5px;
                border-radius: 3px;
                width: ${props.width}px;
                ${props.style}
            `}
            onChange={props.action}
            defaultValue={props.defaultValue}
            value={props.value}
            disabled={props.disabled}
        />
    )
}

export default Input;