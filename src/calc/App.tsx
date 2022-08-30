import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../theme-context";
import Header from "../components/Header";
import Card from "./Card";
import Exchange from "./Exchange";
import Mailbox from "./Mailbox";
import Authority from "./Authority";
import cardSvg from "../assets/card.svg";
import exchangeSvg from "../assets/exchange.svg";
import mailboxSvg from "../assets/mailbox.svg";
import postcardSvg from "../assets/postcard.png";
import type { Theme } from "../theme-context";

window.addEventListener("resize", () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
});

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

const App = () => {
    const [ theme, setTheme ] = useState<Theme>(useContext(ThemeContext).theme);
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
                <Card />
                <Exchange />
                <Mailbox />
                <Authority />
            </main>
            <footer>
                <a className="navigation" href="#card">
                    <img src={cardSvg} />
                </a>
                <a className="navigation" href="#exchange">
                    <img src={exchangeSvg} />
                </a>
                <a className="navigation" href="#mailbox">
                    <img src={mailboxSvg} />
                </a>
                <a className="navigation" href="#authority">
                    <img src={postcardSvg} />
                </a>
            </footer>
        </ThemeContext.Provider>
    );
};

export default App;