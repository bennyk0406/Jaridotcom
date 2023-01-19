/** @jsxImportSource @emotion/react */
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";
import Header from "./components/Header";
import logoLight from "./assets/logo-light.png";
import logoDark from "./assets/logo-dark.png";
import prob from "./assets/prob.png";
import calc from "./assets/card.svg";
import dice from "./assets/dice.png";
import "./style.css";
import { css } from "@emotion/react";
import Shortcut from "./shortcut";

const App = () => {
    const [ theme, setTheme ] = useState(useContext(ThemeContext).theme);
    const toggleTheme = () => {
        setTheme((theme) => theme === "light" ? "dark" : "light");
    };
    useEffect(() => {
        document.documentElement.setAttribute("color-theme", theme);
        localStorage.setItem("color-theme", theme);
    }, [ theme ]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Header />
            <main css={css`
                text-align: center;
                color: ${theme === "light" ? "black" : "white"};
                background-color: ${theme === "light" ? "white" : "#2d2d32"};
                margin: 0;
                width: 100%;
                height: 100%;
                display: flex;
                padding-top: 10px;
                flex-direction: column;
                gap: 10px;
                overflow-y: scroll;
            `}>
                <div>
                    <img
                        css={css`
                            margin-top: 40px;
                            width: 200px;
                        `}
                        src={theme === "light" ? logoLight : logoDark}
                        alt="로고 이미지" />
                    <p css={css`margin: 0;`}>
                        자리닷컴
                    </p>
                </div>
                <Shortcut content="뽑기권 확률 계산기" imgSrc={prob} href="./prob/"/>
                <Shortcut content="주사위 엽서 확률 계산기" imgSrc={dice} href="./dice/"/>
                <Shortcut content="기타 계산기" imgSrc={calc} href="./calc/" style={css`padding-bottom: 40px;`}/>
            </main>
        </ThemeContext.Provider>
    );
};

export default App;