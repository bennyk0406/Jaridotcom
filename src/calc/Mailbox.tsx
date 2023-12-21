/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { forwardRef, useState } from "react";
import Input from "../components/Input";

const Mailbox = forwardRef<HTMLDivElement>((_, ref) => {
    const [ currentMailbox, setCurrentMailbox ] = useState<number | "">(42);
    const [ goalMailbox, setGoalMailbox ] = useState<number | "">(42);
    const [ requiredRuble, setRequiredRuble ] = useState(0);

    const calculateRequiredRuble = (current: number, goal: number) => {
        setRequiredRuble(Math.max(50 * (goal - current) * (current + goal - 74), 0));
    };

    const editValues = () => {
        const size = {
            current: currentMailbox || 0,
            goal: goalMailbox || 0
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
                우체통 계산기
            </p>
            <label>
                현재 우체통 :
                <Input
                    width={50}
                    value={currentMailbox}
                    action={
                        (e) => {
                            const value = e.target.valueAsNumber;
                            setCurrentMailbox(value || "");
                            calculateRequiredRuble(value || 0, goalMailbox || 0);
                        }
                    }
                    onBlur={() => editValues()}
                    style={css`
                        margin: 0 5px 0 10px;
                    `}
                />
                칸
            </label>
            <label>
                목표 우체통 :
                <Input
                    width={50}
                    value={goalMailbox}
                    action={
                        (e) => {
                            const value = e.target.valueAsNumber;
                            setGoalMailbox(value || "");    
                            calculateRequiredRuble(currentMailbox || 0, value || 0);
                        }
                    }
                    onBlur={() => editValues()}
                    style={css`
                        margin: 0 5px 0 10px;
                    `}
                />
                칸
            </label>
            <p>
                필요한 루블 : {requiredRuble.toLocaleString()}
            </p>
        </div>
    );
});

export default Mailbox;