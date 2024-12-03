import { useEffect, useMemo, useState } from "react";
import { gems } from "../../data/gemsData";
import cn from "classnames";
import styles from "./game.module.scss";
import Button from "../button/Button";
import Gem from "../gem/Gem";

export default function Game() {
  const initialStonesStatus = gems.map((gem) => {
    return {
      ...gem,
      disabled: true,
      hide: false,
    };
  });

  const [stonesStatus, setStonesStatus] = useState(initialStonesStatus);
  const [gameStarted, setGameStarted] = useState(false);
  const [pairedStones, setPairedStones] = useState([]);
  const [foundPairs, setFoundPairs] = useState(0);

  //setStates
  const setStateStonesStatus = (stonesStatus) => {
    setStonesStatus(stonesStatus);
  };

  const setStatePairedStones = (obj) => {
    if (pairedStones.length === 2) {
      setPairedStones([obj]);
      return;
    }
    setPairedStones([...pairedStones, obj]);
  };

  const setStateFoundPairs = (num) => {
    setFoundPairs(num);
  };

  const handleStartGame = () => {
    setGameStarted((prev) => !prev);
  };

  useEffect(() => {
    if (gameStarted) {
      setStateStonesStatus(
        stonesStatus.map((gem) => {
          return {
            ...gem,
            disabled: false,
            hide: true,
          };
        })
      );
    }

    if (!gameStarted) {
      setStateStonesStatus(
        stonesStatus.map((gem) => {
          return {
            ...gem,
            disabled: true,
            hide: false,
          };
        })
      );
      setFoundPairs(0);
    }
  }, [gameStarted]);

  const isMatched = () => {
    if (pairedStones.length < 2) {
      return false;
    }
    if (pairedStones[0].color === pairedStones[1].color) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (isMatched()) {
      // значит пара найдена
      const idsMatched = [pairedStones[0].id, pairedStones[1].id];
      setStateStonesStatus(
        stonesStatus.map((gem) => {
          if (idsMatched.includes(gem.id)) {
            return {
              ...gem,
              disabled: true,
              hide: false,
            };
          }
          return gem;
        })
      );
      setStateFoundPairs(foundPairs + 1);
    }
  }, [pairedStones]);

  const stoneStatusHandler = (obj) => {
    if (pairedStones.length === 1 && pairedStones[0].id === obj.id) {
      return;
    }
    setStatePairedStones(obj);
  };

  const checkTotalPairs = () => {
    console.log("checkTotalPairs");
    return Object.values(
      stonesStatus.reduce((acc, gem) => {
        if (acc[gem.color]) {
          acc[gem.color] += 1;
        } else {
          acc[gem.color] = 1;
        }
        return acc;
      }, {})
    ).reduce((acc, num) => {
      let result = Math.floor(num / 2);
      return acc + result;
    }, 0);
  };

  const memoCheckTotalPairs = useMemo(() => checkTotalPairs(), []);

  return (
    <div className={cn(styles.game)}>
      <div className={cn(styles[`game__button`])}>
        {console.log(gameStarted)}
        <Button use="start" text={gameStarted ? "Finish game" : "Start Game"} handler={handleStartGame} />
      </div>
      <div className={cn(styles[`game__info`])}>
        <p className={cn(styles[`game__found`])}>Found parts: {gameStarted ? foundPairs : 0}</p>
        <p className={cn(styles[`game__total`])}>Total parts: {memoCheckTotalPairs}</p>
      </div>
      <div className={cn(styles[`game__field`])}>
        {stonesStatus.map((gem) => (
          <Gem key={gem.id} data={gem} stoneStatusHandler={stoneStatusHandler} />
        ))}
      </div>
    </div>
  );
}
