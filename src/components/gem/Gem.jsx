import cn from "classnames";
import styles from "./gem.module.scss";

export default function Gem({ data, stoneStatusHandler }) {
  const { id, color, img, disabled, hide } = data;

  const clickAction = () => {
    stoneStatusHandler({ id, color });
  };

  return (
    <button className={cn(styles.gem, styles[`${hide ? "gem--hide" : ""}`])} disabled={disabled ? "disabled" : ""} onClick={clickAction}>
      <img src={img} alt="icon" />
    </button>
  );
}
