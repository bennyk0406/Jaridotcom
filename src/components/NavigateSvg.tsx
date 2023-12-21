/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface NavigateSvgInterface {
    src: string;
    action: () => void;
}

const NavigateSvg: React.FC<NavigateSvgInterface> = (props) => {
    return (
        <img src={props.src} css={css`
            box-sizing: border-box;
            padding: 10px;
            height: 100%;
        `} onClick={props.action}/>
    )
}

export default NavigateSvg;