import { useState } from "react";
import CalculatorHeader from "../components/CalculatorHeader";
import mailboxSvg from "../assets/mailbox.svg";

const Mailbox = () => {
    const [ currentMailbox, setCurrentMailbox ] = useState(42);
    const [ goalMailbox, setGoalMailbox ] = useState(42);
    const [ requiredRuble, setRequiredRuble ] = useState(0);

    const calculateRequiredRuble = (current: number, goal: number) => {
        setRequiredRuble(Math.max(50 * (goal - current) * (current + goal - 74), 0));
    };

    const editValues = () => {
        const size = {
            current: currentMailbox,
            goal: goalMailbox
        };
        if (size.current < 42) size.current = 42;
        if (size.current % 10 !== 2) size.current = (Math.ceil((size.current - 2) / 10) * 10) + 2;
        if (size.goal < size.current) size.goal = size.current;
        if (size.goal < 42) size.goal = 42;
        if (size.goal % 10 !== 2) size.goal = (Math.ceil((size.goal - 2) / 10) * 10) + 2;
        setCurrentMailbox(size.current);
        setGoalMailbox(size.goal);
        calculateRequiredRuble(size.current, size.goal);
    };

    return (
        <section id="mailbox">
            <CalculatorHeader src={mailboxSvg} title="우체통 계산기" />
            <article>
                <label>
                    현재 우체통 :
                    <input
                        type="number"
                        className="mailbox-input"
                        value={currentMailbox}
                        onChange={
                            (e) => {
                                const value = e.target.valueAsNumber || 0;
                                setCurrentMailbox(value);
                                calculateRequiredRuble(value, goalMailbox);
                            }
                        }
                        onBlur={() => editValues()}
                    />
                    칸
                </label>
                <label>
                    목표 우체통 :
                    <input
                        type="number"
                        className="mailbox-input"
                        value={goalMailbox}
                        onChange={
                            (e) => {
                                const value = e.target.valueAsNumber || 0;
                                setGoalMailbox(value);
                                calculateRequiredRuble(currentMailbox, value);
                            }
                        }
                        onBlur={() => editValues()}
                    />
                    칸
                </label>
                <p id="mailbox-required-ruble">
                    필요한 루블 : {requiredRuble.toLocaleString()}
                </p>
            </article>
        </section>
    );
};

export default Mailbox;