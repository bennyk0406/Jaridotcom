/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useRef, useState } from "react";
import NavigateSvg from "../components/NavigateSvg";
import Card from "./Card";
import Exchange from "./Exchange";
import Mailbox from "./Mailbox";
import Authority from "./Authority";

const Others = (props: { back: () => void }) => {
    const tabRef = useRef<HTMLDivElement[]>([]);

    return (
        <>
            <header css={css`
                border-bottom: 1px solid var(--border);
                display: flex;
                height: 48px;
                position: fixed;
                left: 0;
                top: 0;
                padding: 0 10px;
                width: 100%;
                align-items: center;
            `}>
                <img src="./assets/arrow.svg" css={css`height: 70%;`} onClick={props.back}/>
            </header>
            <div css={css`
                display: flex;
                flex-direction: column;
                gap: 20px;
                padding: 68px 20px 100vh;
                width: 100%;
                flex-grow: 1;
                overflow-y: auto;
                box-sizing: border-box;
            `}>
                <Card ref={el => el && (tabRef.current[0] = el)}/>
                <Exchange ref={el => el && (tabRef.current[1] = el)}/>
                <Mailbox ref={el => el && (tabRef.current[2] = el)}/>
                <Authority ref={el => el && (tabRef.current[3] = el)}/>
            </div>  
            <footer css={css`
                border-top: 1px solid #DBDBDB;
                display: flex;
                justify-content: space-around;
                height: 48px;
                position: fixed;
                left: 0;
                bottom: 0;
                width: 100%;
                align-items: center;
            `}>
                <NavigateSvg src={`./assets/card-unselected.svg`} action={() => tabRef.current[0].scrollIntoView({ behavior: "smooth" })} />
                <NavigateSvg src={`./assets/exchange-unselected.svg`} action={() => tabRef.current[1].scrollIntoView({ behavior: "smooth" })} />
                <NavigateSvg src={`./assets/mailbox-unselected.svg`} action={() => tabRef.current[2].scrollIntoView({ behavior: "smooth" })} />
                <NavigateSvg src={`./assets/post-unselected.svg`} action={() => tabRef.current[3].scrollIntoView({ behavior: "smooth" })} />
            </footer>
        </>
    );
};

export default Others;