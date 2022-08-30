import { useContext } from "react";
import { ThemeContext } from "../theme-context";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";

const Header = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <header>
            <div id="logo-container">
                <img id="header-img" onClick={() => { location.href = "https://자리.com"; }} src={theme === "light" ? logoLight : logoDark} alt="헤더 이미지" />
            </div>
            <div id="svg-container">
                <img
                    id="view-mode-svg"
                    onClick={() => toggleTheme()}
                    src={theme === "light" ? moon : sun}
                />
            </div>
        </header>
    );
};

export default Header;