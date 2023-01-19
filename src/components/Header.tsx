/** @jsxImportSource @emotion/react */
import { useContext } from "react";
import { ThemeContext } from "../theme-context";
import sun from "../assets/sun.svg";
import moon from "../assets/moon.svg";
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";
import { css } from "@emotion/react";

const Header = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <header css={css`
            height: 50px;
            width: 100%;
            background-color: ${theme === "light" ? "white" : "#2d2d32"};
            border-bottom: 1px black solid;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `}>
            <div css={css`
                display: flex;
                align-items: center;
            `}>
                <img css={css`
                    padding-left: 5px;
                    height: 26px;
                    cursor: pointer;
                `}
                onClick={() => { location.href = "https://자리.com"; }}
                src={theme === "light" ? logoLight : logoDark}
                alt="헤더 이미지" />
            </div>
            <div css={css`
                width: 50px;
                height: 50px;
                margin-right: 3px;
            `}>
                <img
                    onClick={() => toggleTheme()}
                    src={theme === "light" ? moon : sun}
                />
            </div>
        </header>
    );
};

export default Header;