import { useState } from "react";
import CalculatorHeader from "../components/CalculatorHeader";
import postcardSvg from "../assets/postcard.png";

const Authority = () => {
    const [ fame, setFame ] = useState(20);

    return (
        <section id="authority">
            <CalculatorHeader src={postcardSvg} title="권위의 엽서 계산기" />
            <article>
                <label>
                    현재 명성 :
                    <input
                        type="number"
                        id="fame"
                        defaultValue={0}
                        onChange={
                            (e) => {
                                const value = e.target.valueAsNumber || 0;
                                setFame(value < 0 ? 20 : Math.floor(20 + (1.2 * Math.sqrt(value))));
                            }
                        }
                    />
                </label>
                <p id="postcard-fame">
                    권위의 엽서 명성 : -{fame.toLocaleString()}
                </p>
            </article>
        </section>
    );
};

export default Authority;