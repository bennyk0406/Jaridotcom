/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import "./style.css";
import Prob from "./prob/Prob";
import Dice from "./dice/Dice";
import NavigateSvg from "./components/NavigateSvg";
import Others from "./calc/Others";

type Theme = "light" | "dark";

const userColorTheme = localStorage.getItem("color-theme") as Theme;
const osColorTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const App = () => {
    const [ theme, setTheme ] = useState<Theme>(userColorTheme ?? osColorTheme);
    const toggleTheme = () => {
        setTheme((theme) => theme === "light" ? "dark" : "light");
    };

    useEffect(() => {
        document.documentElement.setAttribute("color-theme", theme);
        localStorage.setItem("color-theme", theme);
    }, [ theme ]);
    
    type PageName = "prob" | "dice" | "others"
    const [ page, setPage ] = useState<PageName>("prob")

    const nameToNode = {
        prob: <Prob />,
        dice: <Dice />,
        others: <Others back={() => setPage("prob")}/>
    }

    return (
        <>
            <main css={css`
                margin: 0;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                overflow-y: scroll;
                flex-grow: 1;
            `}>
                {nameToNode[page]}
            </main>
            {
                page === "others" ||
                <footer css={css`
                    border-top: 1px solid var(--border);
                    display: flex;
                    justify-content: space-around;
                    height: 48px;
                    align-items: center;
                `}>
                    <NavigateSvg src={`./assets/percent-${page === "prob" ? "" : "un"}selected.svg`} action={() => setPage("prob")} />
                    <NavigateSvg src={`./assets/dice-${page === "dice" ? "" : "un"}selected.svg`} action={() => setPage("dice")}/>
                    <NavigateSvg src="./assets/calculator-unselected.svg" action={() => setPage("others")} />
                    <NavigateSvg src={theme === "light" ? "./assets/moon.svg" : "./assets/sun.svg"} action={toggleTheme} />
                </footer>
            }
        </>
    );
};

export default App;