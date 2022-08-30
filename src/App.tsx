import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";
import Header from "./components/Header";
import logoLight from "./assets/logo-light.png";
import logoDark from "./assets/logo-dark.png";
import prob from "./assets/prob.png";
import calc from "./assets/card.svg";
import "./style.css";

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
            <main>
                <div>
                    <img id="logo-img" src={theme === "light" ? logoLight : logoDark} alt="로고 이미지" />
                    <p id="subtitle">
                        자리닷컴
                    </p>
                </div>
                <div>
                    <button id="prob" onClick={() => { location.href = "./prob/"; }}>
                        <img id="prob" src={prob} alt="확률 계산기 이미지" />
                    </button>
                    <p className="button-description">
                        뽑기권 확률 계산기
                    </p>
                </div>
                <div>
                    <button id="others" onClick={() => { location.href = "./calc/"; }}>
                        <img id="others" src={calc} alt="기타 계산기 이미지" />
                    </button>
                    <p className="button-description">
                        기타 계산기
                    </p>
                </div>
            </main>
        </ThemeContext.Provider>
    );
};

export default App;