/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import itemData from "./data";
import html2canvas from "html2canvas";
import { css } from "@emotion/react";

const levels = ["low", "high", "legend"] as const;
type Level = typeof levels[number];

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

// interface SongpyeonProps {
//     name: string;
//     value: number | undefined;
//     onChange: (e: ChangeEvent<HTMLInputElement>) => void;
// }

// const Songpyeon: React.FC<SongpyeonProps> = (props) => {
//     return (
//         <label css={css`
//             display: flex;
//             justify-content: space-between;
//         `}>
//             {props.name}:
//             <div css={css`
//                 display: inline-block;
//             `}>
//                 <input
//                     css={css`
//                         width: 50px;
//                         background-color: transparent;
//                         color: var(--text);
//                         border: 1px solid var(--text);
//                         box-shadow: none;
//                         margin: 0 4px 0 0;
//                         font-size: 15px;
//                         text-align: right;
//                     `}
//                     type="number"
//                     value={props.value ?? ""}
//                     onChange={props.onChange}
//                 />
//                 개
//             </div>
//         </label>
//     )
// };

const Prob = () => {
    const [ level, setLevel ] = useState<Level>("high");
    const toggleLevel = () => {
        setLevel((level) => levels[(levels.indexOf(level) + 1) % 3]);
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
    // const [ pink, setPink ] = useState<number|undefined>(0);
    // const [ songgi, setSonggi ] = useState<number|undefined>(0);
    // const [ flower, setFlower ] = useState<number|undefined>(0);
    // const [ pig, setPig ] = useState<number|undefined>(0);
    // const [ clan, setClan ] = useState<number|undefined>(0);
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
            probability: uncheckedProbability === 0 ? 0 : Math.round(value.probability * (100 / uncheckedProbability) * 1000) / 1000
        }));
        setCalculatedItemData(resultItemData);

        // CHUSEOK
        // const weight = 1 + (0.025 * (pink ?? 0)) + (0.05 * (songgi ?? 0)) + (0.1 * (flower ?? 0)) + (0.2 * (pig ?? 0)) + (0.25 * (clan ?? 0));
        // const equipItemTotalProbability = resultItemData
        //     .filter((v) => v.isEquipItem)
        //     .map((v) => v.probability)
        //     .reduce((acc, cur) => acc + cur);
        // const weightedResultItemData = resultItemData
        //     .map((v) => {
        //         if (v.isEquipItem) {
        //             v.probability *= weight;
        //         }
        //         else {
        //             v.probability *= (100 - (weight * equipItemTotalProbability)) / (100 - equipItemTotalProbability);
        //         }
        //         return v;
        //     })
        //     .map((value) => ({
        //         ...value,
        //         probability: Math.round(value.probability * 1000) / 1000
        //     }));

        // setCalculatedItemData(weightedResultItemData);
    };

    // CHUSEOK
    // useEffect(() => {
    //     changeProbability();
    // }, [ pink, songgi, flower, pig, clan ]);

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
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.alignItems = "center";

        const [ header ] = document.getElementsByTagName("header")
        const wrapper = document.getElementById("wrapper");
        if (!wrapper || !header) return;
        
        div.appendChild(header.cloneNode(true));
        div.appendChild(wrapper.cloneNode(true));
    
        document.body.appendChild(div);
        const canvas = await html2canvas(div, {
            scrollX: 0,
            scrollY: 0,
            allowTaint: true,
            useCORS: true,
            onclone: async (clonedDoc) => {
                const lvl = clonedDoc.getElementById("level");
                lvl?.remove();
            }
        });
        div.remove()
        const element = document.createElement("a");
        element.href = canvas.toDataURL("image/png");
        element.download = `${getFormattedTime()}-jaricom.png`;
        if ([ "iphone", "ipad", "ipod" ].some((v) => v.includes(navigator.userAgent))) element.target = "_blank";
        document.body.appendChild(element);
        element.click();
        element.remove();
    };

    return (
        <div css={css`
            display: flex;
            flex-direction: column;
            overflow-y: hidden;
            height: 100%;
            align-items: center;
        `}>
            <header css={css`
                width: 100%;
                height: 60px;
                flex-basis: 60px;
                flex-grow: 0;
                flex-shrink: 0;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                background-color: var(--background);
                border-bottom: 1px solid var(--border);
            `}>
                <img src="./assets/screenshot.svg" css={css`
                    box-sizing: border-box;
                    padding: 10px;
                    margin-left: 5px;
                    height: 95%;
                `} onClick={takeScreenshot}/>
                <span css={css`
                    font-weight: bold;
                    font-size: 18px;
                `}>
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
                <div onClick={toggleLevel} css={css`
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 0 10px;
                    font-size: 14px;
                    width: 50px;
                `}>
                    <img src="./assets/luna.svg" id="level" css={css`
                        height: 45%;
                        display: block;
                    `}/>
                    {level[0].toUpperCase() + level.slice(1)}
                </div>
            </header>
            {/* <div css={css`
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
            </div> */}
            <div id="wrapper" css={css`
                width: 90%;
                flex-grow: 1;
                overflow-y: auto;
                padding: 20px 0;
            `}>
                <table css={css`
                    width: 100%;
                    table-layout: fixed;
                    border-collapse: collapse;
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
            </div>
        </div>
    );
};

export default Prob;