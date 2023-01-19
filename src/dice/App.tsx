/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../theme-context";
import Header from "../components/Header";
import type { Theme } from "../theme-context";
import { type SerializedStyles, css } from "@emotion/react";
import Key from "./Key";
import ExpDisplay from "./ExpDisplay";
import fameProb from "./data/diceProb";

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

    const [ expressions, setExpressions ] = useState<string[][]>([ [], [], [] ]);
    const [ expressionIndex, setExpressionIndex ] = useState<number>(0);

    const appendExpression = (value: string) => {
        setExpressions((expressions) => {
            try {
                const newExps = structuredClone(expressions);
                newExps[expressionIndex].push(value);
                return newExps;
            }
            catch (e) {
                alert(e);
                return expressions;
            }
        });
    };

    const [ diceProb, setDiceProb ] = useState<number>(0);
    const [ gift, setGift ] = useState<number>(0);

    let timer: NodeJS.Timeout;
    let isMouseDown = false;

    const holding = () => {
        if (timer !== undefined) clearTimeout(timer);
        if (isMouseDown) {
            setExpressions((expressions) => {
                const newExps = structuredClone(expressions);
                newExps[expressionIndex] = [];
                return newExps;
            });
        }
    };

    const mouseDown = () => {
        isMouseDown = true;
        timer = setTimeout(holding, 500);
    };

    const mouseUp = () => {
        isMouseDown = false;
    };

    const calculateProb = () => {
        const exp = expressions.map((v) => v.join("")
            .replace("=홀", "%2=1")
            .replace("=짝", "%2=0")
            .replace("=", "==")
            .replace("≥", ">=")
            .replace("≤", "<=")
            .replaceAll("×", "*")
            .replaceAll("÷", "/")
            .replaceAll("명성", "fame")
            .replaceAll("명", "Math.floor(fame / 10)")
            .replaceAll("성", "fame % 10")
            .replaceAll("일수", "day")
            .replaceAll("일", "Math.floor(day / 10)")
            .replaceAll("수", "day % 10"));
        const [ exp1, exp2, exp3 ] = exp.map((v) =>
            new Function("fame", "day", `return ${v === "" ? true : v}`));
        if (exp.some((v) => v.includes("짝수") || v.includes("홀수"))) {
            alert("유효하지 않은 식입니다.");
            return;
        }
        const conditionalFames = [];
        for (let fame = 1; fame < 52; fame++) {
            for (let day = 0; day < 40; day++) {
                try {
                    const cond1 = exp1(fame, day);
                    const cond2 = exp2(fame, day);
                    const cond3 = exp3(fame, day);
                    if (typeof cond1 !== "boolean" || typeof cond2 !== "boolean" || typeof cond3 !== "boolean") {
                        throw new Error("유효하지 않은 식입니다.");
                    }
                    if (cond1 && cond2 && cond3) conditionalFames.push(fame);
                }
                catch (err) {
                    alert(err);
                    return;
                }
            }
        }
        const prob = conditionalFames.reduce((acc, cur) => acc + (fameProb[cur - 1] / 100 / 40), 0);
        setDiceProb(prob);
    };

    interface AppendKeyProps extends React.PropsWithChildren {
        content: string;
        style?: SerializedStyles;
        operator?: boolean;
        number?: boolean;
    }

    const AppendKey: React.FC<AppendKeyProps> = (props) =>
        (<Key
            content={props.content}
            action={appendExpression}
            style={props.style}
            operator={props.operator}
            number={props.number}/>);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Header />
            <main css={css`
                flex-grow: 1;
                color: ${theme === "light" ? "black" : "white"};
                background-color: ${theme === "light" ? "white" : "#2d2d32"};
                overflow-y: scroll;
                font-size: 18px;
                margin: 0;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
            `}>
                <div css={css`
                    padding: 10px;
                    max-width: 500px;
                    width: 100%;
                    box-sizing: border-box;
                `}>
                    {[ 0, 1, 2 ].map((v) =>
                        (<ExpDisplay
                            style={css`
                                border: ${expressionIndex === v ? "1px solid black" : "1px solid #dadce0"};
                            `}
                            key={v}
                            expression={expressions[v]}
                            action={() => setExpressionIndex(v)}
                        />
                        ))}
                    <div css={css`
                        display: grid;
                        width: 100%;
                        grid-template-columns: repeat(5, 1fr);
                    `}>
                        <AppendKey content="("/>
                        <AppendKey content=")"/>
                        <Key
                            content="계산"
                            action={calculateProb}
                            style={css`
                                grid-column: 3/5;
                                background: #4285f4;
                                color: #ffffff;
                            `}
                        />
                        <Key
                            content="CE"
                            action={() =>
                                setExpressions((expressions) => {
                                    const newExps = structuredClone(expressions);
                                    newExps[expressionIndex] = newExps[expressionIndex].slice(0, -1);
                                    return newExps;
                                })
                            }
                            onMouseDown={mouseDown}
                            onMouseUp={mouseUp}
                        />
                        <AppendKey
                            content="명성"
                            style={css`
                                grid-column: 1/3;
                            `}
                        />
                        <AppendKey content="명"/>
                        <AppendKey content="성"/>
                        <AppendKey content="홀"/>
                        <AppendKey
                            content="일수"
                            style={css`
                                grid-column: 1/3;
                            `}
                        />
                        <AppendKey content="일"/>
                        <AppendKey content="수"/>
                        <AppendKey content="짝"/>
                        <AppendKey
                            content="7"
                            number
                        />
                        <AppendKey
                            content="8"
                            number
                        />
                        <AppendKey
                            content="9"
                            number
                        />
                        <AppendKey
                            content="÷"
                            operator
                        />
                        <AppendKey
                            content="<"
                            operator
                        />
                        <AppendKey
                            content="4"
                            number
                        />
                        <AppendKey
                            content="5"
                            number
                        />
                        <AppendKey
                            content="6"
                            number
                        />
                        <AppendKey
                            content="×"
                            operator
                        />
                        <AppendKey
                            content="≤"
                            operator
                        />
                        <AppendKey
                            content="1"
                            number
                        />
                        <AppendKey
                            content="2"
                            number
                        />
                        <AppendKey
                            content="3"
                            number
                        />
                        <AppendKey
                            content="-"
                            operator
                        />
                        <AppendKey
                            content=">"
                            operator
                        />
                        <AppendKey
                            content="0"
                            number
                        />
                        <AppendKey
                            content="."
                            number
                        />
                        <AppendKey
                            content="="
                            operator
                        />
                        <AppendKey
                            content="+"
                            operator
                        />
                        <AppendKey
                            content="≥"
                            operator
                        />
                    </div>
                    <div css={css`
                        margin-top: 15px;
                        padding: 0 5px;
                    `}>
                        <p css={css`
                            display: flex;
                            align-items: center;
                        `}>
                            보상:
                            <input
                                type="number"
                                css={css`
                                    display: inline-block;
                                    margin: 0 5px 0 10px;
                                    width: 50px;
                                    background: #00000033;
                                    border: none;
                                    border-radius: 3px;
                                    font-family: "Noto Sans KR", sans-serif;
                                    font-weight: 500;
                                    font-size: 17px;
                                    height: 20px;
                                    text-align: right;
                                    padding: 3px 5px;
                                `}
                                onChange={
                                    (e) => {
                                        const value = e.target.valueAsNumber || 0;
                                        setGift(value);
                                    }
                                }
                            ></input>
                            개
                        </p>
                        <p>
                            확률: {Math.round(diceProb * 10000) / 100}%
                        </p>
                        <p>
                            기댓값: {Math.round(gift * diceProb * 100) / 100}개
                        </p>
                    </div>
                </div>
            </main>
        </ThemeContext.Provider>
    );
};

export default App;