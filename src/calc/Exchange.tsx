/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { forwardRef, useState } from "react";
import Input from "../components/Input";

type TradeMode = "sell" | "buy";

const Exchange = forwardRef<HTMLDivElement>((_, ref) => {
    const [ tradeMode, setTradeMode ] = useState<TradeMode>("sell");
    const [ gettableMoney, setGettableMoney ] = useState<number>(0);
    const [ ruble, setRuble ] = useState<number|undefined>(0);
    const [ luna, setLuna ] = useState<number|undefined>(undefined);
    const [ rate, setRate ] = useState<number|undefined>(1000);

    const calculateGettableMoney = (money: number, rate: number) => {
        if (tradeMode === "sell") setGettableMoney(Math.floor(money * rate / 1000000));
        else {
            if (rate !== 0) setGettableMoney(Math.floor((money / rate * 1000000 / 1.35) / 1000) * 1000);
            else setGettableMoney(0);
        }
    };

    return (
        <div
            ref={ref}
            css={css`
                display: flex;
                flex-direction: column;
                gap: 15px;
                border-radius: 10px;
                background-color: var(--section);
                padding: 0 15px 10px;
            `}
        >
            <p css={css`
                text-align: center;
                font-size: 18px;
                padding: 10px 0;
                border-bottom: 1px dashed gray;
            `}>
                환율 계산기
            </p>
            <div>
                <label css={css`
                    margin-right: 5px;
                `}>
                    <input
                        type="radio"
                        className="select"
                        onChange={
                            () => {
                                setRuble(0);
                                setLuna(undefined);
                                setTradeMode("sell");
                                calculateGettableMoney(0, rate ?? 0);
                            }
                        }
                        checked={tradeMode === "sell"}
                    />
                    판매
                </label>
                <label>
                    <input
                        type="radio"
                        className="select"
                        onChange={
                            () => {
                                setRuble(undefined);
                                setLuna(0);
                                setTradeMode("buy");
                                calculateGettableMoney(0, rate ?? 0);
                            }
                        }
                        checked={tradeMode === "buy"}
                    />
                    구매
                </label>
            </div>
            <div css={css`
                display: flex;
                flex-direction: column;
                gap: 10px;
            `}>
                <label>
                    판매 :
                    <Input
                        width={100}
                        disabled={tradeMode === "buy"}
                        value={ruble ?? ""}
                        action={
                            (e) => {
                                const value = e.target.valueAsNumber || 0;
                                setRuble(value);
                                calculateGettableMoney(value, rate ?? 0);
                            }
                        }
                        style={css`
                            margin: 0 5px 0 10px;
                        `}
                    />
                    루블
                </label>
                <label>
                    구매 :
                    <Input
                        width={100}
                        disabled={tradeMode === "sell"}
                        value={luna ?? ""}
                        action={
                            (e) => {
                                const value = e.target.valueAsNumber || 0;
                                setLuna(value);
                                calculateGettableMoney(value, rate ?? 0);
                            }
                        }
                        style={css`
                            margin: 0 5px 0 10px;
                        `}
                    />
                    루나
                </label>
                <label>
                    환율 :
                    <Input
                        width={100}
                        defaultValue={1000}
                        action={
                            (e) => {
                                const value = e.target.valueAsNumber || 0;
                                setRate(value);
                                calculateGettableMoney((tradeMode === "sell" ? ruble : luna) ?? 0, value);
                            }
                        }
                        style={css`
                            margin: 0 5px 0 10px;
                        `}
                    />
                </label>
                <p>
                    얻을 수 있는 {tradeMode === "sell" ? "루나" : "루블"} : {gettableMoney.toLocaleString()}
                </p>
            </div>
        </div>
    );
});

export default Exchange;