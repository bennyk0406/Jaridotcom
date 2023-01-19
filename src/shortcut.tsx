/** @jsxImportSource @emotion/react */
import { type SerializedStyles, css } from "@emotion/react";
import { useContext } from "react";
import { ThemeContext } from "./theme-context";

interface ShortcutProps extends React.PropsWithChildren {
    content: string;
    imgSrc: string;
    href: string;
    style?: SerializedStyles;
}

const Shortcut: React.FC<ShortcutProps> = (props) => {
    const { theme } = useContext(ThemeContext);
    return (<div css={css`
        ${props.style};
    `}>
        <button css={css`
            height: 120px;
            width: 120px;
            background-color: ${theme === "light" ? "white" : "#2d2d32"};
            border: 2px black solid;
            display: block;
            border-radius: 15px;
            margin: 30px auto 0 auto;
            box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.5);
            cursor: pointer;
            color: ${theme === "light" ? "black" : "white"};
        `} onClick={() => { location.href = props.href; }}>
            <img
                css={css`
                    width: 100%;
                    margin: 0;
                    padding: 0;
                `}
                src={props.imgSrc}
            />
        </button>
        <p css={css`
            color: ${theme === "light" ? "black" : "white"};
            font-size: 20px;
            margin: 10px auto 0px;`
        }>
            {props.content}
        </p>
    </div>);
};
export default Shortcut;