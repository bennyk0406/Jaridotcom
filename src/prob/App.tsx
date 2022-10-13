import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../theme-context";
import Header from "../components/Header";
import itemData from "./data/";
import high from "../assets/high.png";
import low from "../assets/low.png";
import screenshot from "../assets/screenshot.svg";
import "./style.css";
import type { Theme } from "../theme-context";
import html2canvas from "html2canvas";

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
        setCalculatedItemData(resultItemData);
    };

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
            <main>
                <table className="item-table">
                    <thead>
                        <tr id="item-table-header">
                            <th id="checkbox-raw">
                                <input id="select-all-checkbox" type="checkbox" onChange={(e) => toggleAllchecked(e.target.checked)} checked={checkedData.every((v) => v)} />
                            </th>
                            <th id="name-raw">
                                아이템
                            </th>
                            <th id="probability-raw">
                                확률
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {calculatedItemData.map((v, i) =>
                            <tr key={v.name}>
                                <td>
                                    {v.isEquipItem && <input type="checkbox" onChange={() => toggleCheckedData(i)} checked={checkedData[i] ?? false} />}
                                </td>
                                <td>
                                    {v.name}
                                </td>
                                <td>
                                    {`${v.probability}%`}
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </main>
            <footer>
                <button type="button" id="screenshot-button" onClick={() => takeScreenshot()}>
                    <img id="screenshot" src={screenshot} alt="스크린샷 이미지" />
                </button>
                <span id="total-probability">
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
                <button type="button" id="gashapon-button" onClick={() => toggleLevel()}>
                    <img className="gashapon-img" src={level === "high" ? high : low} alt="종류 변경 이미지" />
                </button>
            </footer>
        </ThemeContext.Provider>
    );
};

export default App;