import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../theme-context";
import Header from "../components/Header";
import itemData from "./data/";
import high from "../assets/high.png";
import low from "../assets/low.png";
import "./style.css";
import type { Theme } from "../theme-context";

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

    // CHUSEOK
    const [ pink, setPink ] = useState<number|undefined>(0);
    const [ songgi, setSonggi ] = useState<number|undefined>(0);
    const [ flower, setFlower ] = useState<number|undefined>(0);
    const [ pig, setPig ] = useState<number|undefined>(0);
    // CHUSEOK

    const [ calculatedItemData, setCalculatedItemData ] = useState<Item[]>(itemData[level]);

    const changeProbability = () => {
        const weight = 1 + (0.025 * (pink ?? 0)) + (0.05 * (songgi ?? 0)) + (0.1 * (flower ?? 0)) + (0.2 * (pig ?? 0));
        const copiedItemData = itemData[level].map((value, i) => ({
            ...value,
            probability: checkedData[i] ? 0 : value.probability
        }));
        const uncheckedProbability = copiedItemData
            .map((v) => v.probability)
            .reduce((acc, cur) => acc + cur);
        const resultItemData = copiedItemData.map((value) => ({
            ...value,
            probability: value.probability * (100 / uncheckedProbability)
        }));

        // CHUSEOK
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

    useEffect(() => {
        changeProbability();
    }, [ pink, songgi, flower, pig ]);

    useEffect(() => {
        for (let i = 0; i < checkedData.length; i++) {
            localStorage.setItem(itemData[level][i].name, checkedData[i].toString());
        }
        changeProbability();
    }, [ checkedData ]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Header />
            <main>
                <div id="songpyeon-container">
                    <label>
                        분홍 송편:
                        <div className="amount">
                            <input
                                className="songpyeon"
                                type="number"
                                value={pink ?? ""}
                                onChange={(e) => {
                                    const amount = e.target.valueAsNumber;
                                    if (isNaN(amount)) {
                                        setPink(undefined);
                                    }
                                    else {
                                        if (amount > 4) setPink(4);
                                        else setPink(e.target.valueAsNumber);
                                    }
                                }}>
                            </input>
                            개
                        </div>
                    </label>
                    <label>
                        송기 송편:
                        <div className="amount">
                            <input
                                className="songpyeon"
                                type="number"
                                value={songgi ?? ""}
                                onChange={(e) => {
                                    const amount = e.target.valueAsNumber;
                                    if (isNaN(amount)) {
                                        setSonggi(undefined);
                                    }
                                    else {
                                        if (amount > 4) setSonggi(4);
                                        else setSonggi(e.target.valueAsNumber);
                                    }
                                }}>
                            </input>
                            개
                        </div>
                    </label>
                    <label>
                        꽃 송편:
                        <div className="amount">
                            <input
                                className="songpyeon"
                                type="number"
                                value={flower ?? ""}
                                onChange={(e) => {
                                    const amount = e.target.valueAsNumber;
                                    if (isNaN(amount)) {
                                        setFlower(undefined);
                                    }
                                    else {
                                        if (amount > 4) setFlower(4);
                                        else setFlower(e.target.valueAsNumber);
                                    }
                                }}>
                            </input>
                            개
                        </div>
                    </label>
                    <label>
                        돼지 송편:
                        <div className="amount">
                            <input
                                className="songpyeon"
                                type="number"
                                value={pig ?? ""}
                                onChange={(e) => {
                                    const amount = e.target.valueAsNumber;
                                    if (isNaN(amount)) {
                                        setPig(undefined);
                                    }
                                    else {
                                        if (amount > 4) setPig(4);
                                        else setPig(e.target.valueAsNumber);
                                    }
                                }}>
                            </input>
                            개
                        </div>
                    </label>
                </div>
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