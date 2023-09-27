/** @jsxImportSource @emotion/react */
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { ThemeContext } from "../theme-context";
import Header from "../components/Header";
import itemData from "./data/";
import high from "../assets/high.png";
import low from "../assets/low.png";
import screenshot from "../assets/screenshot.svg";
import "./style.css";
import type { Theme } from "../theme-context";
import html2canvas from "html2canvas";
import { css } from "@emotion/react";

type Level = "high" | "low";

interface Item {
    name: string;
    probability: number;
    isEquipItem: boolean;
}

window.addEventListener("resize", () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
});

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

interface SongpyeonProps {
    name: string;
    value: number | undefined;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Songpyeon: React.FC<SongpyeonProps> = (props) => {
    return (
        <label css={css`
            display: flex;
            justify-content: space-between;
        `}>
            {props.name}:
            <div css={css`
                display: inline-block;
            `}>
                <input
                    css={css`
                        width: 50px;
                        background-color: transparent;
                        color: var(--text);
                        border: 1px solid var(--text);
                        box-shadow: none;
                        margin: 0 4px 0 0;
                        font-size: 15px;
                        text-align: right;
                    `}
                    type="number"
                    value={props.value ?? ""}
                    onChange={props.onChange}
                />
                개
            </div>
        </label>
    )
};

const App = () => {
    const [ theme, setTheme ] = useState<Theme>(useContext(ThemeContext).theme);
    const toggleTheme = () => {
        setTheme((theme) => theme === "light" ? "dark" : "light");
    };

    useEffect(() => {
        document.documentElement.setAttribute("color-theme", theme);
        localStorage.setItem("color-theme", theme);
    }, [ theme ]);

    const [ level, setLevel ] = useState<Level>("high");
    const toggleLevel = () => {
        setLevel((level) => level === "high" ? "low" : "high");
    };

    const [ checkedData, setCheckedData ] = useState<boolean[]>(
        itemData[level]
            .filter((v) => v.isEquipItem)
            .map((_, i) => localStorage.getItem(itemData[level][i].name) === "true")
    );

    useEffect(() => {
        setCheckedData(
            itemData[level]
                .filter((v) => v.isEquipItem)
                .map((_, i) => localStorage.getItem(itemData[level][i].name) === "true")
        );
    }, [ level ]);

    const toggleCheckedData = (index: number) => {
        setCheckedData((checkedData) => {
            const copiedCheckedData = [ ...checkedData ];
            copiedCheckedData[index] = !copiedCheckedData[index];
            return copiedCheckedData;
        });
    };

    const toggleAllchecked = (checked: boolean) => {
        setCheckedData((checkedData) => [ ...checkedData ].fill(checked));
    };

    // CHUSEOK
    const [ pink, setPink ] = useState<number|undefined>(0);
    const [ songgi, setSonggi ] = useState<number|undefined>(0);
    const [ flower, setFlower ] = useState<number|undefined>(0);
    const [ pig, setPig ] = useState<number|undefined>(0);
    const [ clan, setClan ] = useState<number|undefined>(0);
    // CHUSEOK

    const [ calculatedItemData, setCalculatedItemData ] = useState<Item[]>(itemData[level]);

    const changeProbability = () => {
        const copiedItemData = itemData[level].map((value, i) => ({
            ...value,
            probability: checkedData[i] ? 0 : value.probability
        }));
        const uncheckedProbability = copiedItemData
            .map((v) => v.probability)
            .reduce((acc, cur) => acc + cur);
        const resultItemData = copiedItemData.map((value) => ({
            ...value,
            probability: Math.round(value.probability * (100 / uncheckedProbability) * 1000) / 1000
        }));
        // setCalculatedItemData(resultItemData);

        // CHUSEOK
        const weight = 1 + (0.025 * (pink ?? 0)) + (0.05 * (songgi ?? 0)) + (0.1 * (flower ?? 0)) + (0.2 * (pig ?? 0)) + (0.25 * (clan ?? 0));
        const equipItemTotalProbability = resultItemData
            .filter((v) => v.isEquipItem)
            .map((v) => v.probability)
            .reduce((acc, cur) => acc + cur);
        const weightedResultItemData = resultItemData
            .map((v) => {
                if (v.isEquipItem) {
                    v.probability *= weight;
                }
                else {
                    v.probability *= (100 - (weight * equipItemTotalProbability)) / (100 - equipItemTotalProbability);
                }
                return v;
            })
            .map((value) => ({
                ...value,
                probability: Math.round(value.probability * 1000) / 1000
            }));

        setCalculatedItemData(weightedResultItemData);
    };

    // CHUSEOK
    useEffect(() => {
        changeProbability();
    }, [ pink, songgi, flower, pig, clan ]);

    useEffect(() => {
        for (let i = 0; i < checkedData.length; i++) {
            localStorage.setItem(itemData[level][i].name, checkedData[i].toString());
        }
        changeProbability();
    }, [ checkedData ]);

    const getFormattedTime = () => {
        const date = new Date();
        const year = date.getFullYear() % 100;
        const month = (date.getMonth() + 1).toString()
            .padStart(2, "0");
        const day = date.getDate()
            .toString()
            .padStart(2, "0");
        const hour = date.getHours()
            .toString()
            .padStart(2, "0");
        const minute = date.getMinutes()
            .toString()
            .padStart(2, "0");
        const second = date.getSeconds()
            .toString()
            .padStart(2, "0");
        return `${year}${month}${day}${hour}${minute}${second}`;
    };

    const takeScreenshot = async () => {
        const [ main ] = document.getElementsByTagName("main");
        main.style.overflowY = "visible";
        main.style.paddingBottom = "0px";

        const [ footer ] = document.getElementsByTagName("footer");
        footer.style.position = "static";
        footer.style.marginTop = "20px";

        const svg = document.getElementById("screenshot") as HTMLElement;
        svg.style.display = "none";

        main.appendChild(footer);

        const canvas = await html2canvas(main, {
            scrollX: 0,
            scrollY: 0,
            allowTaint: true,
            useCORS: true
        });
        const element = document.createElement("a");
        element.href = canvas.toDataURL("image/png");
        element.download = `${getFormattedTime()}-jari.png`;
        if ([ "iphone", "ipad", "ipod" ].some((v) => v.includes(navigator.userAgent))) element.target = "_blank";
        document.body.appendChild(element);
        element.click();

        main.removeChild(footer);

        footer.style.position = "fixed";
        footer.style.marginTop = "0px";
        const root = document.getElementById("root") as HTMLElement;
        root.appendChild(footer);

        svg.style.display = "block";
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Header />
            <main css={css`
                flex-grow: 1;
                padding: 5px 0 80px;
                color: ${theme === "light" ? "black" : "white"};
                background-color: ${theme === "light" ? "white" : "#2d2d32"};
                overflow-y: scroll;
                font-size: 18px;
            `}>
            <div css={css`
                display: flex;
                flex-direction: column;
                gap: 10px 0;
                width: 180px;
                margin: 10px auto;
            `}>
                <Songpyeon
                    name="분홍송편"
                    value={pink}
                    onChange={(e) => {
                        const amount = e.target.valueAsNumber;
                        if (isNaN(amount)) setPink(undefined);
                        else setPink(Math.min(4, amount));
                    }}
                />
                <Songpyeon
                    name="송기송편"
                    value={songgi}
                    onChange={(e) => {
                        const amount = e.target.valueAsNumber;
                        if (isNaN(amount)) setSonggi(undefined);
                        else setSonggi(Math.min(4, amount));
                    }}
                />
                <Songpyeon
                    name="꽃송편"
                    value={flower}
                    onChange={(e) => {
                        const amount = e.target.valueAsNumber;
                        if (isNaN(amount)) setFlower(undefined);
                        else setFlower(Math.min(4, amount));
                    }}
                />
                <Songpyeon
                    name="돼지송편"
                    value={pig}
                    onChange={(e) => {
                        const amount = e.target.valueAsNumber;
                        if (isNaN(amount)) setPig(undefined);
                        else setPig(Math.min(4, amount));
                    }}
                />
                <Songpyeon
                    name="가문 송편"
                    value={clan}
                    onChange={(e) => {
                        const amount = e.target.valueAsNumber;
                        if (isNaN(amount)) setClan(undefined);
                        else setClan(Math.min(4, amount));
                    }}
                />
            </div>
                <table css={css`
                    width: 90vw;
                    max-width: 500px;
                    table-layout: fixed;
                    margin: 0 auto;
                    border-collapse: collapse;
                    margin-top: 40px;
                `}>
                    <thead>
                        <tr css={css`
                            border-bottom: 1px solid var(--text);
                        `}>
                            <th css={css`
                                width: 20%;
                            `}>
                                <input id="select-all-checkbox" type="checkbox" onChange={(e) => toggleAllchecked(e.target.checked)} checked={checkedData.every((v) => v)} />
                            </th>
                            <th css={css`
                                width: 55%;
                            `}>
                                아이템
                            </th>
                            <th css={css`
                                width: 25%;
                            `}>
                                확률
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {calculatedItemData.map((v, i) =>
                            <tr key={v.name}>
                                <td css={css`
                                    padding: 0px 1rem;
                                    text-align: center;
                                `}>
                                    {v.isEquipItem && <input type="checkbox" onChange={() => toggleCheckedData(i)} checked={checkedData[i] ?? false} />}
                                </td>
                                <td css={css`
                                    padding: 0px 1rem;
                                    text-align: center;
                                `}>
                                    {v.name}
                                </td>
                                <td css={css`
                                    padding: 0px 1rem;
                                    text-align: center;
                                `}>
                                    {`${v.probability}%`}
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </main>
            <footer css={css`
                vertical-align: middle;
                width: 100%;
                height: 55px;
                background: ${theme === "light" ? "#e7eaeb" : "#373737"};
                color: ${theme === "light" ? "black" : "white"};
                text-align: center;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                font-weight: bold;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            `}>
                <button
                    css={css`
                        background-color: transparent;
                        border: 0;
                        outline: 0;
                        width: 55px;
                        cursor: pointer;
                        padding: 0 5px;
                    `}
                    onClick={takeScreenshot}>
                    <img
                        id="screenshot"
                        css={css`
                            height: 55px;`
                        }
                        src={screenshot}
                        alt="스크린샷 이미지" />
                </button>
                <span>
                    {
                        `장착 아이템 확률 : ${
                            Math.round(
                                calculatedItemData
                                    .filter((v) => v.isEquipItem)
                                    .map((v) => v.probability)
                                    .reduce((cur, acc) => cur + acc) * 1000
                            ) / 1000
                        }%`
                    }
                </span>
                <button
                    css={css`
                        background-color: transparent;
                        border: 0;
                        outline: 0;
                        width: 90px;
                        cursor: pointer;
                        padding: 0 5px;
                    `}
                    onClick={toggleLevel}>
                    <img
                        css={css`
                            width: 100%;
                        `}
                        src={level === "high" ? high : low}
                        alt="종류 변경 이미지"/>
                </button>
            </footer>
        </ThemeContext.Provider>
    );
};

export default App;