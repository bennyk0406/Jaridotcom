import { useState } from "react";
import CalculatorHeader from "../components/CalculatorHeader";
import exchangeSvg from "../assets/exchange.svg";

type TradeMode = "sell"|"buy";

const Exchange = () => {
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
        <section id="exchange">
            <CalculatorHeader src={exchangeSvg} title="환율 계산기" />
            <article>
                <div>
                    <label className="radio-container">
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
                    <label className="radio-container">
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
                <div id="label-container">
                    <label>
                        판매 :
                        <input
                            type="number"
                            className="exchange-input"
                            disabled={tradeMode === "buy"}
                            value={ruble ?? ""}
                            onChange={
                                (e) => {
                                    const value = e.target.valueAsNumber || 0;
                                    setRuble(value);
                                    calculateGettableMoney(value, rate ?? 0);
                                }
                            }
                        />
                        루블
                    </label>
                    <label>
                        구매 :
                        <input
                            type="number"
                            className="exchange-input"
                            disabled={tradeMode === "sell"}
                            value={luna ?? ""}
                            onChange={
                                (e) => {
                                    const value = e.target.valueAsNumber || 0;
                                    setLuna(value);
                                    calculateGettableMoney(value, rate ?? 0);
                                }
                            }
                        />
                        루나
                    </label>
                    <label>
                        환율 :
                        <input
                            type="number"
                            className="exchange-input"
                            defaultValue={1000}
                            onChange={
                                (e) => {
                                    const value = e.target.valueAsNumber || 0;
                                    setRate(value);
                                    calculateGettableMoney((tradeMode === "sell" ? ruble : luna) ?? 0, value);
                                }
                            }
                        />
                    </label>
                    <p id="gettable-money">
                        얻을 수 있는 {tradeMode === "sell" ? "루나" : "루블"} : {gettableMoney.toLocaleString()}
                    </p>
                </div>
            </article>
        </section>
    );
};

export default Exchange;