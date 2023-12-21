/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { forwardRef, useState } from "react";
import Input from "../components/Input";

const Authority = forwardRef<HTMLDivElement>((_, ref) => {
    const [ fame, setFame ] = useState(20);

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
                권위의 엽서 계산기
            </p>
            <label>
                현재 명성 :
                <Input
                    width={70}
                    defaultValue={0}
                    action={
                        (e) => {
                            const value = e.target.valueAsNumber || 0;
                            setFame(value < 0 ? 20 : 20 + Math.floor(1.2 * Math.sqrt(value)));
                        }
                    }
                    style={css`
                        margin: 0 5px 0 10px;
                    `}
                />
            </label>
            <p id="postcard-fame">
                권위의 엽서 명성 : -{fame.toLocaleString()}
            </p>
        </div>
    );
});

export default Authority;