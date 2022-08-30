import { useState } from "react";
import CalculatorHeader from "../components/CalculatorHeader";
import cardSvg from "../assets/card.svg";

const Card = () => {
    const [ tierThreeAmount, setTierThreeAmount ] = useState<number|undefined>(0);
    const [ tierFourAmount, setTierFourAmount ] = useState<number|undefined>(0);
    const [ tierFiveAmount, setTierFiveAmount ] = useState<number|undefined>(0);
    const [ requiredCardAmount, setRequiredCardAmount ] = useState(0);
    const [ requiredRuble, setRequiredRuble ] = useState(0);

    const changeCardInfo = (rawAmount: number, tier: number) => {
        const amountData = {
            three: tierThreeAmount ?? 0,
            four: tierFourAmount ?? 0,
            five: tierFiveAmount ?? 0
        };

        switch (tier) {
            case 3: {
                if (isNaN(rawAmount)) {
                    amountData.three = 0;
                    setTierThreeAmount(undefined);
                }
                else {
                    const amount = Math.min(120, rawAmount);
                    amountData.three = amount;
                    setTierThreeAmount(amount);
                }
                break;
            }
            case 4: {
                if (isNaN(rawAmount)) {
                    amountData.four = 0;
                    setTierFourAmount(undefined);
                }
                else {
                    const amount = Math.min(30, rawAmount);
                    amountData.four = amount;
                    setTierFourAmount(amount);
                }
                break;
            }
            case 5: {
                if (isNaN(rawAmount)) {
                    amountData.five = 0;
                    setTierFiveAmount(undefined);
                }
                else {
                    const amount = Math.min(6, rawAmount);
                    amountData.five = amount;
                    setTierFiveAmount(amount);
                }
                break;
            }
        }
        const requiredAmount = {
            four: Math.max((5 * (6 - amountData.five)) - amountData.four, 0),
            five: Math.max(6 - amountData.five, 0)
        };
        setRequiredCardAmount(Math.max(120 - amountData.three - (4 * amountData.four) - (20 * amountData.five), 0));
        setRequiredRuble(1000000 + (500000 * requiredAmount.five) + (100000 * requiredAmount.four));
    };

    return (
        <section id="card">
            <CalculatorHeader src={cardSvg} title="카드 계산기" />
            <article>
                <label>
                    3티어 카드 개수 :
                    <input
                        type="number"
                        className="card-input"
                        value={tierThreeAmount ?? ""}
                        onChange={(e) => {
                            const changedAmount = e.target.valueAsNumber;
                            changeCardInfo(changedAmount, 3);
                        }}
                    />
                    개
                </label>
                <label>
                    4티어 카드 개수 :
                    <input
                        type="number"
                        className="card-input"
                        value={tierFourAmount ?? ""}
                        onChange={(e) => {
                            const changedAmount = e.target.valueAsNumber;
                            changeCardInfo(changedAmount, 4);
                        }}
                    />
                    개
                </label>
                <label>
                    5티어 카드 개수 :
                    <input
                        type="number"
                        className="card-input"
                        value={tierFiveAmount ?? ""}
                        onChange={(e) => {
                            const changedAmount = e.target.valueAsNumber;
                            changeCardInfo(changedAmount, 5);
                        }}
                    />
                    개
                </label>
                <p id="card-required-amount">
                    추가로 필요한 3티어 카드 개수 : {requiredCardAmount}
                </p>
                <p id="card-required-ruble">
                    6티어 강화까지 필요한 루블 : {requiredRuble.toLocaleString()}
                </p>
            </article>
        </section>
    );
};

export default Card;